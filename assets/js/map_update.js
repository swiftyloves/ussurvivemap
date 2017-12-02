
function refreshCheckBoxResult() {
    updateStateDeathRateOnMap();
    updateStateDeathRateOnLineChart();
}

function state_to_state_polygon(state_name) {
    return state_name + "_polygon";
}

// Define linear scale for output
var deathToColor = d3.scale.linear()
    .domain([min_death_rate, max_death_rate])
    .range(["rgb(236,236,236)", "rgb(62,181,77)", "rgb(255,221,158)", "rgb(211,75,75)"]);

function updateStateDeathRateOnMap() {
    var state_death_rates = {}
    for (s in state_name_pairs) {
        state_death_rates[state_name_pairs[s][0]] = 0;
    }
    for (dd in disaster_names) {
        if (d3.select('#' + disaster_names[dd] + "_checkbox").property("checked")) {
            var startYear = $('#amount-min').val();
            var endYear = $('#amount-max').val();
            var death_rate_list = getFakeDeathRateList(disaster_names[dd], startYear, endYear);
            for (s in state_name_pairs) {
                state_death_rates[state_name_pairs[s][0]] += death_rate_list[state_name_pairs[s][0]];
            }
        }
    }

    for (s in state_name_pairs) {
        var state_name = state_name_pairs[s][0];
        var death_rate = state_death_rates[state_name];
        var state_abbr = abbrState(state_name, "abbr");
        var state_poly = d3.select("#" + state_to_state_polygon(state_abbr));
        state_poly.style("fill",deathToColor(death_rate));
    }

    var NM = d3.select("#" + state_to_state_polygon("New Mexico"));
}

function updateStateDeathRateOnLineChart() {
    let state = 'MI';
    let startYear = $('#amount-min').val();
    let endYear = $('#amount-max').val();

    for (disaster of disaster_names) {
        drawLineChart(state, disaster, startYear, endYear);
    }
}

function drawLineChart(state, disaster, startYear, endYear) {
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var width = 400;
    var height = 100;

    // Set ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
}