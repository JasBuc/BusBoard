class Stop{
    constructor(id,distance){
        this.id=id;
        this.distance=distance;
    }
}

exports.getStops = function(stops) {
    const stopsData = JSON.parse(stops);
    const stopsArray = [];
    for (stop of stopsData.stopPoints){
        stopsArray.push(new Stop(stop.children[0].id,stop.distance));
    }
    return stopsArray;
}