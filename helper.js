/*
Disaster Structure:

data = {
    "tornadoes": {
        "location": {
            "AK": {
                "1980": [ [8.24, 1.23], [-19.5, 36.7] ... ], //[latitude, longitude]
                "1981": [ [3.29, -12.20], [11.22, -3.8] ... ],
                ...
            },
            "AL": {
                "1980": [ [8.24, 1.23], [-19.5, 36.7] ... ], //[latitude, longitude]
                "1981": [ [3.29, -12.20], [11.22, -3.8] ... ],
                ...
            }, 
            ...
        },
        "death": {
            "AK": {
                "1980": [ 0.0001 ]
                "1981": [ 0.00005 ],
                ...
            },
            "AL": {
                "1980": [ 0.0056]
                "1981": [ 0.00078 ],
                ...
            }, 
            ...
        }
    },


Populaiton Structure:

{ state : { year: population, ... }, ...}

{
    "AL": {'1950': 3058000}, {'1951': 3059000} ...
    "AK": {'1950': 135000}, {'1951': 917000} ...
    ...
}

*/

/******************* CONSTANT ***********************/

let EXTRACT_COLUMN_AMOUNT = 3;

let STATE_LIST =  ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"];
let STATE_POPULATION_CSV_FILE_NAME = 'state_population_data_clean.csv';
let TORNADOES_CSV_FILE_NAME = 'tornadoes_clean_manual.csv';
let HURRICAN_CSV_FILE_NAME = 'hurricane_clean_year_manual.csv';
let GUNSHOT_CSV_FILE_NAME = 'gunshot_clean_manual.csv';

let EARLIER_YEAR = 1950;
let LAST_YEAR = 2015;
let DISASTER_TYPES = ["hurricane", "earthquake", "gunshot", "tornadoes"];

let DEATH_TOLL_PROPORTION = 1000;

/****************************************************/

let getStatePopulation = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/' + STATE_POPULATION_CSV_FILE_NAME,
        dataType: 'text',
        success: function(data){
            resolve(processSateData(data));
        }
    })
});

let getGunshot = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/' + GUNSHOT_CSV_FILE_NAME,
        dataType: 'text',
        success: function(data){ resolve(data); }
    })
});

let getHurricane = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/' + HURRICAN_CSV_FILE_NAME,
        dataType: 'text',
        success: function(data){
            resolve(data);
        }
    })
});

let getTornadoes = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/' + TORNADOES_CSV_FILE_NAME,
        dataType: 'text',
        success: function(data){
            resolve(data);
        }
    })
});

