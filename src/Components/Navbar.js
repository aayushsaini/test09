import React, { Component } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import { NavLink } from 'react-router-dom';

export class Navbar extends Component {
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.sidenav');
            var instances = M.Sidenav.init(elems, {
                edge: "right",
                draggable: true
            });
        });
    }
    render() {
        return (
            <div>
                <nav className="grey darken-4 z-depth-3">
                    <div className="nav-wrapper">
                        <NavLink to="/home"><img src={require("../assets/logox.png")} alt="Covidnearme" className="responsive-img brand-logo hide-on-med-and-down show-on-large left" width='15%' style={{ marginTop: '10px', paddingLeft: '10px' }} /></NavLink>
                        <NavLink to="/home" className="left brand-logo hide-on-large-only hide-on-small-only show-on-med"><img src={require("../assets/logox.png")} alt="Covidnearme" className="responsive-img" width='30%' style={{ marginTop: '8px' }} /></NavLink>
                        <NavLink to="/home" className="left brand-logo hide-on-med-and-up show-on-small"><img src={require("../assets/logox.png")} alt="Covidnearme" className="responsive-img" width='45%' style={{ display: 'flex', alignContent: 'center', alignItems: 'center', marginTop: '10px' }} /></NavLink>
                        <a href="https://covidnearme.in" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
                        <ul className="right hide-on-med-and-down teal lighten-2">
                            <li><NavLink to="/analytics">Analytics</NavLink></li>
                            <li><NavLink to="/about">About</NavLink></li>
                            <li><NavLink to="/team">Our Team</NavLink></li>
                        </ul>
                    </div>
                </nav>

                <ul className="sidenav grey darken-4" id="mobile-demo">
                    <li><NavLink to="/analytics" style={{color:'#009688'}}>Analytics</NavLink></li>
                    <li><NavLink to="/about" style={{color:'#009688'}}>About</NavLink></li>
                    <li><NavLink to="/team" style={{color:'#009688'}}>Our Team</NavLink></li>
                </ul>
            </div>
        )
    }
}

export default Navbar
