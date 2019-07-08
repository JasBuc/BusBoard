const express = require('express')
const app = express()
const port =  3000

app.get('/departureBoards', (req, res) => {
    const postcode = req.query.postcode;
    
});
app.listen(port, () => console.log('Example app listening on port ' + port + '!'))
