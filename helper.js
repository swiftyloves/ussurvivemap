/*
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
let HURRICAN_CSV_FILM_NAME = 'hurricane_clean_year_manual.csv';

let getStatePopulation = new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: 'data/state_population_data.csv',
        dataType: 'text',
        success: function(data){ resolve(data); }
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
            resolve(processHurricaneData(data));
        }
    })
});

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

let processHurricaneData = function(data) {
    var dataLines = data.split(/\r\n|\n/);
    let hurri_dict = {'loaction': {}, 'death': {}}
    for (let i = 0; i < dataLines.length; i++) {
        let nums = dataLines[i].split("\t");
        if (nums.length !== EXTRACT_COLUMN_AMOUNT) {
            console.log('[Error] Amount of desired column is not right.')
            console.log('Error dataLines ',i, ": ",dataLines[i])
            continue;
        }
        let year = nums[0].trim();
        let locationArr = [parseFloat(nums[1].trim()), parseFloat(nums[2].trim())];
        if (hurri_dict.loaction.hasOwnProperty(year)) {
            hurri_dict.loaction[year].push(locationArr);
        } else {
            hurri_dict.loaction[year] = [ locationArr ];
        }

        // [TODO] death_toll needed to be updated to percentage
        /*if (hurri_dict.death.hasOwnProperty(year)) {
            hurri_dict.death.year.push(death_toll);
        } else {
            hurri_dict.death.year = [ death_toll ];
        }*/
    }
    return hurri_dict;
};

var data = {}
$(document).ready(function() {
    getHurricane.then((hurricane_data) => {
        console.log('hurricane location data year 1951:',hurricane_data.loaction['1951']);
        // console.log('hurricane death data year 1951:',hurricane_data.death['1951']);
        data['hurricane'] = hurricane_data;

    });

});
