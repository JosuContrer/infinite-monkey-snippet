import React, {Component, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram} from '@fortawesome/free-brands-svg-icons'
import { Card, CardTitle, Button} from 'reactstrap';

import AceEditor from "react-ace";
import NavBar from './NavBar';
import LangDropdown from './LangDropDown';
import CommentList from './CommentList';
import { callLambda, sanitizeText } from "./Utilities";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";

/** GLOBAL URL **/
const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets/";

/* ------------------ Main Class ----------------- */
class Snippet extends Component {
    constructor(props) {
        super(props);

        const snippetID = window.location.hash.substring(1);

        let initURL = url + snippetID;

        this.state = {
            url: initURL,
            snippetID: snippetID,
            password: "",
            languageText: "java",
            timestampText: "",
            info: "",
            text: "",

            inputtedPass: "",
            comments: [],

            startSelection: 0,
            endSelection: 0,
        };

        this.setLanguage = this.setLanguage.bind(this);

        this.infoChanged = this.infoChanged.bind(this);
        this.textChanged = this.textChanged.bind(this);

        this.textSubmit = this.textSubmit.bind(this);
        this.infoSubmit = this.infoSubmit.bind(this);

        this.editInfo = this.editInfo.bind(this);
        this.deleteSnippet = this.deleteSnippet.bind(this);
    }

