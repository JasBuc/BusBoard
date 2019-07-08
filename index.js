const Stop = require('./Stop');
const User = require('./User');
const ProcessURL = require('./ProcessURL');
const express = require('express')
const app = express();
const port =  3000;
const UpcomingBus = require('./UpcomingBus.js');


async function getArrivalsData(stopCode){
    const arrivalsJSON = await ProcessURL.httpRequest(ProcessURL.getArrivalsURL(stopCode));
    let arrivalsData = JSON.parse(arrivalsJSON);
    arrivalsData = arrivalsData.sort((a,b)=> {return a.timeToStation - b.timeToStation});
    // console.log("Next 5 buses arriving at "+stopCode+" is: ");
    let max = 5;
    if (arrivalsData.length<5){max=arrivalsData.length};
    const arrivalsArray = [];
    for(let i=0;i<max;i++){
        let timeToArrival = Math.round(arrivalsData[i].timeToStation/60); 
        const newArrival = new UpcomingBus (arrivalsData[i].stationName, arrivalsData[i].lineId, arrivalsData[i].destinationName, timeToArrival);
        arrivalsArray.push(newArrival);
    }
    return arrivalsArray;
}

async function getStopCode(postcode){
    const postcodeJSON = await ProcessURL.httpRequest(ProcessURL.getPostcodeURL(postcode));
    const postcodeData = JSON.parse(postcodeJSON);

    const lat = postcodeData.result.latitude;
    const lon = postcodeData.result.longitude;

    let stops = [];
    const stopsCluster = await ProcessURL.httpRequest('https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopCluster&modes=bus&lat='+lat+'&lon='+lon+'&app_id=9cf88108&app_key=8b2a223c0d05e2d7a6ac78b6219f7c20');        
    stops = stops.concat(Stop.getStops(stopsCluster));
    const stopsPair = await ProcessURL.httpRequest('https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopPair&modes=bus&lat='+lat+'&lon='+lon+'&app_id=9cf88108&app_key=8b2a223c0d05e2d7a6ac78b6219f7c20');
    stops = stops.concat(Stop.getStops(stopsPair));

    if (stops.length === 0){
        return errorNoStops = '404 Not Found';
    }
    else {
        const sortedStops = stops.sort((a,b)=> {return a.distance - b.distance}); 
        const nearestStops = sortedStops.splice(0,2);
        let allArrivals = [];
    
        for(stop of nearestStops){
            const stopArray = await getArrivalsData(stop.id);
            allArrivals.push(stopArray);
        }
        // console.log(JSON.stringify(allArrivals));
        return allArrivals;
    }

}

async function makeAPI() {
    app.use(express.static('frontend'));
    app.get('/departureBoards', async (req, res) => {
        const jsonOutput = await getStopCode(req.query.postcode);
        console.log(jsonOutput);
        res.send(jsonOutput);
    });
    app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
}

makeAPI()