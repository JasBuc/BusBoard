var xhttp = new XMLHttpRequest();
 

function printResults(parsedStop, index){
    document.getElementById('bus-header' + (index+1)).innerHTML = '<h3>' + 'Stop: ' + parsedStop[0].stop + '</h3>';
    let resultsString = '';
    for (j=0; j<parsedStop.length; j++){
        resultsString += '<li>' + parsedStop[j].timeToArrival + ' minutes: '+ parsedStop[j].bus + ' to ' + parsedStop[j].destination + '</li>';
    }
    document.getElementById('bus-results' + (index+1)).innerHTML = resultsString;
}

function readPostcode (){
    var postcode = document.getElementById('postcode').value;
    xhttp.open('GET', 'http://localhost:3000/departureBoards?postcode=' + postcode, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onload = function() {
        let parsedStops = JSON.parse(xhttp.response);
        for (i=0; i<parsedStops.length; i++){
            printResults(parsedStops[i], i);
        }
    }
    xhttp.send();
}


// function formatResponse(){
    
// }