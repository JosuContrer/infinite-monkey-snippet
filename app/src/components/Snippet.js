import React, {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram} from '@fortawesome/free-brands-svg-icons'

import AceEditor from "react-ace";

import NavBar from './NavBar';
import LangDropdown from './LangDropDown';
import CommentList from './CommentList';
import {callLambda, sanitizeText} from "./Utilities";

// import 'ace-builds/webpack-resolver';
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

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
            languageText: "",
            timestampText: "",
            info: "",
            text: "",

            inputtedPass: "",
            creatorMode: false,

            timerInterval: 5000,

        };

        this.setLanguage = this.setLanguage.bind(this);
        this.timerUpdate = this.timerUpdate.bind(this);

        this.infoChanged = this.infoChanged.bind(this);
        this.textChanged = this.textChanged.bind(this);

        this.textSubmit = this.textSubmit.bind(this);
        this.infoSubmit = this.infoSubmit.bind(this);

        this.editInfo = this.editInfo.bind(this);
        this.deleteSnippet = this.deleteSnippet.bind(this);
    }

    componentDidMount() {
        let extThis = this;

        // GET SNIPPET DATA
        callLambda(this, this.state.url, "GET")
            .then(response => {
                if (Object.keys(response).length >= 5) {
                    let timestampNum = response["timestamp"];
                    let unixDate = new Date(timestampNum);

                    this.setState({
                        languageText: response["language"],
                        timestampText: unixDate.toLocaleString(),
                        info: response["info"],
                        text: response["text"],
                    });
                }
                else {
                    alert("Loaded an invalid Snippet - Returning to Homepage")
                    window.open("/", "_self");
                }
            })
            .catch(error => {
                console.log(error);
            });
        
        setInterval(() => {
            this.timerUpdate();
        }, extThis.state.timerInterval);
    }

    timerUpdate() {
        const lambda = () => {
            callLambda(this, this.state.url + "/updateText", "POST", {text: sanitizeText(this.state.text)})
            .then(response => {
                callLambda(this, this.state.url, "GET")
                    .then(response => {
                        if (Object.keys(response).length >= 5) {
                            let timestampNum = response["timestamp"];
                            let unixDate = new Date(timestampNum);

                            this.setState({
                                languageText: response["language"],
                                timestampText: unixDate.toLocaleString(),
                                info: response["info"],
                                text: response["text"],
                            });
                        }
                        else {
                            alert("This Snippet has been Deleted - Returning to Homepage")
                            window.open("/", "_self");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })

            .catch(error => {
                console.log(error);
            })
        };

        if (this.state.creatorMode) {
            callLambda(this, this.state.url + "/updateInfo", "POST",
                {
                    info: sanitizeText(this.state.info),
                    lang: this.state.languageText,
                    password: this.state.inputtedPass,
                })
                .then(response => {
                    if (response["statusCode"] === 200) {
                        lambda();
                    }
                    else {
                        alert("rut roh raggy");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else {
            lambda();
        }
    }

    editInfo(event) {
        const promptResp = prompt("Please Enter Snippet Password:");

        let extThis = this;

        this.setState({
            inputtedPass: promptResp,
        }, () => {
            extThis.infoSubmit(null);
        });
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
        let extThis = this;
        let infoText = sanitizeText(this.state.info);

        let data = {};
        data["info"] = infoText;
        data["lang"] = this.state.languageText;
        data["password"] = this.state.inputtedPass;
        callLambda(this, this.state.url + "/updateInfo", "POST",  data)
            .then(response => {
                if (response["statusCode"] === 405) {
                    alert("Incorrect Password")
                }
                else if (response["statusCode"] === 200) {
                    extThis.setState({
                        creatorMode: true,
                    });
                }
            })
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
        const promptResp = prompt("Would you like to delete the Snippet:\n\nID: " + this.state.snippetID
            + "\n\nEnter 'delete' to confirm");

        if (promptResp != null && promptResp.includes("delete")) {

            let data = {};
            data["password"] = this.state.inputtedPass;
            callLambda(this, delURL, "POST", data)
                .then(response => {
                    if (response !== null) {
                        window.open("/", "_self");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else {
            alert("Please input 'delete' to delete Snippet")
        }

        event.preventDefault();
    }

    // Set language from dropdown select
    setLanguage(event){
        console.log("Language selected:" + event["value"]);
        this.setState({
            languageText : event["value"],
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
                                {this.state.creatorMode ?
                                    <textarea id="infoArea" onChange={this.infoChanged}>{this.state.info}</textarea>
                                    : <p id="infoArea">{this.state.info}</p>
                                }
                            </form>
                        </div>
                        <div id="langDiv" className="rightCol">
                            <div className="langDropDown">
                                <h3>Language: </h3>
                                <div id="langSelector">
                                    <LangDropdown func={this.setLanguage} lang={this.state.languageText} disabled={this.state.creatorMode}/>
                                </div>
                            </div>
                            {this.state.creatorMode ?
                                <div id="buttDiv">
                                    <button type="button" className="monkeyButton" id="infoButton" onClick={this.infoSubmit}>Save Info</button>
                                    <button type="button" className="monkeyButton" id="deleteButton" onClick={this.deleteSnippet}>Delete Snippet</button>
                                </div>
                            : <button className="monkeyButton" id="infoButton" type="button" onClick={this.editInfo}>Edit Info</button>}
                        </div>
                    </div>
                    <div className="snippetsection">
                        <div className="flexContainerBar">
                            <div className="equalCol">
                                <h3 className="idTitle" id="snippetId">Snippet ID: {this.state.snippetID}</h3>
                            </div>
                            <div className="equalCol">
                                <h3 className="timeTitle" id="timestampText">Created: {this.state.timestampText}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="snippetsection">
                        <div className="break"></div>
                        <div id="textDiv" className="leftCol">
                            <AceEditor
                                ref="mainEditor"
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
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}/>
                        </div>
                        <div id="commentDiv" className="rightCol">
                            <h5 className="commentsTitle">Comments</h5>
                            <br/>
                            <CommentList
                                snipID={this.state.snippetID}
                                snipPassword={this.state.inputtedPass}
                                creatorMode={this.state.creatorMode}
                            />
                            <button className="monkeyButton" type="button" onClick={this.textSubmit}>Save Text</button>
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