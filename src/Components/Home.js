import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import $ from 'jquery';
import geojson from '../plotting/map.geojson';
import { NavLink } from 'react-router-dom';
// import excep from '../public/plotting/excep.json';
import M from 'materialize-css/dist/js/materialize.min.js';

export class Home extends Component {
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.tooltipped');
            var instances = M.Tooltip.init(elems, {});
        });

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                console.log('Failure');
            }
        }
        getLocation();
        //-----------------------------
        function showError(error) {
            // document.getElementById("error_location").style.display = "block";
            // document.getElementById("wrapper").style.display = "none";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    document.getElementById("mainCards").innerHTML = " User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                    // document.getElementById("loc_error_message").innerHTML = " Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    // document.getElementById("loc_error_message").innerHTML = " The request to get user location timed out.";
                    break;
                default:
                    console.log("An unknown error occurred.");
                    // document.getElementById("loc_error_message").innerHTML = " An unknown error occurred.";
                    break;
            }
        }

        function showPosition(position) {
            var user_lat = position.coords.latitude;
            var user_long = position.coords.longitude;

            // console.log("Your current coordinates:" + "Lat:" + user_lat + " Long:" + user_long)
            var flag = 0;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://us1.locationiq.com/v1/reverse.php?key=59503131102f5b&lat=" + user_lat + "&lon=" + user_long + "&format=json",
                "method": "GET"
            }

            $.ajax(settings).done(function (response) {
                console.log(response);
                var city = document.getElementsByClassName("user_city");
                var final_place;
                var final_state;
                if (response.address.state_district) {
                    city[0].innerHTML = response.address.state_district;
                    final_place = response.address.state_district;
                }
                else {
                    city[0].innerHTML = response.address.city;
                    final_place = response.address.city;
                }

                var state = document.getElementsByClassName("user_region");
                state[0].innerHTML = response.address.state;
                final_state = response.address.state;
                var country = document.getElementsByClassName("user_country");
                country[0].innerHTML = response.address.country;
                fetch('./plotting/excep.json')
                    .then((resp) => resp.json())
                    .then(function (data) {
                        console.log(data[0]);
                        var counter = 0;
                        for (counter = 0; counter < data.length; counter++) {
                            if (data[counter].district === final_place) {
                                final_place = data[counter].district2;
                                break;
                            }
                            else {
                                continue;
                            }
                        }
                        card1_info(final_place, final_state);
                    });
            });



            // console.log(typeof(user_lat));
            mapboxgl.accessToken = 'pk.eyJ1IjoiYWF5dXNoc2FpbmkiLCJhIjoiY2s4Zzl0cm0zMGFlNTNwbm9tZXJ5cThydiJ9.c8-bbolyM9LbA0zyO16wwg';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v10',
                zoom: 9,
                center: [user_long, user_lat]
            });
            var size = 200;
            map.addControl(new mapboxgl.FullscreenControl());

            // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
            // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
            var pulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),

                // get rendering context for the map canvas when layer is added to the map
                onAdd: function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    this.context = canvas.getContext('2d');
                },

                // called once before every frame where the icon will be used
                render: function () {
                    var duration = 1000;
                    var t = (performance.now() % duration) / duration;

                    var radius = (size / 2) * 0.3;
                    var outerRadius = (size / 2) * 0.7 * t + radius;
                    var context = this.context;

                    // draw outer circle
                    context.clearRect(0, 0, this.width, this.height);
                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        outerRadius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                    context.fill();

                    // draw inner circle
                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        radius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = 'rgba(255, 100, 100, 1)';
                    context.strokeStyle = 'white';
                    context.lineWidth = 2 + 4 * (1 - t);
                    context.fill();
                    context.stroke();

                    // update this image's data with data from the canvas
                    this.data = context.getImageData(
                        0,
                        0,
                        this.width,
                        this.height
                    ).data;

                    // continuously repaint the map, resulting in the smooth animation of the dot
                    map.triggerRepaint();

                    // return `true` to let the map know that the image was updated
                    return true;
                }
            };

            map.on('load', function () {
                map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [user_long, user_lat]
                                }
                            }
                        ]
                    }
                });
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'pulsing-dot'
                    }
                });

                map.addSource('earthquakes', {
                    type: 'geojson',
                    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                    data: geojson,
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                });

                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'earthquakes',
                    filter: ['has', 'point_count'],
                    paint: {
                        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            'rgba(29, 245, 195, 0.75)',
                            100,
                            'rgba(246, 168, 33, 0.77)',
                            250,
                            'rgba(245, 105, 29, 0.77)',
                            600,
                            'rgba(255, 15, 15, 0.84)'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40
                        ]
                    }
                });

                var renderOptions = document.getElementById('menu');
                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'earthquakes',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });


                map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'earthquakes',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#1df5c3',
                        'circle-radius': 10,
                        'circle-stroke-width': 4,
                        'circle-stroke-color': '#19c29b'
                    }
                });

                map.on('mouseenter', 'clusters', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', 'clusters', function () {
                    map.getCanvas().style.cursor = '';
                });
                var popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });
                map.on('mouseenter', 'unclustered-point', function (e) {
                    var coordinates = e.features[0].geometry.coordinates.slice();
                    map.getCanvas().style.cursor = 'pointer';
                    popup
                        .setLngLat(coordinates)
                        .setHTML("One Patient Registered Here")
                        .addTo(map);
                });
                map.on('mouseleave', 'unclustered-point', function () {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                });
            });
        }


        function card1_info(final_place, final_state) {
            console.log("For card1");
            fetch("https://api.covid19india.org/v2/state_district_wise.json")
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    final_place = (final_place.replace(/\s/g, '')).toLowerCase();
                    console.log(final_place, final_state);
                    var counter = 0;
                    var counter2 = 0;
                    for (counter = 0; counter < data.length; counter++) {
                        if (data[counter].state === final_state) {
                            console.log("State Located: " + data[counter].state);
                            for (counter2 = 0; counter2 < data[counter].districtData.length; counter2++) {
                                if (((data[counter].districtData[counter2].district).toLowerCase()).replace(/\s/g, '') === final_place) {

                                    console.log("District Located: " + ((data[counter].districtData[counter2].district).toLowerCase()).replace(/\s/g, ''));
                                    console.log("District Cases: " + data[counter].districtData[counter2].confirmed);
                                    document.getElementById('user_place_cnf').innerHTML = data[counter].districtData[counter2].confirmed;
                                    document.getElementById('user_place_cnf').style.color = 'coral';
                                    document.getElementById('user_place_cnf').style.fontWeight = 'bold';
                                    document.getElementById('user_place_cnf').style.fontSize = '1.12em';

                                    console.log("District Cases: " + data[counter].districtData[counter2].active);
                                    document.getElementById('user_place_act').innerHTML = data[counter].districtData[counter2].active;
                                    document.getElementById('user_place_act').style.color = '#ff7043';
                                    document.getElementById('user_place_act').style.fontWeight = 'bold';
                                    document.getElementById('user_place_act').style.fontSize = '1.12em';

                                    console.log("District Cases: " + data[counter].districtData[counter2].recovered);
                                    document.getElementById('user_place_rec').innerHTML = data[counter].districtData[counter2].recovered;
                                    document.getElementById('user_place_rec').style.color = '#1de9b6';
                                    document.getElementById('user_place_rec').style.fontWeight = 'bold';
                                    document.getElementById('user_place_rec').style.fontSize = '1.12em';

                                    console.log("District Cases: " + data[counter].districtData[counter2].deceased);
                                    document.getElementById('user_place_ded').innerHTML = data[counter].districtData[counter2].deceased;
                                    document.getElementById('user_place_ded').style.color = '#e53935';
                                    document.getElementById('user_place_ded').style.fontWeight = 'bold';
                                    document.getElementById('user_place_ded').style.fontSize = '1.12em';

                                    if (data[counter].districtData[counter2].delta.confirmed < 1) {
                                        document.getElementById("cnf_daily_dist").style.display = "none";
                                    } else {
                                        document.getElementById("increased_count_district_cnf").innerHTML = data[counter].districtData[counter2].delta.confirmed;
                                        document.getElementById("cnf_arrow_district").innerHTML = "arrow_upward";
                                        document.getElementById("cnf_arrow_district").style.color = "coral";
                                    }

                                    if (data[counter].districtData[counter2].delta.recovered < 1) {
                                        document.getElementById("rec_daily_dist").style.display = "none";
                                    } else {
                                        document.getElementById("increased_count_district_rec").innerHTML = data[counter].districtData[counter2].delta.recovered;
                                        document.getElementById("rec_arrow_district").innerHTML = "arrow_upward";
                                        document.getElementById("rec_arrow_district").style.color = "aqua";
                                    }

                                    if (data[counter].districtData[counter2].delta.deceased < 1) {
                                        document.getElementById("ded_daily_dist").style.display = "none";
                                    } else {
                                        document.getElementById("increased_count_district_ded").innerHTML = data[counter].districtData[counter2].delta.deceased;
                                        document.getElementById("ded_arrow_district").innerHTML = "arrow_upward";
                                        document.getElementById("ded_arrow_district").style.color = "red";
                                    }
                                }
                            }
                        }
                    }
                });
            card2_info(final_state)
        }

        function card2_info(final_state) {
            fetch("https://api.covid19india.org/data.json")
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    var counter = 1;

                    document.getElementById('increased_count').innerHTML = data.statewise[0].deltaconfirmed;
                    document.getElementById('cnf_arrow_home').innerHTML = "arrow_upward";
                    document.getElementById('cnf_arrow_home').style.color = "red";
                    for (counter = 1; counter < data.statewise.length; counter++) {
                        if (data.statewise[counter].state === final_state) {
                            console.log(data.statewise[0].deltaconfirmed);
                            document.getElementById('user_state_cnf').innerHTML = data.statewise[counter].confirmed;
                            document.getElementById('user_state_cnf').style.color = 'coral';
                            document.getElementById('user_state_cnf').style.fontWeight = 'bold';
                            document.getElementById('user_state_cnf').style.fontSize = '1.12em';

                            document.getElementById('user_state_act').innerHTML = data.statewise[counter].active;
                            document.getElementById('user_state_act').style.color = '#ff7043';
                            document.getElementById('user_state_act').style.fontWeight = 'bold';
                            document.getElementById('user_state_act').style.fontSize = '1.12em';

                            document.getElementById('user_state_rec').innerHTML = data.statewise[counter].recovered;
                            document.getElementById('user_state_rec').style.color = '#1de9b6';
                            document.getElementById('user_state_rec').style.fontWeight = 'bold';
                            document.getElementById('user_state_rec').style.fontSize = '1.12em';

                            document.getElementById('user_state_ded').innerHTML = data.statewise[counter].deaths;
                            document.getElementById('user_state_ded').style.color = '#e53935';
                            document.getElementById('user_state_ded').style.fontWeight = 'bold';
                            document.getElementById('user_state_ded').style.fontSize = '1.12em';

                            if (data.statewise[counter].deltaconfirmed < 1) {
                                document.getElementById("cnf_daily_state").style.display = "none";
                            } else {
                                document.getElementById("increased_cnf_state").innerHTML = data.statewise[counter].deltaconfirmed;
                                document.getElementById("cnf_arrow_state").innerHTML = "arrow_upward";
                                document.getElementById("cnf_arrow_state").style.color = "coral";
                            }

                            if (data.statewise[counter].deltarecovered < 1) {
                                document.getElementById("rec_daily_state").style.display = "none";
                            } else {
                                document.getElementById("increased_rec_state").innerHTML = data.statewise[counter].deltarecovered;
                                document.getElementById("rec_arrow_state").innerHTML = "arrow_upward";
                                document.getElementById("rec_arrow_state").style.color = "aqua";
                            }

                            if (data.statewise[counter].deltadeaths < 1) {
                                document.getElementById("ded_daily_state").style.display = "none";
                            } else {
                                document.getElementById("increased_ded_state").innerHTML = data.statewise[counter].deltadeaths;
                                document.getElementById("ded_arrow_state").innerHTML = "arrow_upward";
                                document.getElementById("ded_arrow_state").style.color = "red";
                            }

                        }
                    }
                    document.getElementById('user_country_cnf').innerHTML = data.statewise[0].confirmed;
                    document.getElementById('user_country_cnf').style.color = 'coral';
                    document.getElementById('user_country_cnf').style.fontWeight = 'bold';
                    document.getElementById('user_country_cnf').style.fontSize = '1.12em';

                    document.getElementById('user_country_act').innerHTML = data.statewise[0].active;
                    document.getElementById('user_country_act').style.color = '#ff7043';
                    document.getElementById('user_country_act').style.fontWeight = 'bold';
                    document.getElementById('user_country_act').style.fontSize = '1.12em';

                    document.getElementById('user_country_rec').innerHTML = data.statewise[0].recovered;
                    document.getElementById('user_country_rec').style.color = '#1de9b6';
                    document.getElementById('user_country_rec').style.fontWeight = 'bold';
                    document.getElementById('user_country_rec').style.fontSize = '1.12em';

                    document.getElementById('user_country_ded').innerHTML = data.statewise[0].deaths;
                    document.getElementById('user_country_ded').style.color = '#e53935 ';
                    document.getElementById('user_country_ded').style.fontWeight = 'bold';
                    document.getElementById('user_country_ded').style.fontSize = '1.12em';
                });
        }


    }
    render() {
        return (
            <div>
                <div id='map' style={{ top: '0', bottom: '0', width: '100%', height: '60vh' }}> </div>
                <div className="row" id="mainCards" style={{ marginTop: '1.2em', width: '99%' }}>
                    <div className="col s12 m4 l4">
                        <div className="card-panel grey darken-3 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content white-text">
                                <span className="card-title" style={{ fontSize: '1.5em', fontWeight: 'lighter' }}>Your District: <span
                                    className="user_city">loading...</span> <i className="material-icons tiny tooltipped grey-text"
                                        id='user_zone' data-position="top"
                                        data-tooltip="Please confirm district's zone<br>from local authorities">info_outline</i></span>
                                <span>
                                    <p style={{ fontSize: '1.1em' }}><span className="left">Confirmed: <span
                                        id="user_place_cnf">loading...</span>&nbsp;<span id="cnf_daily_dist"><span className="tooltipped" data-position="top" data-tooltip="Daily Confirmed Cases">
                                            <i className="material-icons" id="cnf_arrow_district" style={{ fontSize: '0.7em' }}></i>
                                            <span id="increased_count_district_cnf" style={{ fontSize: '0.8em', fontWeight: '400' }}></span></span></span></span>
                                        <span className="right">Active: <span id="user_place_act">loading...</span></span>
                                    </p>
                                    <br />

                                    <p style={{ fontSize: '1.1em' }}> <span className="left">Recovered: <span
                                        id="user_place_rec">loading...</span>&nbsp;<span id="rec_daily_dist"><span
                                            className="tooltipped" data-position="top" data-tooltip="Daily Recovered Cases"><i
                                                className="material-icons" id="rec_arrow_district"
                                                style={{ fontSize: '0.7em' }}></i><span id="increased_count_district_rec"
                                                    style={{ fontSize: '0.8em', fontWeight: '400' }}></span></span></span></span>
                                        <span className="right">Deaths: <span id="user_place_ded">loading...</span>&nbsp;<span id="ded_daily_dist"><span
                                            className="tooltipped" data-position="top" data-tooltip="Daily Death Cases"><i
                                                className="material-icons" id="ded_arrow_district"
                                                style={{ fontSize: '0.7em' }}></i><span id="increased_count_district_ded"
                                                    style={{ fontSize: '0.8em', fontWeight: '400' }}></span></span></span></span>
                                    </p>
                                    <br />
                                    <p>
                                        <span className="left">
                                            <a id="service_available" className="grey-text modal-trigger right" href="#modal1"
                                                style={{ fontSize: '0.8em', display: 'none' }}>Tap for services</a>
                                            <a className="grey-text left" style={{ fontSize: '0.8em' }} href="tel:+91-11-23978046">Call Helpline</a>
                                        </span>
                                    </p>
                                </span>
                                {/* <br/> */}

                                {/* <script>$(document).ready(function () { $('.tooltipped').tooltip(); });</script> */}

                            </div>
                        </div>
                    </div>

                    <div className="col s12 m4 l4">
                        <div className="card-panel grey darken-3 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content white-text"> <span className="card-title"
                                style={{ fontSize: '1.5em', fontWeight: 'lighter' }}>Your Region: <span
                                    className="user_region">loading...</span></span>

                                <p style={{ fontSize: '1.1em' }}><span className="left">Confirmed: <span
                                    id="user_state_cnf">loading...</span>&nbsp;<span id="cnf_daily_state"
                                        className="tooltipped" data-position="top" data-tooltip="Daily Confirmed Cases"><i
                                            className="material-icons" id="cnf_arrow_state" style={{ fontSize: '0.7em' }}></i><span
                                                id="increased_cnf_state" style={{ fontSize: '0.8em', fontWeight: '400' }}>
                                        </span></span></span> <span className="right" style={{ marginTop: '-2px' }}>Active: <span
                                            id="user_state_act">loading...</span></span> </p><br />
                                <p style={{ fontSize: '1.1em' }}><span className="left">Recovered: <span
                                    id="user_state_rec">loading...</span>&nbsp;<span id="rec_daily_state"
                                        className="tooltipped" data-position="top" data-tooltip="Daily Recovered Cases"><i
                                            className="material-icons" id="rec_arrow_state" style={{ fontSize: '0.7em' }}></i><span
                                                id="increased_rec_state" style={{ fontSize: '0.8em', fontWeight: '400' }}>
                                        </span></span></span>
                                    <span className="right" style={{ marginTop: '-0px' }}>Deaths: <span
                                        id="user_state_ded">loading...</span>&nbsp;<span id="ded_daily_state"
                                            className="tooltipped" data-position="top" data-tooltip="Daily Death Cases"><i
                                                className="material-icons" id="ded_arrow_state" style={{ fontSize: '0.7em' }}></i><span
                                                    id="increased_ded_state" style={{ fontSize: '0.8em', fontWeight: '400' }}>
                                            </span></span></span> </p><br />

                            </div>
                        </div>
                    </div>

                    <div className="col s12 m4 l4">
                        <div className="card-panel grey darken-3 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content white-text">
                                <span className="card-title" style={{ fontSize: '1.5em', fontWeight: 'lighter' }}>Your Country: <span
                                    className="user_country">loading...</span>&nbsp;<span id="cnt_sig"><i
                                        className="tiny material-icons" id="cnf_arrow_home"></i><span id="increased_count"
                                            style={{ fontSize: '0.8em', fontWeight: '300' }}> </span></span></span>
                                <p style={{ fontSize: '1.1em' }}><span className="left">Confirmed: <span
                                    id="user_country_cnf">loading...</span></span> <span className="right"
                                        style={{ marginTop: '-2px' }}>Active: <span id="user_country_act">loading...</span></span>
                                </p><br />
                                <p style={{ fontSize: '1.1em' }}><span className="left">Recovered: <span
                                    id="user_country_rec">loading...</span></span> <span className="right"
                                        style={{ marginTop: '-0px' }}>Deaths: <span id="user_country_ded">loading...</span></span>
                                </p><br />
                            </div>
                        </div>
                    </div>
                    <div className="user_region"></div>
                    <div className="user_country"></div>
                </div>
                <div className="row" style={{marginBottom: '-5px'}}>
                    <div className="row hide-on-small-only show-on-med-and-up">
                        <div className="col m6 l6">
                            <center><NavLink to="/analytics" className="waves-effect waves-light btn z-depth-3 deep-purple darken-2"
                                style={{borderRadius: '5px', width: '70%'}}><i className="material-icons right"
                                    style={{marginRight: '2%'}}>timeline</i>go to analytics</NavLink></center>
                        </div>
                        <div className="col m6 l6">
                            <center><a href="https://paytm.com/helpinghand/pm-cares-fund"
                                className="waves-effect waves-light btn z-depth-3 pink" style={{borderRadius: '5px', width: '70%'}}><i
                                className="material-icons right" style={{marginRight: '2%'}}>local_hospital</i>Donate to pm cares
                    fund</a></center>
                        </div>
                    </div>
                    <div className="row show-on-small hide-on-med-and-up">
                        <div className="col s12">
                            <center><NavLink to="/analytics" className="waves-effect waves-light btn z-depth-3 deep-purple darken-2"
                                style={{borderRadius: '5px', width: '70%'}}><i className="material-icons right"
                                    style={{marginRight: '2%'}}>timeline</i>go to analytics</NavLink></center>
                        </div>
                    </div>
                    <div className="row show-on-small hide-on-med-and-up">
                        <div className="col s12">
                            <center><a href="https://paytm.com/helpinghand/pm-cares-fund"
                                className="waves-effect waves-light btn z-depth-3 pink" style={{borderRadius: '5px',width: '70%'}}><i
                                className="material-icons right" style={{marginRight: '2%'}}>local_hospital</i>Donate to pm cares
                    fund</a></center>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
