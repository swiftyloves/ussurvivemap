

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