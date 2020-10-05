import React, { Component } from 'react';
import Chart from "chart.js";

export class Analytics extends Component {
    componentDidMount() {
        function load_analytics() {

            get_data1();
            get_data2();
        }

        const x_axis_rec = [];
        const y_axis_rec = [];
        const x_axis_ded = [];
        const y_axis_ded = [];

        function draw(x_axis_cnf1, y_axis_cnf1, y_axis_rec1, y_axis_ded1) {
            Chart.defaults.global.defaultFontColor = '#969696';

            var x_axis_cnf = x_axis_cnf1;
            var y_axis_cnf = y_axis_cnf1;
            var y_axis_rec = y_axis_rec1;
            var y_axis_ded = y_axis_ded1;
            document.getElementById('load').style.display = 'none';
            console.log("-->", y_axis_cnf);
            new Chart(document.getElementById("line-chart_cnf"), {
                type: 'line',
                data: {
                    labels: x_axis_cnf,
                    datasets: [{
                        data: y_axis_cnf,
                        label: "Confirmed cases in India",
                        borderColor: "#de7e00",
                        backgroundColor: "#edaf5c",
                        fill: true
                    }
                    ]
                }
            });
            new Chart(document.getElementById("line-chart_cnf2"), {
                type: 'line',
                data: {
                    labels: x_axis_cnf,
                    datasets: [{
                        data: y_axis_cnf,
                        label: "Confirmed cases in India",
                        borderColor: "#de7e00",
                        backgroundColor: "#edaf5c",
                        fill: true
                    }
                    ]
                }
            });

            document.getElementById('load_rec').style.display = 'none';
            new Chart(document.getElementById("line-chart_rec"), {
                type: 'line',
                data: {
                    labels: x_axis_cnf,
                    datasets: [{
                        data: y_axis_rec,
                        label: "Recovered cases in India",
                        borderColor: "#09bd78",
                        backgroundColor: "#71e3b7",
                        fill: true
                    }
                    ]
                }
            });
            new Chart(document.getElementById("line-chart_rec2"), {
                type: 'line',
                data: {
                    labels: x_axis_cnf,
                    datasets: [{
                        data: y_axis_rec,
                        label: "Recovered cases in India",
                        borderColor: "#09bd78",
                        backgroundColor: "#71e3b7",
                        fill: true
                    }
                    ]
                }
            });
            document.getElementById('load_ded').style.display = 'none';
            new Chart(document.getElementById("line-chart_ded"), {
                type: 'line',
                data: {
                    labels: x_axis_cnf,
                    datasets: [{
                        data: y_axis_ded,
                        label: "Death cases in India",
                        borderColor: "#db3030",
                        backgroundColor: "#e38686",
                        fill: true
                    }
                    ]
                }
            });
            document.getElementById('load_ded').style.display = 'none';
            new Chart(document.getElementById("line-chart_ded2"), {
                type: 'line',
                data: {
                    labels: x_axis_cnf,
                    datasets: [{
                        data: y_axis_ded,
                        label: "Death cases in India",
                        borderColor: "#db3030",
                        backgroundColor: "#e38686",
                        fill: true
                    }
                    ]
                }
            });

            // new Chart(document.getElementById("line-chart_dedm"), {
            //     type: 'bar',
            //     data: {
            //         labels: x_axis_state,
            //         datasets: [{
            //             data: y_axis_state,
            //             label: "No. of cases in each state",
            //             borderColor: "#a900e6",
            //             backgroundColor: "#d593ed",
            //             fill: true
            //         }
            //         ]
            //     }
            // });
        }

        function draw2(x_axis_cnf1, y_axis_cnf1, y_axis_death, y_axis_rec) {
            var x_axis_state = x_axis_cnf1;
            var y_axis_state = y_axis_cnf1;
            // var y_axis_state_death = y_axis_death;
            // var y_axis_state_rec = y_axis_rec;
            // console.log(x_axis_state, y_axis_state);
            document.getElementById('load_state').style.display = 'none';
            new Chart(document.getElementById("line-chart_dedm"), {
                type: 'horizontalBar',
                data: {
                    labels: x_axis_state,
                    datasets: [{
                        data: y_axis_state,
                        label: "No. of cases in each state",
                        borderColor: "#a900e6",
                        backgroundColor: "#cf7bed",
                        fill: true
                    }
                    ]
                }
            });
            new Chart(document.getElementById("line-chart_dedm2"), {
                type: 'bar',
                data: {
                    labels: x_axis_state,
                    datasets: [{
                        data: y_axis_state,
                        label: "No. of cases in each state",
                        borderColor: "#a900e6",
                        backgroundColor: "#cf7bed",
                        fill: true
                    }
                    ]
                }
            });
        }

        function get_data1() {
            fetch("https://api.covid19india.org/data.json")
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    // console.log(data.cases_time_series[74]);
                    var x_axis_cnf1 = [];
                    var y_axis_cnf1 = [];
                    var y_axis_rec1 = [];
                    var y_axis_ded1 = [];
                    var today_count_cnf;
                    var yesterday_count_cnf;
                    var len = data.cases_time_series.length;
                    var counter = 0;
                    for (counter = 0; counter < (data.cases_time_series.length); counter++) {
                        x_axis_cnf1[counter] = data.cases_time_series[counter].date;
                        y_axis_cnf1[counter] = Number(data.cases_time_series[counter].dailyconfirmed)
                        y_axis_rec1[counter] = Number(data.cases_time_series[counter].dailyrecovered);
                        y_axis_ded1[counter] = Number(data.cases_time_series[counter].dailydeceased);
                        // console.log(parseInt(data.cases_time_series[counter].totalconfirmed));
                    }
                    var today_count_cnf = data.cases_time_series[len - 1].totalconfirmed;
                    var today_count_rec = data.cases_time_series[len - 1].totalrecovered;
                    var today_count_ded = data.cases_time_series[len - 1].totaldeceased;

                    var rec_rate = (today_count_rec / today_count_cnf) * 100;
                    var dead_rate = (today_count_ded / today_count_cnf) * 100;
                    rec_rate = (rec_rate.toString()).slice(0, 6);
                    dead_rate = (dead_rate.toString()).slice(0, 6);
                    document.getElementById("recovery_rate").innerHTML = rec_rate;
                    document.getElementById("death_rate").innerHTML = dead_rate;
                    var len_tested = data.tested.length;
                    document.getElementById("icmr_samples").innerHTML = data.tested[len_tested - 1].totalsamplestested;
                    document.getElementById("icmr_individuals").innerHTML = data.tested[len_tested - 1].totalindividualstested;

                    var yesterday_count_cnf = data.cases_time_series[len - 2].totalconfirmed;
                    var yesterday_count_rec = data.cases_time_series[len - 2].totalrecovered;
                    var yesterday_count_ded = data.cases_time_series[len - 2].totaldeceased;

                    var differnce_cnf = today_count_cnf - yesterday_count_cnf;
                    var differnce_rec = today_count_rec - yesterday_count_rec;
                    var differnce_ded = today_count_ded - yesterday_count_ded;

                    document.getElementById("cnf_no").innerHTML = today_count_cnf;
                    document.getElementById("rec_no").innerHTML = today_count_rec;
                    document.getElementById("ded_no").innerHTML = today_count_ded;
                    draw(x_axis_cnf1, y_axis_cnf1, y_axis_rec1, y_axis_ded1);
                    document.getElementById("cnf_no").style.color = 'coral';
                    document.getElementById("rec_no").style.color = '#1de9b6';
                    document.getElementById("ded_no").style.color = '#ff3838';
                    if (differnce_cnf > 0) {
                        document.getElementById('daily_cnf_arrow').innerHTML = "arrow_upward";
                        document.getElementById('daily_cnf_arrow').style.color = "red";
                        document.getElementById('count_diff').innerHTML = differnce_cnf;
                    }
                    else {
                        document.getElementById('daily_cnf_arrow').innerHTML = "arrow_downward";
                        document.getElementById('daily_cnf_arrow').style.color = "green";
                        document.getElementById('count_diff').innerHTML = differnce_cnf;
                        // }
                    }
                    if (differnce_rec > 0) {
                        document.getElementById('daily_rec_arrow').innerHTML = "arrow_upward";
                        document.getElementById('daily_rec_arrow').style.color = "#07b536";
                        document.getElementById('count_diff_rec').innerHTML = differnce_rec;
                    }
                    else {
                        document.getElementById('daily_rec_arrow').innerHTML = "arrow_downward";
                        document.getElementById('daily_rec_arrow').style.color = "red";
                        document.getElementById('count_diff_rec').innerHTML = differnce_rec;
                    }
                    if (differnce_ded > 0) {
                        document.getElementById('daily_ded_arrow').innerHTML = "arrow_upward";
                        document.getElementById('daily_ded_arrow').style.color = "red";
                        document.getElementById('count_diff_ded').innerHTML = differnce_ded;
                    }
                    else {
                        document.getElementById('daily_ded_arrow').innerHTML = "arrow_downward";
                        document.getElementById('daily_ded_arrow').style.color = "#07b536";
                        document.getElementById('count_diff_ded').innerHTML = differnce_ded;
                    }
                    // console.log(data.cases_time_series[73].date) ;
                });