    componentDidMount() {

        // GET SNIPPET DATA
        callLambda(this, this.state.url, "GET")
            .then(response => {
                let timestampNum = response["timestamp"];
                let unixDate = new Date(timestampNum);

                this.setState({
                    password: response["password"],
                    languageText: response["language"].toString(),
                    timestampText: unixDate.toLocaleString(),
                    info: response["info"],
                    text: response["text"],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    editInfo(event) {
        const promptResp = prompt("Please Enter Snippet Password:");

        let extThis = this;

        // TODO this is bad bad should be done in the backend
        if (promptResp === this.state.password) {
            this.setState({
                inputtedPass: promptResp,
            });

            let infoTextArea = document.createElement("textarea")
            infoTextArea.id = "infoArea";
            infoTextArea.value = this.state.info;
            infoTextArea.onchange = this.infoChanged;

            let buttDiv = document.createElement("div");
            buttDiv.id = "buttDiv";

            let infoButton = document.createElement("button");
            infoButton.id = "infoButton"
            infoButton.type = "button"
            infoButton.onclick = this.infoSubmit;
            infoButton.innerText = "Save Info";

            let deleteButton = document.createElement("button");
            deleteButton.id = "deleteButton"
            deleteButton.type = "button"
            deleteButton.onclick = extThis.deleteSnippet;
            deleteButton.innerText = "Delete Snippet";

            buttDiv.appendChild(infoButton);
            buttDiv.appendChild(deleteButton);

            document.getElementById("infoForm").replaceChild(infoTextArea, document.getElementById("infoArea"));
            document.getElementById("langDiv").replaceChild(buttDiv, document.getElementById("infoButton"));
        }
        else {
            alert("The password entered was incorrect.")

            event.preventDefault();
        }
    }

    infoChanged(event) {
        this.setState({
            info: event.target.value,
        });
    }

    textChanged(newText) {
        this.setState({
            text: newText,
        });
    }

    infoSubmit(event) {
        let infoText = sanitizeText(this.state.info);

        let data = {};
        data["info"] = infoText;
        callLambda(this, this.state.url + "/updateInfo", "POST",  data, this.state.inputtedPass)
            .catch(error => {
                console.log(error);
            });
    }

    textSubmit(event) {
        let textText = sanitizeText(this.state.text);

        let data = {};
        data["text"] = textText;
        callLambda(this, this.state.url + "/updateText", "POST", data)
            .catch(error => {
                console.log(error);
            });
    }

    deleteSnippet(event) {
        let delURL = this.state.url + "/deleteSnippet"
        callLambda(this, delURL, "POST", {}, this.state.inputtedPass)
            .then(response => {
                if (response !== null) {
                    window.open("/", "_self");
                }
            })
            .catch(error => {
                console.log(error);
            });

        event.preventDefault();
    }

    // Set language from dropdown select
    setLanguage(event){
        let lang = event.currentTarget.textContent;
        console.log("Language selected:" + lang);
        this.setState({
            languageText : lang,
        });
    }

    render() {
        const reactStyle = {
          aceStyle: {
              borderRadius: "10px",
              padding: "0.5em",
          }
        }; 

        return (
            <>
            <NavBar/>
            <div id="snippetpage">
                <div className="column">
                    <div className="snippetsection">
                        <div id="infoDiv" className="leftCol">
                            <h2 className="infoTitle">Snippet Information:</h2>
                            <br/>
                            <form id="infoForm">
                                <p id="infoArea">{this.state.info}</p>
                            </form>
                        </div>
                        <div id="langDiv" className="rightCol">
                            <div id="accessory">
                                <h5 id="languageText">Language: {this.state.languageText}</h5>
                           </div>
                            <button id="infoButton" type="button" onClick={this.editInfo}>Edit Info</button>
                        </div>
                    </div>
                    <div className="snippetsection">
                        <div className="flexContainerBar">
                            <div className="equalCol">
                                <LangDropdown func={this.setLanguage} />
                            </div>
                            <div className="equalCol">
                                <h3 id="snippetId">Snippet ID: {this.state.snippetID}</h3>
                            </div>
                            <div className="equalCol">
                                <h3 className="timeTitle" id="timestampText">Created: {this.state.timestampText}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="snippetsection">
                        <div className="break"></div>
                        <div id="textDiv" className="leftCol">
                            <h5 className="commentsTitle">Text</h5>
                            <br/>
                            <AceEditor
                                placeholder=""
                                mode={this.state.languageText}
                                width={"100%"}
                                theme={"monokai"}
                                height={"600px"}
                                onChange={this.textChanged}
                                fontSize={14}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                value={this.state.text}
                                style={reactStyle.aceStyle}
                                setOptions={{
                                    // enableBasicAutocompletion: false,
                                    // enableLiveAutocompletion: false,
                                    // enableSnippets: false,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}/>
                        </div>
                        <div id="commentDiv" className="rightCol">
                            <h5 className="commentsTitle">Comments</h5>
                            <br/>
                            <CommentList snipID={this.state.snippetID}/>
                            <button type="button" onClick={this.textSubmit}>Save Text</button>
                        </div>
                    </div>
                    <div className="snippetsection" id="contactDiv">
                        <h2 className="contactTitle">Contact Us</h2>
                        <div className="flexContainerBar">
                            <a className="iconStyled" href="https://github.com/JosuContrer/infinite-monkey-snippet">
                                <FontAwesomeIcon  icon={faGithub} />
                            </a>
                            <i className="iconStyled">
                                <FontAwesomeIcon icon={faLinkedin} />
                                <ul className="linkedInContent">
                                    <a href="https://www.linkedin.com/in/josue-contreras-127238141/">Josue</a><br></br>
                                    <a href="https://www.linkedin.com/in/nicholas-delli-carpini-4a9400171/">Nick</a><br></br>
                                    <a href="https://www.linkedin.com/in/william-c-32a424108/">Will</a><br></br>
                                </ul>
                            </i>
                            <i className="iconStyled">
                                <FontAwesomeIcon  icon={faInstagram} />
                                <ul className="linkedInContent">
                                    <a href="https://www.instagram.com/contrerasjosu/">Josue</a><br></br>
                                    <a href="">Nick</a><br></br>
                                    <a href="">Will</a><br></br>
                                </ul>
                            </i>
                        </div>
                        <p className="contactInfo">Authors: Josue C, Nick D, Will C</p>
                    </div>
            </div>
            </div>
            </>
        );
    }
}

export default Snippet;