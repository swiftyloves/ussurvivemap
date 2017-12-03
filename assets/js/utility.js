// D3 Projection
var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US
function sum(someArray) {
    var total = 0;
    for (var i = 0; i < someArray.length; i++) {
        total += someArray[i] ;
    }
    return total;
}