            // const response = fetch('https://api.covid19india.org/data.json');
            // const data = await (await response).text();
            // const rows = data.split('\n').slice(1);
            // rows.forEach(row => {
            //     const columns = row.split(',');
            //     const date = columns[0];
            //     const confirm_cases = columns[2];
            //     const recover_cases = columns[4];
            //     const death_cases = columns[6];
            //     console.log(columns);
            //     x_axis_cnf.push(date);
            //     y_axis_cnf.push(confirm_cases);
            //     y_axis_rec.push(recover_cases);
            //     y_axis_ded.push(death_cases);
            // });
            // const response2 = fetch('./plotting/state_count.csv');
            // const state_data = await (await response2).text();
            // const rows2 = state_data.split('\n').slice(1);
            // rows2.forEach(row2 => {
            //     const columns2 = row2.split(',');
            //     const date = columns2[0];
            //     const confirm_cases = columns2[1];
            //     x_axis_state.push(date);
            //     y_axis_state.push(confirm_cases);
            // });


            // const today_count_cnf = rows[rows.length - 1].split(",");
            // const yesterday_count_cnf = rows[rows.length - 2].split(",");
            // const today_count_rec = rows[rows.length - 1].split(",");
            // const yesterday_count_rec = rows[rows.length - 2].split(",");
            // const today_count_ded = rows[rows.length - 1].split(",");
            // const yesterday_count_ded = rows[rows.length - 2].split(",");

