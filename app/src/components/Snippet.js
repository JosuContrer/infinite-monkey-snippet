import React, {Component} from "react";
import ReactDOM from "react-dom";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";


class Snippet extends Component {
    constructor(props) {
        super(props);

        const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets/";
        const snippetID = window.location.hash.substring(1);

        let initURL = url + snippetID;

        this.state = {
            url: initURL,
            snippetID: snippetID,
            password: "",
            languageText: "",
            timestampText: "",
            info: "",
            text: "",

            inputtedPass: "",

        };

        this.infoChanged = this.infoChanged.bind(this);
        this.textChanged = this.textChanged.bind(this);

        this.textSubmit = this.textSubmit.bind(this);
        this.infoSubmit = this.infoSubmit.bind(this);

        this.editInfo = this.editInfo.bind(this);
        this.deleteSnippet = this.deleteSnippet.bind(this);
    }

    componentDidMount() {
        let extThis = this;
        console.log(this.state.url);
        let xhr = new XMLHttpRequest();
        xhr.open("GET", this.state.url, true);

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

                    let timestampNum = jsonResponse["timestamp"];
                    let unixDate = new Date(timestampNum);

                    extThis.setState({
                        password: jsonResponse["password"],
                        languageText: jsonResponse["language"],
                        timestampText: unixDate.toLocaleString(),
                        info: jsonResponse["info"],
                        text: jsonResponse["text"],
                    });

                }
                else if(xhr.status === 400){
                    alert("Unable to get Snippet");
                }
            }
        }
    }

    static textToDB(textURL, fieldName, snipText, password="") {
        const backspace = String.fromCharCode(8);
        const formfeed = String.fromCharCode(12);
        const newline = String.fromCharCode(10);
        const carriage = String.fromCharCode(13);
        const tab = String.fromCharCode(9);
        const quote = String.fromCharCode(34);
        const backslash = String.fromCharCode(92);

        let cursedArray = [backslash, backspace, formfeed, newline, carriage, tab, quote];
        let blessedArray = ['\\', '\\b', '\\f', '\\n', '\\r', '\\t', '\\"']

        snipText = snipText.replace(/[\x5c\x08\x0c\x0a\x0d\x09\x22]/g, function(x) {
            let i = cursedArray.indexOf(x);

            return blessedArray[i];
        });

        let data = {};

        data[fieldName] = snipText;

        if (fieldName === "info") {
            data["password"] = password;
        }

        let json = JSON.stringify(data);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", textURL, true);

        console.log("JSON: " + json);
        console.log(textURL);

        xhr.setRequestHeader("Content-Type", "application/json");

        //send data as JSON
        xhr.send(json);

        // Process the response an update GUI
        xhr.onloadend = function() {
            console.log(xhr);
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    console.log("XHR: " + xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    console.log(jsonResponse);
                }
                else if(xhr.status === 404){
                    alert("Unable to update" + fieldName);
                }
            } else {
                console.log("Didn't processes");
            }
        }
    }

    deleteSnippet(event) {
        let textURL = this.state.url + "/deleteSnippet"

        let data = {};

        data["password"] = this.state.inputtedPass;
        let json = JSON.stringify(data);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", textURL, true);

        console.log("JSON: " + json);
        console.log(textURL);

        xhr.setRequestHeader("Content-Type", "application/json");

        //send data as JSON
        xhr.send(json);

        // Process the response an update GUI
        xhr.onloadend = function() {
            console.log(xhr);
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    console.log("XHR: " + xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    console.log(jsonResponse);

                    window.open("", "_self");
                }
                else if(xhr.status === 404){
                    alert("Unable to delete Snippet");
                }
            } else {
                console.log("Didn't processes");
            }
        }

        event.preventDefault();
    }

    editInfo(event) {
        const promptResp = prompt("Please Enter Snippet Password:");

        let extThis = this;

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
        Snippet.textToDB(this.state.url + "/updateInfo", "info", this.state.info, this.state.inputtedPass);
    }

    textSubmit(event) {
        Snippet.textToDB(this.state.url + "/updateText", "text", this.state.text);
    }

    render() {
        const reactStyle = {
          aceStyle: {
              borderRadius: "10px",
              padding: "0.5em",
          }
        };

        return (
            <div id="snippetpage">
                <div className="column">
                    <div className="snippetsection">
                        <div className="header">
                            <h1>Infinite Monkey Snippet</h1>
                            <h2 id="snippetId">Snippet ID: {this.state.snippetID}</h2>
                        </div>
                    </div>
                    <div className="snippetsection">
                        <div id="infoDiv" className="leftCol">
                            <h5>Info:</h5>
                            <br/>
                            <form id="infoForm">
                                <p id="infoArea">{this.state.info}</p>
                            </form>
                        </div>
                        <div id="langDiv" className="rightCol">
                            <div id="accessory">
                                <h5 id="languageText">Language: {this.state.languageText}</h5>
                                <h5 id="timestampText">Timestamp: {this.state.timestampText}</h5>
                            </div>
                            <button id="infoButton" type="button" onClick={this.editInfo}>Edit Info</button>
                        </div>
                    </div>
                    <div className="snippetsection">
                        <div id="textDiv" className="leftCol">
                            <h5>Text:</h5>
                            <br/>
                            <AceEditor
                                placeholder=""
                                mode={"java"}
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
                                    enableBasicAutocompletion: false,
                                    enableLiveAutocompletion: false,
                                    enableSnippets: false,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}/>
                        </div>
                        <div id="commentDiv" className="rightCol">
                            <h5>Comments:</h5>
                            <br/>
                            <div id="commentArea"></div>
                            <button type="button" onClick={this.textSubmit}>Save Text</button>
                        </div>
                    </div>
                    <div className="snippetsection" id="contactDiv">
                        <h5>Contact Us</h5>
                        <p>some text and links (github, linkedin, instagram, etc.)</p>
                    </div>
            </div>
            </div>
        );
    }
}

export default Snippet;