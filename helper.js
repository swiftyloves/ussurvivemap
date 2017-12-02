/*
Disaster Structure:

data[DEASTER_TYPE] = 
{
    "location": {
        "1980": [ [8.24, 1.23], [-19.5, 36.7] ... ], //[latitude, longitude]
        "1981": [ [3.29, -12.20], [11.22, -3.8] ... ],
        ...
    },
    "death": {
        "1980": [  ],
        "1981": [  ],
        ...
    }
}

*/

let EXTRACT_COLUMN_AMOUNT = 3;
let STATE_POPULATION_CSV_FILM_NAME = 'state_population_data_clean.csv';

let HURRICAN_CSV_FILM_NAME = 'hurricane_clean_year_manual.csv';

let EARLIER_YEAR = 1950;
let LAST_YEAR = 2015;
let DISASTER_TYPES = ["hurricane", "earthquake", "gunshot", "tornadoes"];

let getStatePopulation = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/' + STATE_POPULATION_CSV_FILM_NAME,
        dataType: 'text',
        success: function(data){
            resolve(processSateData(data));
        }
    })
});

let getGunshot = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/gunshot.csv',
        dataType: 'text',
        success: function(data){ resolve(data); }
    })
});

let getHurricane = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/' + HURRICAN_CSV_FILM_NAME,
        dataType: 'text',
        success: function(data){
            resolve(data);
        }
    })
});

let getHurricaneFun = function(state_population){
    let data = getHurricane.then(function(hurricane_raw_data){
        return processHurricaneData(hurricane_raw_data, state_population)
    });
    console.log('processHurricaneData:', data);
    return data;
};

let getTornadoes = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/tornadoes.csv',
        dataType: 'text',
        success: function(data){
            resolve(data);
        }
    })
});

/*
Populaiton Structure:

{ state : { year: population, ... }, ...}

{
    AL: {'1950': 3058000}, {'1951': 3059000} ...
    AK: {'1950': 135000}, {'1951': 917000} ...
    ...
}
*/

let processSateData = function(data) {
    let dataLines = data.split(/\r\n|\n/);
    let state_population = {};
    let states = dataLines[0].split(" ");
    states.pop();
    for (let i = 0; i < states.length; i++) {
        state_population[states[i]] = {};
    }
    let year = EARLIER_YEAR;
    for (let i = 1; i < dataLines.length; i++) {
        if (dataLines[i] == "") {
            continue;
        }
        let nums = dataLines[i].split(" ");
        for (let j = 0; j < states.length; j++) {
            let num_str = nums[j].replace(/,/g,"").replace(/\"/g,"");
            let population = parseInt(num_str);
            let stat_dict = state_population[states[j]];
            if (stat_dict == undefined){
                continue;
            }
            if (stat_dict.hasOwnProperty(year.toString)) {
                continue;
            }
            state_population[states[j]][year.toString()] = population;
        }
        if (year > LAST_YEAR) {
            console.log('dataLines[i]',dataLines[i]);
            console.log('[Error] state population data is out of range.')
            break;
        }
        year += 1;
    }
    return state_population;
};

let processHurricaneData = function(hurricane_raw_data, state_population) {
    let dataLines = hurricane_raw_data.split(/\r\n|\n/);
    let hurri_dict = {'location': {}, 'death': {}};
    for (let i = 0; i < dataLines.length; i++) {
        let nums = dataLines[i].split("\t");
        if (nums.length !== EXTRACT_COLUMN_AMOUNT) {
            console.log('[Error] Amount of desired column is not right.')
            console.log('Error dataLines ',i, ": ",dataLines[i])
            continue;
        }
        let year = nums[0].trim();
        let locationArr = [parseFloat(nums[1].trim()), parseFloat(nums[2].trim())];
        if (hurri_dict.location.hasOwnProperty(year)) {
            hurri_dict.location[year].push(locationArr);
        } else {
            hurri_dict.location[year] = [ locationArr ];
        }

        // [TODO] death_toll needed to be updated to percentage
        // if (hurri_dict.death.hasOwnProperty(year)) {
            // hurri_dict.death.year.push(state_population);
        // } else {
            // hurri_dict.death.year = [ death_toll ];
        // }
    }
    return hurri_dict;
};

var data = {}
$(document).ready(function() {
    getStatePopulation.then(function(state_population){
        return getHurricane.then((hurricane_raw_data) => {
            hurricane_data = processHurricaneData(hurricane_raw_data, state_population);
            data['hurricane'] = hurricane_data;
            return data;
        });
    }).then(function(data){
        // Bind EventListener Here
        console.log('data:',data)
        console.log(getDisasterLocationList('hurricane', 1960, 1961));
    });
});


/******   HELPER FUNCTION DEFINITION   ******/
/*

'getDisasterLocationList': function(disasterType, startYear, endYear):
    # for scatter plotting
    # @ param disasterType : string
    # @ param startYear : string
    # @ param endYear : string

    # @ return List<Disaster> [(longitude, latitude) …]

*/
let getDisasterLocationList = function(disasterType, startYear, endYear) {
    if (DISASTER_TYPES.indexOf(disasterType) === -1) {
        console.log("[Error] No such disaster type!");
        return;
    }
    let years = Object.keys(data[disasterType].location);
    let result = [];
    for (let i = 0; i < years[i]; i++) {
        let year = parseInt(years[i])
        if (startYear <= year && year <= endYear) {
            result.push(data[disasterType].location[year]);
        }
    }
    return result;
};

