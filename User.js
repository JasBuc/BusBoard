const readline = require('readline-sync');

exports.getStopCodeFromUser = function() {
    console.log("Please enter the stop code: ");
    return stopCode = readline.prompt();
}
    
exports.getPostcodeFromUser =function() {
    console.log("Please enter the postcode: ");
    return readline.prompt();
}