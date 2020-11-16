import React, {Component, useState} from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram} from '@fortawesome/free-brands-svg-icons'
import { Card, CardTitle, CardText, Button} from 'reactstrap';

import AceEditor from "react-ace";
import NavBar from './NavBar';
import LangDropdown from './LangDropDown';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";

/** GLOBAL URL **/
const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets/";

/* ----------- Comments dynamic list Functional Component -----------*/
const Comment = (props) => {

    const [commentList, setCommentList] = useState([]);
    const [numComment, setNumComment] = useState(0);
    const [commentBoxToggle, setCommentBoxToggle] = useState(true); 
    console.log(props.snipID);

    // ----------------------- CREATE COMMENT ---------------------
    // Send HTTP comment create request
    function createCommentHTTP(date, text){
        // Create JSON comment 
        let data = {};
        data["id"] = numComment;
        data["snippetID"] = props.snipID;
        data["timestamp"] = Math.round((date).getTime() / 1000);
        data["text"] = text;
        data["regionStart"] = 1;
        data["regionEnd"] = 2;

        let json = JSON.stringify(data);
        console.log(json);

        // Setup:Send the HTTP Request to AWS
        let textURL = url + "/comments";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", textURL, true);
        console.log("JSON: " + json);
        console.log(textURL);

        xhr.setRequestHeader("Content-Type", "application/json");

        // Send data as JSON
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
                else if(xhr.status === 400){
                    alert("Unable to Add comment");
                }
            } else {
                console.log("Didn't processes");
            }
        }
    }

    // Add comment using the 'comment' button
    const addCommentClick = e => {
        // Spawn new textarea for new comment
        if(commentBoxToggle){
            setCommentBoxToggle(false);
            console.log("Added Comment Box: " + numComment);
            setCommentList(commentList.concat(
                <Card body inverse color="success">
                    <CardTitle id={"h" + numComment}>Time: </CardTitle>
                    <textarea id={"ta" + numComment}></textarea>
                </Card>
            ));
        }else{
            window.alert("Submit current comment before creating new one");
        }
    };

    // Submit comment 
    const submitCommentClick = e => {
        // Current Comment textarea disabled
        let textAreaNum = "ta" + numComment;
        let timeHeaderNum = "h" + numComment;
        let date = new Date();
        document.getElementById(textAreaNum).readOnly = true;
        document.getElementById(timeHeaderNum).innerHTML += date;
        let text = document.getElementById(textAreaNum).value;

        // Submit HTTP request for creating new comment
        createCommentHTTP(date, text);

        // Increase comment number
        setNumComment(numComment + 1);
        setCommentBoxToggle(true);
    }

    // ----------------------- LOAD COMMENTS FORM REQUEST ---------------------
    // Send HTTP request to load comments
    function loadCommentsHTTP(){
        // Create JSON comment 
        let data = {};
        data["snippetID"] = props.snipID;

        let json = JSON.stringify(data);
        console.log(json);

        // Setup:Send the HTTP Request to AWS
        let textURL = url + "/comments/listCommentsBySnippet";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", textURL, true);
        console.log("JSON: " + json);
        console.log(textURL);

        xhr.setRequestHeader("Content-Type", "application/json");

        // Send data as JSON
        xhr.send(json);

        // Process the response an update GUI
        xhr.onloadend = function() {
            console.log(xhr);
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    console.log("XHR: " + xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    console.log(jsonResponse);
                    var list = [];
                    loadComments(list);
                }
                else if(xhr.status === 400){
                    alert("Failed to get comments");
                }
            } else {
                console.log("Didn't processes");
            }
        }
    }

    // Function to load comments on GUI given a input list (TODO: Not sure if it works)
    const loadComments = (commentsListHTTP) => {
        commentsListHTTP.map((comment, index)=>{
            setCommentList(commentList.concat(
                <Card body inverse color="success">
                    <CardTitle id={"h" + numComment}>Time: {comment.timeSt}</CardTitle>
                    <textarea readonly id={"ta" + numComment} >{comment.text}</textarea>
                </Card>
            ));
            setNumComment(numComment + 1);
        })
    };

    return(
        <>
            <div id="commentArea">
                {commentList}
            </div>
            <button onClick={addCommentClick}>Add Comment</button>
            <button onClick={submitCommentClick}>Submit Comment</button>
        </>
    );
}

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
            commentNum: 0,
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

                    window.open("/", "_self");
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
        Snippet.textToDB(this.state.url + "/updateInfo", "info", this.state.info, this.state.inputtedPass);
    }

    textSubmit(event) {
        Snippet.textToDB(this.state.url + "/updateText", "text", this.state.text);
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
                            <h2 class="infoTitle">Snippet Information:</h2>
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
                        <div class="flexContainerBar">
                            <div class="equalCol">
                                <LangDropdown func={this.setLanguage} />
                            </div>
                            <div class="equalCol">
                                <h3 id="snippetId">Snippet ID: {this.state.snippetID}</h3>
                            </div>
                            <div class="equalCol">
                                <h3 class="timeTitle" id="timestampText">Created: {this.state.timestampText}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="snippetsection">
                        <div class="break"></div>
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
                                    enableBasicAutocompletion: false,
                                    enableLiveAutocompletion: false,
                                    enableSnippets: false,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}/>
                        </div>
                        <div id="commentDiv" className="rightCol">
                            <h5 class="commentsTitle">Comments</h5>
                            <br/>
                            <Comment snipID={this.state.snippetID}/>
                            <button type="button" onClick={this.textSubmit}>Save Text</button>
                        </div>
                    </div>
                    <div className="snippetsection" id="contactDiv">
                        <h2 class="contactTitle">Contact Us</h2>
                        <div class="flexContainerBar">
                            <a class="iconStyled" href="https://github.com/JosuContrer/infinite-monkey-snippet">
                                <FontAwesomeIcon  icon={faGithub} />
                            </a>
                            <i class="iconStyled">
                                <FontAwesomeIcon icon={faLinkedin} />
                                <ul class="linkedInContent">
                                    <a href="https://www.linkedin.com/in/josue-contreras-127238141/">Josue</a><br></br>
                                    <a href="https://www.linkedin.com/in/nicholas-delli-carpini-4a9400171/">Nick</a><br></br>
                                    <a href="https://www.linkedin.com/in/william-c-32a424108/">Will</a><br></br>
                                </ul>
                            </i>
                            <i class="iconStyled">
                                <FontAwesomeIcon  icon={faInstagram} />
                                <ul class="linkedInContent">
                                    <a href="https://www.instagram.com/contrerasjosu/">Josue</a><br></br>
                                    <a href="">Nick</a><br></br>
                                    <a href="">Will</a><br></br>
                                </ul>
                            </i>
                        </div>
                        <p class="contactInfo">Authors: Josue C, Nick D, Will C</p>
                    </div>
            </div>
            </div>
            </>
        );
    }
}

export default Snippet;