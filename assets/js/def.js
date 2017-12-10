var disasterNames = ["earthquake", "gunshot" , "tornado"];
var min_death_rate =  0;
var max_death_rate = 0.1;
var pivot_death_rate = (min_death_rate + max_death_rate )/2;
//Width and height of map
var disasterToColorMapping = {
    "earthquake": "#02bdc7",
    "gunshot":  "#fc4540",
    "hurricane": "blue", 
    "tornado": "#ffb600"};

function disaster_to_color(color) {
    return disasterToColorMapping[color]
}

var width = 960;
var height = 500;
var stateNamePairs = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
];

function abbrState(input, to){
    if (typeof input == 'undefined') return "";
    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < stateNamePairs.length; i++){
            if(stateNamePairs[i][0] == input){
                return(stateNamePairs[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < stateNamePairs.length; i++){
            if(stateNamePairs[i][1] == input){
                return(stateNamePairs[i][0]);
            }
        }    
    }
}

// for chart
var chartMargin = {top: 20, right: 20, bottom: 40, left: 60};
var chartWidth = 400;
var chartHeight = 100;