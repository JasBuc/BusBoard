const request = require('request');
//const axios = require('axios');

exports.getArrivalsURL = function(stopCode) {
    const address = 'https://api.tfl.gov.uk/StopPoint/'+stopCode+'/Arrivals?app_id=9cf88108&app_key=8b2a223c0d05e2d7a6ac78b6219f7c20';
    return address;
}

exports.getPostcodeURL = function(postcode){
    const address = 'https://api.postcodes.io/postcodes/'+postcode;
    return address;
}

exports.httpRequest = async function (address){
    return new Promise((resolve,reject) => {
        request(address, function (error, response, body) {
            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            resolve(body);
        });
    });   
}