import React, {Component} from "react";
import {Form, FormGroup, Label, Input, FormFeedback, FormText,
        Col, Row, Container,
        Jumbotron, Button
} from "reactstrap"
import logo from './images/logo.png'

import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

class Homepage extends Component {
    constructor(props) {
        super(props);

        const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets";

        this.state = {
            url: url,
            password: "",
            snippetID: ""
        };

        this.passChanged = this.passChanged.bind(this);
        this.idChanged = this.idChanged.bind(this);

        this.createSnippet = this.createSnippet.bind(this);
        this.loadSnippet = this.loadSnippet.bind(this);
    }

    passChanged(event) {
        this.setState({
            password: event.target.value,
        });
    }
    idChanged(event) {
        this.setState({
            snippetID: event.target.value,
        });
    }

    createSnippet(event) {
        let extThis = this;
        let data = {};

        data["password"] = this.state.password;
        let json = JSON.stringify(data);
        console.log("JSON: " + json);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.state.url, true);

        //send data as JSON
        xhr.send(json);

        // Process the response an update GUI
        xhr.onloadend = function() {
            console.log(xhr);
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    console.log("XHR: " + xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    let snipID = jsonResponse["body"]["result"]

                    extThis.setState({
                        snippetID: snipID,
                    });
                    window.open("snippet#" + extThis.state.snippetID, "_self");
                    //window.location.href = window.location.href + "snippet#" + extThis.state.snippetID;

                }
                else if(xhr.status === 400){
                    alert("Unable to create Snippet");

                }
            } else {
                alert("What happened?")
            }
        }
        event.preventDefault();
    }

    loadSnippet(event) {
        let extThis = this;
        const exist_url = this.state.url + "/" + this.state.snippetID;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", exist_url, true);

        //send data as JSON
        xhr.send();

        // Process the response an update GUI
        xhr.onloadend = function() {
            console.log(xhr);
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    console.log("XHR: " + xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    console.log(jsonResponse);

                    if (Object.keys(jsonResponse).length === 6){
                        window.open("snippet#" + extThis.state.snippetID, "_self");
                    }

                }else if(xhr.status === 400){
                    alert("Unable to create Snippet");
                }
            } else {
                alert("What happened?")
            }
        }

        event.preventDefault();
    }

    render() {
        return (
            // className="block-example border border-dark"
            <div class="container" id="homepage">
               
                    <div class="column">
                        <h1>Infinite Monkey Snippet</h1>
                        <img className="main_logo" src={logo} alt="Logo"/>
                    </div>
                    <div class="column">
                        <ul>
                        <Form>
                            <FormGroup className="input_group">
                                <h4>Create a Snippet</h4>
                                <Input valid  type="text" value={this.state.password} onChange={this.passChanged} />
                                <FormFeedback  className="formF">Good Password My Dude!</FormFeedback>
                                <FormText className="formF">Note: Password is Optional</FormText>
                                <Button outline color="primary" onClick={this.createSnippet}>Create Snippet</Button>
                            </FormGroup>
                            
                            <FormGroup className="input_group">
                                <h4>Enter Snippet ID</h4>
                                <Input type="text" value={this.state.snippetID} onChange={this.idChanged}/>
                                <FormFeedback valid className="formF">Nice Snippet ID</FormFeedback>
                                <br></br>
                                <Button outline color="primary" onClick={this.loadSnippet}>Enter</Button>
                            </FormGroup>
                        </Form>
                        </ul>
                    </div>
               
            </div>
          
        );
    }
}

export default Homepage;