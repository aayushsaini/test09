import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export class About extends Component {
    render() {
        return (
            <div>
                <div className="row container" style={{ width: '95%' }}>
                    <div className="card grey darken-3" style={{ borderRadius: '10px' }}>
                        <div className="card-content grey-text">
                            <span className="card-title"><i className="material-icons left tiny" style={{ color: 'teal' }}>brightness_1</i> <span
                                style={{ color: "rgb(216, 216, 216)" }}>About CovidNearMe</span></span>
                            <p>CovidNearMe is a non-profit website that provides the users the number of Covid-19 patient in their region.
                            Unlike other websites which are more statics-oriented, this website is build-up from the ground by keeping the
          user as our no.1 priority.</p>
                            <br />
                            <p>Powering this website up is an amazing team of students that work constantly inorder to keep the website's
          data upto date.</p>
                            <br />
                            <span className="card-title"><i className="material-icons left tiny" style={{ color: 'teal' }}>brightness_1</i> <span
                                style={{ color: "rgb(216, 216, 216)" }}>How does this website works?</span></span>
                            <p>This website uses the location of user to search the district and the state(region) of the user. Then the
          data for that particular district and state is retrieved and presented to the user.<br />Along with that the
                                website displays the visual data of the registered patients on a map that helps to user to get the idea of no.
          of cases/potenial cases around him/her.</p><br />
                            <span className="card-title"><i className="material-icons left tiny" style={{ color: 'teal' }}>brightness_1</i> <span
                                style={{ color: "rgb(216, 216, 216)" }}>How frequently the data is updated?</span></span>
                            <p>The data is updated every hour is verified by our team members and volunteers and the visual
          data is updated twice a day</p><br />
                            <span className="card-title"><i className="material-icons left tiny" style={{ color: 'teal' }}>brightness_1</i><span
                                style={{ color: "rgb(216, 216, 216)" }}>Is this official? What are the Sources?</span> </span>
                            <p>No, this is not. This is a community project.</p>
                            <p>The sources include all the major news outlet, govt. websites, crowdsourced database and the offical handles. <br />-<i> By the community, for the community!</i>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ marginBottom: '-5px' }}>
                    <div className="row hide-on-small-only show-on-med-and-up">
                        <div className="col m6 l6">
                            <center><NavLink to="/analytics" className="waves-effect waves-light btn z-depth-3 deep-purple darken-2"
                                style={{ borderRadius: '5px', width: '70%' }}><i className="material-icons right"
                                    style={{ marginRight: '2%' }}>timeline</i>go to analytics</NavLink></center>
                        </div>
                        <div className="col m6 l6">
                            <center><a href="https://paytm.com/helpinghand/pm-cares-fund"
                                className="waves-effect waves-light btn z-depth-3 pink" style={{ borderRadius: '5px', width: '70%' }}><i
                                    className="material-icons right" style={{ marginRight: '2%' }}>local_hospital</i>Donate to pm cares
                    fund</a></center>
                        </div>
                    </div>
                    <div className="row show-on-small hide-on-med-and-up">
                        <div className="col s12">
                            <center><NavLink to="/analytics" className="waves-effect waves-light btn z-depth-3 deep-purple darken-2"
                                style={{ borderRadius: '5px', width: '70%' }}><i className="material-icons right"
                                    style={{ marginRight: '2%' }}>timeline</i>go to analytics</NavLink></center>
                        </div>
                    </div>
                    <div className="row show-on-small hide-on-med-and-up">
                        <div className="col s12">
                            <center><a href="https://paytm.com/helpinghand/pm-cares-fund"
                                className="waves-effect waves-light btn z-depth-3 pink" style={{ borderRadius: '5px', width: '70%' }}><i
                                    className="material-icons right" style={{ marginRight: '2%' }}>local_hospital</i>Donate to pm cares
                    fund</a></center>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default About;
