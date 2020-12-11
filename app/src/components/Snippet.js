import React, {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram} from '@fortawesome/free-brands-svg-icons'
import {faSync} from "@fortawesome/free-solid-svg-icons";

import AceEditor from "react-ace";
import DiffMatchPatch from "diff-match-patch";

import NavBar from './NavBar';
import LangDropdown from './LangDropDown';
import CommentList from './CommentList';
import {callLambda, sanitizeText} from "./Utilities";

// import 'ace-builds/webpack-resolver';
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import reportWebVitals from "../reportWebVitals";

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
            ogText: "",

            inputtedPass: "",
            creatorMode: false,

            timerInterval: 9000,

            isLoading: false,
            lastLoad: 0,
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

        this.setState({
            isLoading: true,
        });

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
                        ogText: response["text"],

                        isLoading: false,
                    });
                }
                else {
                    alert("Loaded an invalid Snippet - Returning to Homepage")
                    window.open("/", "_self");
                }
            })
            .catch(error => {
                console.log(error);

                this.setState({
                    isLoading: false,
                });

            });
        
        setInterval(() => {
            this.timerUpdate();
        }, extThis.state.timerInterval);

        setInterval(() => {
            this.setState({
                lastLoad: this.state.lastLoad + 1,
            });
        }, 1000)
    }

    timerUpdate() {
        let extThis = this;

        callLambda(extThis, extThis.state.url, "GET")
            .then(response => {
                if (Object.keys(response).length >= 5) {
                    if (!extThis.state.creatorMode) {
                        extThis.setState({
                            languageText: response["language"],
                            info: response["info"],
                        });
                    }

                    let pulledText = response["text"];

                    let dmp = new DiffMatchPatch();
                    let diff1 = dmp.diff_main(extThis.state.ogText, pulledText);
                    let diff2 = dmp.diff_main(extThis.state.ogText, extThis.state.text);
                    let patches1 = dmp.patch_make(extThis.state.ogText, diff1);
                    let patches2 = dmp.patch_make(extThis.state.ogText, diff2);
                    let newText = dmp.patch_apply(patches1, extThis.state.ogText)[0];
                    newText = dmp.patch_apply(patches2, newText)[0];

                    extThis.setState({
                        text: newText,
                        ogText: newText,

                        lastLoad: 0,
                    }, () => {
                        let data = {};
                        data["text"] = sanitizeText(newText);

                        callLambda(extThis, extThis.state.url + "/updateText", "POST", data)
                            .catch(error => {
                                console.log(error);
                            });
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

        this.setState({
            isLoading: true,
        });

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

                extThis.setState({
                    isLoading: false,
                });
            })
            .catch(error => {
                console.log(error);

                extThis.setState({
                    isLoading: false,
                });
            });
    }

    textSubmit(event) {
        let extThis = this;
        let textText = sanitizeText(this.state.text);

        this.setState({
            isLoading: false,
        });

        let data = {};
        data["text"] = textText;
        callLambda(this, this.state.url + "/updateText", "POST", data)
            .then(response => {
                extThis.setState({
                    isLoading: false,
                });
            })
            .catch(error => {
                console.log(error);

                extThis.setState({
                    isLoading: false,
                });
            });
    }

    deleteSnippet(event) {
        let extThis = this;
        let delURL = this.state.url + "/deleteSnippet"
        const promptResp = prompt("Would you like to delete the Snippet:\n\nID: " + this.state.snippetID
            + "\n\nEnter 'delete' to confirm");

        if (promptResp != null && promptResp.includes("delete")) {

            this.setState({
                isLoading: true,
            });

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

                    extThis.setState({
                        isLoading: false,
                    });
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
              minHeight: "635px",
          }
        }; 

        return (
            <>
            <NavBar loading={this.state.isLoading}/>
            <div id="snippetpage">
                <div className="column">
                    <div className="snippetsection">
                        <div className="titleContainerBar">
                            <h2 className="idTitle" id="snippetId">Snippet ID: {this.state.snippetID}</h2>
                            <h2 className="timeTitle" id="timestampText">Created: {this.state.timestampText}</h2>
                            <div className="saveDiv">
                                <h2 className="timeTitle">Last Updated: {this.state.lastLoad} seconds ago</h2>
                                <button id="syncButt" onClick={this.timerUpdate}><FontAwesomeIcon  icon={faSync} /></button>
                            </div>
                        </div>
                    </div>
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
                        <div className="break"></div>
                        <div id="textDiv" className="leftCol">
                            <h2>Snippet Text:</h2>
                            <br/>
                            <AceEditor
                                ref="mainEditor"
                                placeholder=""
                                mode={this.state.languageText}
                                width={"100%"}
                                theme={"monokai"}
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
                            <h2>Comments:</h2>
                            <br/>
                            <CommentList
                                snipID={this.state.snippetID}
                                snipPassword={this.state.inputtedPass}
                                creatorMode={this.state.creatorMode}
                                timerInterval={this.state.timerInterval}
                            />
                        </div>
                    </div>
                    <div className="snippetsection" id="contactDiv">
                        <h3 className="contactTitle">Contact Us</h3>
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