let processSateData = function(data) {
    let dataLines = data.split(/\r\n|\n/);
    let state_population = {};
    let states = dataLines[0].split(" ");
    states.pop();
    // work around -- Not sure why the original data is \"DC\" 
    states.pop();
    states.push("DC");

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

let processTornadoesData = function(tornadoes_raw_data, state_population) {
    let dataLines = tornadoes_raw_data.split(/\r\n|\n/);
    let tornadoes_dict = {'location': {}, 'death': {}};
    for (let i = 0; i < STATE_LIST.length; i++) {
        tornadoes_dict.location[STATE_LIST[i]] = {};
        tornadoes_dict.death[STATE_LIST[i]] = {};
    }
    for (let i = 0; i < dataLines.length - 1; i++) {
        let nums = dataLines[i].split("\t");
        if (nums.length < 5) {
            console.log('nums:',nums)
            console.log('[Error] Amount of desired column is not right.')
            console.log('Error dataLines ',i, ": ",dataLines[i])
            continue;
        }
        let year = nums[0].trim();
        let state = nums[1];
        if (STATE_LIST.indexOf(state) === -1) {
            continue;
        }
        let locationArr = [parseFloat(nums[2].trim()), parseFloat(nums[3].trim())];
        let death = parseInt(nums[4]);
        
        if (tornadoes_dict.location[state].hasOwnProperty(year)) {
            tornadoes_dict.location[state][year].push(locationArr);
        } else {
            tornadoes_dict.location[state][year] = [ locationArr ];
        }

        if (tornadoes_dict.death[state].hasOwnProperty(year)) {
            tornadoes_dict.death[state][year] = tornadoes_dict.death[state][year] + death;
        } else {
            tornadoes_dict.death[state][year] = death;
        }
    }
    for (let i = 0; i < STATE_LIST.length; i++) {
        let state = STATE_LIST[i];
        if (tornadoes_dict.death[state] !== undefined) {
            console.log('tornadoes_dict.death[state] !== undefined');
            let years = Object.keys(tornadoes_dict.death[state]);
            for (let j = 0; j < years.length; j++) {
                // console.log('tornadoes_dict.death[state][years[j]]:',tornadoes_dict.death[state][years[j]]);
                tornadoes_dict.death[state][years[j]] = tornadoes_dict.death[state][years[j]] / state_population[state][years[j]] * DEATH_TOLL_PROPORTION;
                if (tornadoes_dict.death[state][years[j]] == 0 || isNaN(tornadoes_dict.death[state][years[j]])) {
                    delete tornadoes_dict.death[state][years[j]];
                }
            }
        }
    };
    return tornadoes_dict;
};

let processGunshotData = function(gunshot_raw_data, state_population) {
    let dataLines = gunshot_raw_data.split(/\r\n|\n/);
    let gunshot_dict = {'location': {}, 'death': {}};
    for (let i = 0; i < STATE_LIST.length; i++) {
        gunshot_dict.location[STATE_LIST[i]] = {};
        gunshot_dict.death[STATE_LIST[i]] = 0.0;
    }
    console.log('gunshot_dict:',gunshot_dict)
    for (let i = 0; i < dataLines.length - 1; i++) {
        let nums = dataLines[i].split("\t");
        if (nums.length < 5) {
            console.log('nums:',nums)
            console.log('[Error] Amount of desired column is not right.')
            console.log('Error dataLines ',i, ": ",dataLines[i])
            continue;
        }
        // Work around to complete year to four digit
        let year_surfix = (nums[0].split("/"))[2];
        if (year_surfix == undefined) {
            console.log(nums)
        }
        let year = year_surfix;
        if (year_surfix.length == 2) {
            year_surfix = parseInt(year_surfix);
            if (year_surfix < 20) {
                year = '20' + year_surfix;
            } else {
                year = '19' + year_surfix;
            }
        }

        // Work around to parse state
        let location = nums[1].replace(/\"/g, "").split(",");
        if (location[1] == undefined) {
            continue;
        }
        let state = location[1].trim();
        // console.log('location:',location);
        if (STATE_LIST.indexOf(state) === -1) {
            state = abbrState(state,'abbr')
        }
        if (state == 'error') { // parse error
            continue;
        }

        if (STATE_LIST.indexOf(state) === -1) {
            continue;
        }
        let locationArr = [parseFloat(nums[2].trim()), parseFloat(nums[3].trim())];
        let death = parseInt(nums[4]);

        if (gunshot_dict.location[state].hasOwnProperty(year)) {
            gunshot_dict.location[state][year].push(locationArr);
        } else {
            gunshot_dict.location[state][year] = [ locationArr ];
        }

        if (gunshot_dict.death[state].hasOwnProperty(year)) {
            gunshot_dict.death[state][year] = gunshot_dict.death[state][year] + death;
        } else {
            gunshot_dict.death[state][year] = death;
        }
    }

    for (let i = 0; i < STATE_LIST.length; i++) {
        let state = STATE_LIST[i];
        if (gunshot_dict.death[state] !== undefined) {
            let years = Object.keys(gunshot_dict.death[state]);
            for (let j = 0; j < years.length; j++) {
                gunshot_dict.death[state][years[j]] = gunshot_dict.death[state][years[j]] / state_population[state][years[j]] * DEATH_TOLL_PROPORTION;
                if (gunshot_dict.death[state][years[j]] == 0 || isNaN(gunshot_dict.death[state][years[j]])) {
                    delete gunshot_dict.death[state][years[j]];
                }
            }
        }
    };
    return gunshot_dict;
};

var data = {};
$(document).ready(function() {
    getStatePopulation.then(function(state_population){
        return Promise.all([getTornadoes, getHurricane, getGunshot]).then(values => {
            let tornadoes_raw_data = values[0];
            let hurricane_raw_data = values[1];
            let gunshot_raw_data = values[2];
            tornadoes_data = processTornadoesData(tornadoes_raw_data, state_population);
            hurricane_data = processHurricaneData(hurricane_raw_data, state_population);
            gunshot_data = processGunshotData(gunshot_raw_data, state_population);

            data['hurricane'] = hurricane_data;
            data['tornadoes'] = tornadoes_data;
            data['gunshot'] = gunshot_data;
            return data;
        });
    }).then(function(data){
        // [TODO] Bind EventListener Here
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