            // document.getElementById('cnf_no').innerHTML = today_count_cnf[2];
            // document.getElementById('cnf_no').style.color = "#e68300";
            // document.getElementById('rec_no').innerHTML = today_count_rec[4];
            // document.getElementById('rec_no').style.color = "#13d68b";
            // document.getElementById('ded_no').innerHTML = today_count_rec[6];
            // document.getElementById('ded_no').style.color = "#db3030";

            // console.log(today_count_cnf, yesterday_count_cnf);

            // const differnce_cnf = today_count_cnf[2] - yesterday_count_cnf[2];
            // const differnce_rec = today_count_rec[4] - yesterday_count_rec[4];
            // const differnce_ded = today_count_ded[6] - yesterday_count_ded[6];

            // console.log(differnce_cnf);
            // if (differnce_cnf > 0) {
            //     document.getElementById('daily_cnf_arrow').innerHTML = "arrow_upward";
            //     document.getElementById('daily_cnf_arrow').style.color = "red";
            //     document.getElementById('count_diff').innerHTML = differnce_cnf;
            // }
            // else {
            //     document.getElementById('daily_cnf_arrow').innerHTML = "arrow_downward";
            //     document.getElementById('daily_cnf_arrow').style.color = "green";
            //     document.getElementById('count_diff').innerHTML = differnce_cnf;
            // }
            // if (differnce_rec > 0) {
            //     document.getElementById('daily_rec_arrow').innerHTML = "arrow_upward";
            //     document.getElementById('daily_rec_arrow').style.color = "green";
            //     document.getElementById('count_diff_rec').innerHTML = differnce_rec;
            // }
            // else {
            //     document.getElementById('daily_rec_arrow').innerHTML = "arrow_downward";
            //     document.getElementById('daily_rec_arrow').style.color = "red";
            //     document.getElementById('count_diff_rec').innerHTML = differnce_rec;
            // }
            // if (differnce_ded > 0) {
            //     document.getElementById('daily_ded_arrow').innerHTML = "arrow_upward";
            //     document.getElementById('daily_ded_arrow').style.color = "red";
            //     document.getElementById('count_diff_ded').innerHTML = differnce_ded;
            // }
            // else {
            //     document.getElementById('daily_ded_arrow').innerHTML = "arrow_downward";
            //     document.getElementById('daily_ded_arrow').style.color = "green";
            //     document.getElementById('count_diff_ded').innerHTML = differnce_ded;
            // }


