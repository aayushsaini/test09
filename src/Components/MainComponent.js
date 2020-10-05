import React, { Component } from 'react';
import Navbar from "./Navbar";
import Home from "./Home";
import Analyitcs from "./AnalyticsComponent";
import About from "./AboutComponent";
import Team from "./TeamComponent";
import Footer from "./FooterComponent";
import { Switch, Route, Redirect } from 'react-router-dom';

export class MainComponent extends Component {

    render() {
        return (
            <div>
                <Navbar />
                <Switch>
                    <Route path="/home" component={Home} />
                    <Route exact path="/analytics" component={Analyitcs} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/team" component={Team} />
                    <Redirect to="/home" />
                </Switch>
                <Footer />
            </div>
        );
    }
}

export default MainComponent;
