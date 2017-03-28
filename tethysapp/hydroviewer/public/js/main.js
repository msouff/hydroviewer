$(".toggle-nav").removeClass('toggle-nav');
$("#app-content-wrapper").removeClass('show-nav')

$(function () {
    //init map
    var map;
    map = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: ol.proj.transform([0, 18.6], 'EPSG:4326', 'EPSG:3857'),
            zoom: 3,
            minZoom: 2,
            maxZoom: 18
        })
    });
    
    base_layer = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
            imagerySet: 'AerialWithLabels'
        })
    });
    
    map.addLayer(base_layer);
    
    mapView = map.getView();
    
    // require(["esri/map", "dojo/domReady!"], function(Map) {
    //     map = new Map("map", {
    //         center: [0, 18.6],
    //         zoom: 3,
    //         basemap: "streets"
    //     });
    // });
});

function submit_model() {
    if ($('#modelSelect option:selected').val() === 'ecmwf') {
        location.href = 'ecmwf-rapid/';
    } else if ($('#modelSelect option:selected').val() === 'lis') {
        location.href = 'lis-rapid/';
    };
};