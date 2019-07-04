const axios = require('axios');
const readline = require('readline-sync');
const request = require('request');
const Stop = require('./Stop.js');
const express = require('express');

function getStopCodeFromUser(){
    console.log("Please enter the stop code: ");
    const stopCode = readline.prompt();
}

function getArrivalsURL(stopCode){
    const address = 'https://api.tfl.gov.uk/StopPoint/'+stopCode+'/Arrivals';
    return address;
}

function getPostcodeURL(){
    console.log("Please enter the postcode: ");
    const postcode = readline.prompt();
    const address = 'https://api.postcodes.io/postcodes/'+postcode;
    return address;
}

async function httpRequest(address){
    return new Promise((resolve,reject) => {
        request(address, function (error, response, body) {
            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            //console.log('body:', body); // Print the HTML for the Google homepage.
            resolve(body);
        });
    });   
}

async function getArrivalsData(stopCode){
    const arrivalsJSON = await httpRequest(getArrivalsURL(stopCode));
    let arrivalsData = JSON.parse(arrivalsJSON);
    arrivalsData = arrivalsData.sort((a,b)=> {return a.timeToStation - b.timeToStation});
    console.log("Next 5 buses arriving at "+stopCode+" is: ");
    if (arrivalsData.length<5){
        for(let i=0;i<arrivalsData.length;i++){
            let timeToArrival = Math.round(arrivalsData[i].timeToStation/60); 
            console.log("Bus: "+arrivalsData[i].lineId+" Destination: "+arrivalsData[i].destinationName+" Time until arrival: "+timeToArrival);
        }
    }
    else{
        for(let i=0;i<5;i++){
            let timeToArrival = Math.round(arrivalsData[i].timeToStation/60); 
            console.log("Bus: "+arrivalsData[i].lineId+" Destination: "+arrivalsData[i].destinationName+" Time until arrival: "+timeToArrival);
        }
    }
    
}

function getStops(stops){
    const stopsData = JSON.parse(stops);
    const stopsArray = [];
    for (stop of stopsData.stopPoints){
        stopsArray.push(new Stop(stop.children[0].id,stop.distance));
    }
    return stopsArray;
}

async function getStopCode(postcodeURL){
    const postcodeJSON = await httpRequest(getPostcodeURL());
    const postcodeData = JSON.parse(postcodeJSON);

    const lat = postcodeData.result.latitude;
    const lon = postcodeData.result.longitude;
    let stops = [];
    const stopsCluster = await httpRequest('https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopCluster&modes=bus&lat='+lat+'&lon='+lon);        
    stops = stops.concat(getStops(stopsCluster));
    const stopsPair = await httpRequest('https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopPair&modes=bus&lat='+lat+'&lon='+lon);
    stops = stops.concat(getStops(stopsPair));

    const sortedStops = stops.sort((a,b)=> {return a.distance - b.distance}); 
    const nearestStops = sortedStops.splice(0,2);
    
    //getArrivalsData('490008660N');

    for(stop of nearestStops){
        getArrivalsData(stop.id);
    }
    
}

getStopCode();