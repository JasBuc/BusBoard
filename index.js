const Stop = require('./Stop');
const express = require('express');
const User = require('./User');
const ProcessURL = require('./ProcessURL');

async function getArrivalsData(stopCode){
    const arrivalsJSON = await ProcessURL.httpRequest(ProcessURL.getArrivalsURL(stopCode));
    let arrivalsData = JSON.parse(arrivalsJSON);
    arrivalsData = arrivalsData.sort((a,b)=> {return a.timeToStation - b.timeToStation});
    console.log("Next 5 buses arriving at "+stopCode+" is: ");
    let max = 5;
    if (arrivalsData.length<5){max=arrivalsData.length};
    for(let i=0;i<max;i++){
        let timeToArrival = Math.round(arrivalsData[i].timeToStation/60); 
        console.log("Bus: "+arrivalsData[i].lineId+" Destination: "+arrivalsData[i].destinationName+" Time until arrival: "+timeToArrival);
    }
}

async function getStopCode(){
    const postcodeJSON = await ProcessURL.httpRequest(ProcessURL.getPostcodeURL(User.getPostcodeFromUser()));
    const postcodeData = JSON.parse(postcodeJSON);

    const lat = postcodeData.result.latitude;
    const lon = postcodeData.result.longitude;
    let stops = [];
    const stopsCluster = await ProcessURL.httpRequest('https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopCluster&modes=bus&lat='+lat+'&lon='+lon);        
    stops = stops.concat(Stop.getStops(stopsCluster));
    const stopsPair = await ProcessURL.httpRequest('https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopPair&modes=bus&lat='+lat+'&lon='+lon);
    stops = stops.concat(Stop.getStops(stopsPair));

    const sortedStops = stops.sort((a,b)=> {return a.distance - b.distance}); 
    const nearestStops = sortedStops.splice(0,2);

    for(stop of nearestStops){
        getArrivalsData(stop.id);
    }
    
}

getStopCode();