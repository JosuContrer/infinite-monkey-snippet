import React, {Component} from "react";
import {Form, FormGroup, Input, FormFeedback, FormText, Button} from "reactstrap";
import Loader from 'react-loaders';
import logo from './images/logo.png';
import './styles.css';

class Homepage extends Component {
    constructor(props) {
        super(props);

        const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets";

        this.state = {
            url: url,
            password: "",
            snippetID: "",

            createLoading: false,
            loadLoading: false,
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

        this.setState({
            createLoading: true,
        });

        // Process the response an update GUI
        xhr.onloadend = function() {
            console.log(xhr);
            if(xhr.readyState === XMLHttpRequest.DONE){
                extThis.setState({
                    createLoading: false,
                });

                if(xhr.status === 200){
                    console.log("XHR: " + xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    let snipID = jsonResponse["id"]

                    extThis.setState({
                        snippetID: snipID,
                    });
                    window.open("snippet#" + extThis.state.snippetID, "_self");
                    //window.location.href = window.location.href + "snippet#" + extThis.state.snippetID;

                }
                else if(xhr.status === 400 || xhr.status === 0){
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

        this.setState({
            loadLoading: true,
        });

        // Process the response an update GUI
        xhr.onloadend = function() {
            console.log(xhr);
            if(xhr.readyState === XMLHttpRequest.DONE){
                extThis.setState({
                    loadLoading: false,
                });

                if(xhr.status === 200){
                    console.log("XHR: " + xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    console.log(jsonResponse);

                    if (Object.keys(jsonResponse).length === 6) {
                        window.open("snippet#" + extThis.state.snippetID, "_self");
                    }
                    else {
                        alert("Please enter a valid Snippet ID");
                    }

                }else if(xhr.status === 400 || xhr.status === 0){
                    alert("Please enter a valid Snippet ID");
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
            <div id="homepage" className="homepage">
                    <div className="l-column">
                        <div className="homepage-title-container">
                            <h1>Infinite Monkey Snippet</h1>
                        </div>
                        <div className="homepage-title-container">
                            <img className="main_logo" src={logo} alt="Logo"/>
                        </div>
                    </div>
                    <div className="r-column">
                        <ul>
                        <Form className="input-form">
                            <FormGroup className="input_group">
                                <h4>Create a Snippet</h4>
                                <Input valid  type="text" value={this.state.password} onChange={this.passChanged} />
                                <FormFeedback  className="formF">Good Password My Dude!</FormFeedback>
                                <FormText className="formF">Note: Password is Optional</FormText>
                                { this.state.createLoading
                                    ? <div className="loaderDiv">
                                        <Loader type={"pacman"} />
                                    </div>
                                    : <Button outline color="primary" onClick={this.createSnippet}>Create Snippet</Button>
                                }
                            </FormGroup>
                            
                            <FormGroup className="input_group">
                                <h4>Enter Snippet ID</h4>
                                <Input type="text" value={this.state.snippetID} onChange={this.idChanged}/>
                                <FormFeedback valid className="formF">Nice Snippet ID</FormFeedback>
                                <br></br>
                                { this.state.loadLoading
                                    ? <div className="loaderDiv">
                                        <Loader type={"pacman"} />
                                    </div>
                                    : <Button outline color="primary" onClick={this.loadSnippet}>Enter</Button>
                                }
                            </FormGroup>
                        </Form>
                        </ul>
                    </div>
               
            </div>
          
        );
    }
}

export default Homepage;