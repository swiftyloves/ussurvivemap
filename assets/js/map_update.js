
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
        var state_poly = d3.select("#" + state_to_state_polygon(state_name));
        state_poly.style("fill",deathToColor(death_rate));
    }
}

function updateStateDeathRateOnLineChart() {
    let state = 'MI';
    let startYear = +$('#amount-min').val();
    let endYear = +$('#amount-max').val();

    for (disaster of disaster_names) {
        drawLineChart(state, disaster, startYear, endYear);
    }
}

function drawLineChart(state, disaster, startYear, endYear) {
    var data = getFakeDeathRateListOfState(state, disaster, startYear, endYear);
    // console.log(data);
    // startYear = 100;
    // endYear = startYear + 21;
    // var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Set ranges
    var x = d3.scale.linear()
        .range([0, chartWidth])
        .domain([startYear, endYear]);
    var y = d3.scale.linear()
        .range([chartHeight, 0])
        .domain([0, d3.max(data)]);

    // Define the axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // Define line
    var valueLine = d3.svg.line()
        .x(function (_, i) {
            return x(i + startYear);
        })
        .y(function (d) {
            // console.log(d, y(d));
            return y(d);
        });

    var chartSvg = d3.select("." + disaster + "ChartGroup");
    chartSvg.selectAll(".axis").remove();
    chartSvg.selectAll("path").remove();

    chartSvg.append("path")
        .attr("class", "line")
        .attr("d", valueLine(data));
    chartSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis);
    chartSvg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}