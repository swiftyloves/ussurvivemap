$(function () {
    $("#slider-range").slider({
        range: true,
        min: 1950,
        max: 2016,
        values: [1950, 2016],
        animate: true,
        step: 1,
        slide: function (event, ui) {
            $("#amount-min").val(ui.values[0]);
            $("#amount-max").val(ui.values[1]);
            refreshMap();
        }
    });

    $("#amount-min").val($("#slider-range").slider("values", 0));
    $("#amount-max").val($("#slider-range").slider("values", 1));
});