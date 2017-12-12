function state_to_state_polygon(state_name) {
    return state_name + "_polygon";
}

// Define linear scale for output
var deathToColor = d3.scale.linear()
    .domain([min_death_rate, pivot_death_rate, max_death_rate])
    .range(["#3EB54D", '#FFDD9E', "#D34B4B"]);

function summarizeDeathRate(deathRateList) {
    return sum(deathRateList);
}

function updateStateDeathRateOnMap() {
    var stateDeathRates = {}
    for (s in stateNamePairs) {
        var stateName = stateNamePairs[s][0];
        stateDeathRates[stateName] = 0;
        for (dd in disasterNames) {
            if (d3.select('#' + disasterNames[dd] + "_checkbox").property("checked")) {
                var startYear = $('#amount-min').val();
                var endYear = $('#amount-max').val();
                var stateAbbr = abbrState(stateName, 'abbr');
                var deathRateList = getDeathRateListInUse(disasterNames[dd], startYear, endYear, stateAbbr);
                stateDeathRates[stateName] += summarizeDeathRate(deathRateList);
            }
        }
    }


    for (s in stateNamePairs) {
        var state_name = stateNamePairs[s][0];
        var death_rate = stateDeathRates[state_name];
        var state_abbr = abbrState(state_name, "abbr");
        var state_poly = d3.select("#" + state_to_state_polygon(state_abbr));
        state_poly.style("fill", deathToColor(death_rate));
    }
    // console.log(stateDeathRates);
}

function updateStateDeathRateOnLineChart() {
    let state = abbrState($('.current-state').text(), 'abbr');
    let startYear = +$('#amount-min').val();
    let endYear = +$('#amount-max').val();

    for (disaster of disasterNames) {
        drawLineChart(state, disaster, startYear, endYear);
    }
    var selectedState = $("#" + state + "_polygon");
    // $("svg.map>*").removeAttr("class");
    // $("svg.map>*").attr("class", "unselected-state");
    resetMapBg();
    selectedState.attr("class", "selected-state");
}

function drawLineChart(state, disaster, startYear, endYear) {
    var data = getDeathRateListInUse(disaster, startYear, endYear, state);
    // console.log(data);
    // startYear = 100;
    // endYear = startYear + 21;
    // var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Set ranges
    var timeParse = d3.time.format("%Y");
    var x = d3.time.scale()
        .range([0, chartWidth])
        .domain([timeParse.parse(startYear.toString()), timeParse.parse(endYear.toString())]);
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
        .x(function (_, i) { return x(timeParse.parse((i + startYear).toString())); })
        .y(function (d) { return y(d); });

    var area = d3.svg.area()
        .x(function(d, i) { return x(timeParse.parse((i + startYear).toString())); })
        .y0(chartHeight)
        .y1(function (d) { return y(d); });

    var chartSvg = d3.select("." + disaster + "ChartGroup");
    chartSvg.selectAll(".axis").remove();
    chartSvg.selectAll("path").remove();

    chartSvg.append("path")
        .attr("class", function () {
            if (d3.select('#' + disaster + "_checkbox").property("checked")) {
                if (disaster == "tornado") {
                    return "selected-area-tornado";
                } else if (disaster == "gunshot") {
                    return "selected-area-gunshot";
                } else if (disaster == "earthquake") {
                    return "selected-area-earthquake";
                } else {
                    return "selected-area";
                }
            } else {
                return "default-area";
            }
        })
        .attr("d", area(data));
    chartSvg.append("path")
        .attr("class", function () {
            if (d3.select('#' + disaster + "_checkbox").property("checked")) {
                if (disaster == "tornado") {
                    return "selected-line-tornado";
                } else if (disaster == "gunshot") {
                    return "selected-line-gunshot";
                } else if (disaster == "earthquake") {
                    return "selected-line-earthquake";
                } else {
                    return "selected-line";
                }
            } else {
                return "default-line";
            }
        })
        .attr("d", valueLine(data));
    chartSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("x", chartWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text("year");
    chartSvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Death Tolls");
}

function updateDisasterDotOnMap() {
    resetDisasterDotOnMap();
    var disaster_data = [];
    for (dd in disasterNames) {
        if (d3.select('#' + disasterNames[dd] + "_checkbox").property("checked")) {
            var startYear = $('#amount-min').val();
            var endYear = $('#amount-max').val();
            var disaster_locs = getDisasterLocationListInUse(disasterNames[dd], startYear, endYear);
            for (dl in disaster_locs) {
                disaster_data.push({
                    'long': disaster_locs[dl][1].toString(),
                    'lat': disaster_locs[dl][0].toString(),
                    'name': disasterNames[dd]
                })
            }
        }
    }
    svg.selectAll("circle")
        .data(disaster_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            var loc = projection([d.long, d.lat]);
            if (loc == undefined) return 0;
            return projection([d.long, d.lat])[0];
        })
        .attr("cy", function (d) {
            var loc = projection([d.long, d.lat]);
            if (loc == undefined) return 0;
            return projection([d.long, d.lat])[1];
        })
        .attr("r", function(d) {
            return get_radius_by_disaster(d.name);})
        .style("fill", function (d) {
            return disaster_to_color(d.name);
        })
        .style("opacity", function(d) {
            return get_opacity_by_disaster(d.name);})
        .style("stroke", function(d) {
            return get_stroke_by_disaster(d.name);})
}

function resetStateDeathRateOnMap() {
    for (s in stateNamePairs) {
        var state_name = stateNamePairs[s][0];
        var state_abbr = abbrState(state_name, "abbr");
        var state_poly = d3.select("#" + state_to_state_polygon(state_abbr));
    }
}

function resetDisasterDotOnMap() {
    svg.selectAll("circle").remove();
}

function resetMapBg() {
    $("svg.map>*").attr("class", "unselected-state");
}

function resetMapBgDisasterLoaction(){
    for (s in stateNamePairs) {
        var state_name = stateNamePairs[s][0];
        var state_abbr = abbrState(state_name, "abbr");
        var state_poly = d3.select("#" + state_to_state_polygon(state_abbr));
        state_poly.style("fill", null);
        // console.log(state_poly);
    }
}

function refreshMap() {
    updateStateDeathRateOnLineChart();
    if (d3.select("#plot_disaster_location_radio").property("checked")){
        resetMapBgDisasterLoaction();
        updateDisasterDotOnMap();
        resetStateDeathRateOnMap();
        $("#safeBar").css("display", "none");
    } else {
        resetDisasterDotOnMap();
        updateStateDeathRateOnMap();
        $("#safeBar").css("display", "block");
    }
}