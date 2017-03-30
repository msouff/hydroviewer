$(".toggle-nav").removeClass('toggle-nav');
$("#app-content-wrapper").removeClass('show-nav')

$(function () {
    //init map
    var map;
    map = new ol.Map({
        target: 'map',
        // layers: [layer1],
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

    var stroke = new ol.style.Stroke({
        color: '#000000',
        width: 10
    });

    var Style1 = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#000000',
            width: 10
        })
    });

    var layer1 = new ol.layer.Vector({
        source: new ol.source.Vector({
            loader: function (extent) {
                $.ajax('http://tethys.byu.edu:8181/geoserver/spt-30935191ace55f90bd1e61456f1ef016/ows', {
                    type: 'GET',
                    data: {
                        service: 'WFS',
                        version: '1.0.0',
                        request: 'GetFeature',
                        typename: 'spt-30935191ace55f90bd1e61456f1ef016:nepal-example-drainage_line',
                        srsname: 'EPSG:3857',
                        outputFormat: 'text/javascript',
                        bbox: extent.join(',') + ',EPSG:3857'
                    },
                    dataType: 'jsonp',
                    jsonpCallback:'callback:loadFeatures',
                    jsonp: 'format_options'
                })
            },
            strategy: ol.loadingstrategy.bbox,
            projection: 'EPSG:3857'
        }),
        style: [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,255,255,0.01)',
                    width: 40
                })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#00BFFF',
                    width: 2
                })
            })
        ]
    });

    window.loadFeatures = function (response) {
        layer1.getSource().addFeatures(new ol.format.GeoJSON().readFeatures(response));
    };

    map.addLayer(base_layer);
    map.addLayer(layer1);
    
    mapView = map.getView();

    select_interaction = new ol.interaction.Select({
        layers: [layer1],
    });

    map.addInteraction(select_interaction);
});

function submit_model() {
    if ($('#modelSelect option:selected').val() === 'ecmwf') {
        location.href = 'ecmwf-rapid/';
    } else if ($('#modelSelect option:selected').val() === 'lis') {
        location.href = 'lis-rapid/';
    };
};