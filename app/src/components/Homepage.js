import React, {Component} from "react";
import {Form, FormGroup, Input, FormFeedback, FormText, Button} from "reactstrap";
import Loader from 'react-loaders';
import logo from './images/logo.png';
import './styles.css';
import {callLambda, sanitizeText} from "./Utilities";

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
            password: sanitizeText(event.target.value),
        });
    }
    idChanged(event) {
        this.setState({
            snippetID: sanitizeText(event.target.value),
        });
    }

    createSnippet(event) {
        let extThis = this;
        let data = {};
        data["password"] = this.state.password;

        this.setState({
            createLoading: true,
        });

        callLambda(this, this.state.url, "POST", data)
            .then(response => {
                let snipID = response["id"]

                extThis.setState({
                    createLoading: false,
                    snippetID: snipID,
                });

                window.open("snippet#" + extThis.state.snippetID, "_self");

            })
            .catch(error => {
                alert("Unable to create Snippet");
                console.log(error);
            });

        event.preventDefault();
    }

    loadSnippet(event) {
        let extThis = this;
        const exist_url = this.state.url + "/" + this.state.snippetID;

        this.setState({
            loadLoading: true,
        });

        callLambda(this, exist_url, "GET")
            .then(response => {
                extThis.setState({
                    loadLoading: false,
                });

                if (Object.keys(response).length >= 5) {
                    window.open("snippet#" + extThis.state.snippetID, "_self");
                }
                else {
                    alert("Please enter a valid Snippet ID");
                }

            })
            .catch(error => {
                alert("Unable to load Snippet");
                console.log(error);
            });

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