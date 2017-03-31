var vectorLayer, select_interaction;

$(".toggle-nav").removeClass("toggle-nav");
$("#app-content-wrapper").removeClass("show-nav");

$(function () {
    $('#watershedSelect').on('change', function () {
        map.removeInteraction(select_interaction);
        map.removeLayer(vectorLayer);
        if ($('#watershedSelect option:selected').val() !== "") {
            $("#inner-app-content").addClass("row");
            $("#map").addClass("col-md-7");
            $("#graph").removeClass("hidden");
            $("#graph").addClass("col-md-5");

            map.updateSize();

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

            var workspace = 'spt-30935191ace55f90bd1e61456f1ef016';
            var watershed = $('#watershedSelect option:selected').text().split(' (')[0].replace(' ', '_').toLowerCase();
            var subbasin = $('#watershedSelect option:selected').text().split(' (')[1].replace(')', '').toLowerCase();

            vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    loader: function (extent) {
                        $.ajax('http://tethys.byu.edu:8181/geoserver/' + workspace + '/ows', {
                            type: 'GET',
                            data: {
                                service: 'WFS',
                                version: '1.0.0',
                                request: 'GetFeature',
                                typename: workspace + ':' + watershed + '-' + subbasin + '-drainage_line',
                                srsname: 'EPSG:3857',
                                outputFormat: 'text/javascript',
                                bbox: extent.join(',') + ',EPSG:3857'
                            },
                            dataType: 'jsonp',
                            jsonpCallback: 'callback:loadFeatures',
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
                            width: 30
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
                vectorLayer.getSource().addFeatures(new ol.format.GeoJSON().readFeatures(response));
            };

            map.addLayer(vectorLayer);

            var capabilities = $.ajax('http://tethys.byu.edu:8181/geoserver/' + workspace + '/ows', {
                type: 'GET',
                data: {
                    service: 'WFS',
                    version: '1.0.0',
                    request: 'GetCapabilities',
                    outputFormat: 'text/javascript'
                },
                success: function () {
                    var x = capabilities.responseText
                        .split('<FeatureTypeList>')[1]
                        .split(workspace + ':' + watershed + '-' + subbasin)[1]
                        .split('LatLongBoundingBox ')[1]
                        .split('/></FeatureType>')[0];

                    var minx = Number(x.split('"')[1]);
                    var miny = Number(x.split('"')[3]);
                    var maxx = Number(x.split('"')[5]);
                    var maxy = Number(x.split('"')[7]);

                    var extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:3857').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:3857'));

                    map.getView().fit(extent, map.getSize())
                }
            });

            select_interaction = new ol.interaction.Select({
                layers: [vectorLayer],
            });

            map.addInteraction(select_interaction);

            select_interaction.on('select', function (e) {
                var comid = e.selected[0].get('COMID');
                var model = location.pathname.split('hydroviewer/')[1].replace('/','');
                var startdate = '';

                get_time_series(model, watershed, subbasin, comid, startdate);

            });

        } else {
            $("#inner-app-content").removeClass("row");
            $("#map").removeClass("col-md-7");
            $("#graph").addClass("hidden");
            $("#graph").removeClass("col-md-5");

            map.updateSize();
            map.removeInteraction(select_interaction);
            map.removeLayer(vectorLayer);
            map.getView().fit([-13599676.07249856, -6815054.405920124, 13599676.07249856, 11030851.461876547], map.getSize())
        };
    });

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
});

function submit_model() {
    if ($('#modelSelect option:selected').val() === 'ecmwf') {
        location.href = 'http://' + location.host + '/apps/hydroviewer/ecmwf-rapid/';
    } else if ($('#modelSelect option:selected').val() === 'lis') {
        location.href = 'http://' + location.host + '/apps/hydroviewer/lis-rapid/';
    };
};

function get_time_series(model, watershed, subbasin, comid, startdate) {
    $.ajax({
        type: 'GET',
        url: 'get-time-series/',
        dataType: 'json',
        data: {
            'model': model,
            'watershed': watershed,
            'subbasin': subbasin,
            'comid': comid,
            'startdate': startdate
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the data</strong></p>');
            // clearErrorSelection();
        },
        beforeSend: function () {
            // $('#info').html('<p class="alert alert-info" style="text-align: center"><strong>' +
            //     'Retrieving forecasts' + '</strong></p>').removeClass('hidden');
        },
        complete: function () {
            // setTimeout(function () {
            //     $('#info').addClass('hidden')
            // }, 5000);
        },
        success: function (data) {
    //         if ("success" in data) {
    //             if ("ts_pairs_data" in data) {
    //                 var returned_tsPairsData = JSON.parse(data.ts_pairs_data);
    //                 for (var key in returned_tsPairsData) {
    //                     if (returned_tsPairsData[key][2] === 'notLong') {
    //                         var d = new Date(0);
    //                         startDate = d.setUTCSeconds(returned_tsPairsData[key][0]);
    //                         seriesData = returned_tsPairsData[key][1];
    //                         nc_chart.yAxis[0].setExtremes(null, null);
    //                         plotData(config, geom, variable, seriesData, startDate);
    //                     } else {
    //
    //                         for (j = 0; j < returned_tsPairsData[key].length; j++) {
    //                             var d = new Date(0);
    //                             var startDateG = d.setUTCSeconds(returned_tsPairsData[key][j][0]);
    //                             for (i = 1; i < returned_tsPairsData[key][j].length - 1; i++) {
    //                                 var seriesDataTemp = returned_tsPairsData[key][j][i];
    //                                 var seriesDesc = 'Member 0' + String(i) + ' ' +
    //                                     returned_tsPairsData[key][j][returned_tsPairsData[key][j].length - 1];
    //                                 seriesDataGroup.push([seriesDataTemp, seriesDesc, startDateG]);
    //                                 nc_chart.yAxis[0].setExtremes(null, null);
    //                                 plotData(config, geom, variable, seriesDataTemp, startDateG, i - 1, seriesDesc);
    //                             };
    //                         };
    //                     };
    //                 };
    //             };
    //         } else if ("error" in data) {
    //             $('#nc-chart').addClass('hidden')
    //             $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>' + data['error'] + '</strong></p>').removeClass('hidden').addClass('error');
    //
    //             // Hide error message 5 seconds after showing it
    //             setTimeout(function () {
    //                 $('#info').addClass('hidden')
    //             }, 5000);
    //         } else {
    //             viewer.entities.resumeEvents();
    //             $('#info').html('<p><strong>An unexplainable error occurred. Why? Who knows...</strong></p>').removeClass('hidden');
    //         };
        }
    });
};