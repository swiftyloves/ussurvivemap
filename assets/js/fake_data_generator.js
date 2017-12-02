

function getFakeDeathRateList(disasterType, startYear, endYear) {
    ret = {}
    for (s in state_name_pairs) {
        ret[state_name_pairs[s][0]] = getRandomArbitrary(0,0.005);
    }
    return ret;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function getFakeDeathRateListOfState(state, disasterType, startYear, endYear) {
    ret = []
    for (let i = startYear; i <= endYear; ++i) {
        ret.push(getRandomArbitrary(0,0.005));
    }
    return ret;
}

function getFakeDisasterLocationList(disasterType, startYear, endYear) {
    var min_lat = 24;
    var max_lat = 44;
    var min_long = 68;
    var max_long = 125;
    ret = []
    for (let i = startYear; i <= endYear; ++i) {
        var long = getRandomArbitrary(min_long, max_long);
        var lat = getRandomArbitrary(min_lat, max_lat);
        ret.push([long, lat]);
    }
    return ret;

}
