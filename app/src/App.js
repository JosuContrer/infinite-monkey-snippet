import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Homepage from "./components/Homepage";
import Snippet from "./components/Snippet";
import Error from "./components/Error";
import Admin from "./components/Admin";

import 'loaders.css/src/animations/pacman.scss';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/" component={Homepage} exact/>
                        <Route path="/snippet" component={Snippet} exact/>
                        <Route path="/admin" component={Admin} exact/>
                        <Route component={Error}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