            // const d = "3:00PM - 12 Apr";
            // document.getElementById('data_update_date_cnf').innerHTML = d;
            // document.getElementById('data_update_date_rec').innerHTML = d;
            // document.getElementById('data_update_date_ded').innerHTML = d;
            // document.getElementById('data_update_date_state').innerHTML = d;
        }

        function get_data2() {
            fetch("https://api.covid19india.org/data.json")
                .then(function (resp) {
                    return resp.json();
                })
                .then(function (data) {
                    var x_axis_cnf1 = [];
                    var y_axis_cnf1 = [];
                    var y_axis_death = [];
                    var y_axis_rec = [];
                    var counter;
                    for (counter = 1; counter < data.statewise.length; counter++) {
                        x_axis_cnf1[counter] = data.statewise[counter].state;
                        y_axis_cnf1[counter] = Number(data.statewise[counter].confirmed);
                        y_axis_death[counter] = Number(data.statewise[counter].deaths);
                        y_axis_rec[counter] = Number(data.statewise[counter].recovered);

                    }
                    draw2(x_axis_cnf1, y_axis_cnf1, y_axis_death, y_axis_rec);

                })
        }

        load_analytics();
        function get_world_data() {
            fetch("https://covid19.mathdro.id/api/").then(function (e) {
                return e.json()
            }).then(function (e) {
                document.getElementById("cnf_world").innerHTML = e.confirmed.value;
                document.getElementById("rec_world").innerHTML = e.recovered.value;
                document.getElementById("ded_world").innerHTML = e.deaths.value;
            })
        }
        get_world_data();


    }
    render() {
        return (
            <div>
                <div className="row" style={{ marginTop: '0.8em', width: '99%' }}>
                    <div className="col s12 m4 l4">
                        <div className="card grey darken-3 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content grey-text">
                                <span className="card-title"><b><span style={{ color: '#eeeeee' }}>Cases:</span> <span
                                    id="cnf_no">loading..</span></b>&nbsp;<i className="tiny material-icons" id="daily_cnf_arrow"></i><span
                                        id="count_diff" style={{ fontSize: '0.8em' }}></span><span
                                            style={{ position: 'absolute', bottom: '2%', right: '5%', fontSize: '0.5em' }}><i>Report upto: <span
                                                id="data_update_date1" style={{ fontSize: '0.9em' }}></span></i></span>
                                </span>
                                <span id="load">Loading...</span>
                                <div className="hide-on-med-and-up show-on-small">
                                    <canvas id="line-chart_cnf" width="100%" height="100%"></canvas>
                                </div>
                                <div className="hide-on-small-only show-on-med-and-up">
                                    <canvas id="line-chart_cnf2" width="100%" height="100%"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 m4 l4">
                        <div className="card grey darken-3 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content grey-text">
                                <span className="card-title"><b><span style={{ color: '#eeeeee' }}>Recovered:</span> <span
                                    id="rec_no">loading..</span></b>&nbsp;<i className="tiny material-icons" id="daily_rec_arrow"></i><span
                                        id="count_diff_rec" style={{ fontSize: '0.8em' }}></span>
                                    <span style={{ position: 'absolute', bottom: '2%', right: '5%', fontSize: '0.5em' }}><i>Report upto: <span
                                        id="data_update_date2" style={{ fontSize: '0.9em' }}></span></i></span>
                                </span>
                                <span id="load_rec">Loading...</span>

                                <div className="hide-on-med-and-up show-on-small">
                                    <canvas id="line-chart_rec" width="100%" height="80%"></canvas>
                                </div>
                                <div className="hide-on-small-only show-on-med-and-up">
                                    <canvas id="line-chart_rec2" width="100%" height="100%"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 m4 l4">
                        <div className="card grey darken-3 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content grey-text">
                                <span className="card-title"><b><span style={{ color: '#eeeeee' }}>Deaths:</span> <span
                                    id="ded_no">loading..</span></b>&nbsp;<i className="tiny material-icons" id="daily_ded_arrow"></i><span
                                        id="count_diff_ded" style={{ fontSize: '0.8em' }}></span>
                                    <span style={{ position: 'absolute', bottom: '2%', right: '5%', fontSize: '0.5em' }}><i>Report upto: <span
                                        id="data_update_date3" style={{ fontSize: '0.9em' }}></span></i></span>
                                </span>
                                <span id="load_ded">Loading...</span>
                                <div className="hide-on-med-and-up show-on-small">
                                    <canvas id="line-chart_ded" width="100%" height="80%"></canvas>
                                </div>
                                <div className="hide-on-small-only show-on-med-and-up">
                                    <canvas id="line-chart_ded2" width="100%" height="100%"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 m12 l12">
                        <div className="card grey darken-3 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content grey-text">
                                <span className="card-title"><b><span style={{ color: '#eeeeee' }}>State-wise Report</span></b>
                                    <span style={{ position: 'absolute', bottom: '2%', right: '5%', fontSize: '0.5em' }}></span>
                                </span>
                                <span id="load_state">Loading...</span>
                                <div className="hide-on-med-and-up show-on-small">
                                    <canvas id="line-chart_dedm" width="100%" height="220%"></canvas>
                                </div>
                                <div className="hide-on-small-only show-on-med-and-up">
                                    <canvas id="line-chart_dedm2" width="100%" height="40%"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ marginTop: '-5.5%' }}>
                    <div className="col s12 m4 l4">
                        <div className="card deep-purple darken-1 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content white-text">
                                <span className="card-title" style={{ marginTop: '-4%' }}>ICMR Report<span className="right"
                                    style={{ fontSize: '0.4em', marginTop: '1%' }}>Updated at 9PM</span></span>
                                <p>Total Samples Tested: <span id="icmr_samples"></span></p>
                                <p>Total Individuals Tested: <span id="icmr_individuals">N/A</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="col s12 m4 l4">
                        <div className="card indigo darken-1 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content white-text">
                                <span className="card-title" style={{ marginTop: '-4%' }}>General Stats</span>
                                <p>Recovery Rate: <span id="recovery_rate" style={{ color: '#b2ebf2' }}></span></p>
                                <p>Death Rate: <span id="death_rate" style={{ color: '#ffcdd2' }}></span></p>
                            </div>
                        </div>
                    </div>
                    <div className="col s12 m4 l4">
                        <div className="card light-blue darken-4 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content white-text">
                                <span className="card-title" style={{ marginTop: '-4%' }}>World Meter <span className="right" style={{ fontSize: '0.4em' }}>Updated every 15 mins</span></span>
                                <p>Confirmed Cases: <span id="cnf_world" style={{ color: '#ffcdd2' }}></span></p>
                                <p>Recovered Cases: <span id="rec_world" style={{ color: '#b2f2fa' }}></span></p><p><span>Death Cases: <span style={{ color: '#fca7b0' }} id="ded_world"></span></span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ marginTop: '-6%' }}>
                    <div className="col s12 m12 l12">
                        <div className="card blue-grey darken-1 z-depth-3" style={{ borderRadius: '10px' }}>
                            <div className="card-content white-text">
                                <span className="card-title">
                                    <center>Comparison of weekly COVID-19 cases with other countries (deprecated)</center>
                                </span>
                                <table className="centered highlight responsive-table" style={{ fontSize: '0.7em' }}>
                                    <thead>
                                        <tr>
                                            <th>Weeks</th>
                                            <th style={{ color: 'rgb(253, 104, 45)' }}>INDIA</th>
                                            <th>USA</th>
                                            <th>FRANCE</th>
                                            <th>ITALY</th>
                                            <th>JAPAN</th>
                                            <th>IRAN</th>
                                            <th>SPAIN</th>
                                            <th>CHINA</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>Week1</td>
                                            <td>3</td>
                                            <td>11</td>
                                            <td>6</td>
                                            <td>3</td>
                                            <td>4</td>
                                            <td>95</td>
                                            <td>1</td>
                                            <td>278</td>
                                        </tr>
                                        <tr>
                                            <td>Week2</td>
                                            <td>3</td>
                                            <td>13</td>
                                            <td>6</td>
                                            <td>3</td>
                                            <td>20</td>
                                            <td>2336</td>
                                            <td>2</td>
                                            <td>2761</td>
                                        </tr>
                                        <tr>
                                            <td>Week3</td>
                                            <td>3</td>
                                            <td>15</td>
                                            <td>11</td>
                                            <td>400</td>
                                            <td>26</td>
                                            <td>8042</td>
                                            <td>2</td>
                                            <td>17238</td>
                                        </tr>
                                        <tr>
                                            <td>Week4</td>
                                            <td>3</td>
                                            <td>53</td>
                                            <td>12</td>
                                            <td>3089</td>
                                            <td>59</td>
                                            <td>16169</td>
                                            <td>25</td>
                                            <td>40235</td>
                                        </tr>
                                        <tr>
                                            <td>Week5</td>
                                            <td>34</td>
                                            <td>108</td>
                                            <td>38</td>
                                            <td>12462</td>
                                            <td>144</td>
                                            <td>24811</td>
                                            <td>257</td>
                                            <td>70635</td>
                                        </tr>
                                        <tr>
                                            <td>Week6</td>
                                            <td>101</td>
                                            <td>696</td>
                                            <td>420</td>
                                            <td>31506</td>
                                            <td>254</td>
                                            <td>35408</td>
                                            <td>2965</td>
                                            <td>77262</td>
                                        </tr>
                                        <tr>
                                            <td>Week7</td>
                                            <td>223</td>
                                            <td>3536</td>
                                            <td>2860</td>
                                            <td>74386</td>
                                            <td>488</td>
                                            <td>55743</td>
                                            <td>13716</td>
                                            <td>80174</td>
                                        </tr>
                                        <tr>
                                            <td>Week8</td>
                                            <td>724</td>
                                            <td>51914</td>
                                            <td>9043</td>
                                            <td>92472</td>
                                            <td>814</td>
                                            <td>62589</td>
                                            <td>78797</td>
                                            <td>80904</td>
                                        </tr>
                                        <tr>
                                            <td>Week9</td>
                                            <td>1112</td>
                                            <td>103321</td>
                                            <td>28786</td>
                                            <td>124632</td>
                                            <td>1089</td>
                                            <td></td>
                                            <td>130759</td>
                                            <td>81077</td>
                                        </tr>
                                        <tr>
                                            <td>Week10</td>
                                            <td>4125</td>
                                            <td>122653</td>
                                            <td>37145</td>
                                            <td>147577</td>
                                            <td>1693</td>
                                            <td></td>
                                            <td>152446</td>
                                            <td>81601</td>
                                        </tr>
                                        <tr>
                                            <td>Week11</td>
                                            <td>7447</td>
                                            <td>273808</td>
                                            <td>67757</td>
                                            <td></td>
                                            <td>3271</td>
                                            <td></td>
                                            <td></td>
                                            <td>82351</td>
                                        </tr>
                                        <tr>
                                            <td>Week12</td>
                                            <td>13387</td>
                                            <td>395030</td>
                                            <td>85351</td>
                                            <td></td>
                                            <td>6238</td>
                                            <td></td>
                                            <td></td>
                                            <td>82930</td>
                                        </tr>
                                        <tr>
                                            <td>Week13</td>
                                            <td>23077</td>
                                            <td>604070</td>
                                            <td>107778</td>
                                            <td></td>
                                            <td>9167</td>
                                            <td></td>
                                            <td></td>
                                            <td>83597</td>
                                        </tr>
                                        <tr>
                                            <td>Week14</td>
                                            <td></td>
                                            <td>604070</td>
                                            <td>107778</td>
                                            <td></td>
                                            <td>9167</td>
                                            <td></td>
                                            <td></td>
                                            <td>83597</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row show-on-small hide-on-med-and-up">
                    <div className="col s12">
                        <center><a href="https://paytm.com/helpinghand/pm-cares-fund" className="waves-effect waves-light btn z-depth-3 pink accent-3" style={{borderRadius: '5px', width: '70%'}}><i className="material-icons right" style={{marginRight: '2%'}}>local_hospital</i>Donate to pm cares fund</a></center>
                    </div>
                </div>
            </div >
        )
    }
}

export default Analytics;
