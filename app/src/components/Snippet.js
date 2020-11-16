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

    const [commentList, setCommentList] = useState([props.commentList]);
    const [numComment, setNumComment] = useState(0);
    const [commentBoxToggle, setCommentBoxToggle] = useState(true);

    // ----------------------- CREATE COMMENT ---------------------
    // Send HTTP comment create request
    // function createCommentHTTP(date, text, startS, endS){
    //     // Create JSON comment
    //     let data = {};
    //     data["id"] = numComment;
    //     data["snippetID"] = props.snipID;
    //     data["timestamp"] = Math.round((date).getTime() / 1000);
    //     data["text"] = text;
    //     data["regionStart"] = startS;
    //     data["regionEnd"] = endS;
    //
    //     let json = JSON.stringify(data);
    //     console.log(json);
    //
    //     // Setup:Send the HTTP Request to AWS
    //     let textURL = initURL + "/comments";
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("POST", textURL, true);
    //     console.log("JSON: " + json);
    //     console.log(textURL);
    //
    //     xhr.setRequestHeader("Content-Type", "application/json");
    //
    //     // Send data as JSON
    //     xhr.send(json);
    //
    //     // Process the response an update GUI
    //     xhr.onloadend = function() {
    //         console.log(xhr);
    //         if(xhr.readyState === XMLHttpRequest.DONE){
    //             if(xhr.status === 200){
    //                 console.log("XHR: " + xhr.responseText);
    //                 let jsonResponse = JSON.parse(xhr.responseText);
    //                 console.log(jsonResponse);
    //             }
    //             else if(xhr.status === 400){
    //                 alert("Unable to Add comment");
    //             }
    //         } else {
    //             console.log("Didn't processes");
    //         }
    //     }
    // }

    // Add comment using the 'comment' button
    const addCommentClick = e => {
        // Spawn new textarea for new comment
        if(commentBoxToggle){
            setCommentBoxToggle(false);
            console.log("Added Comment Box: " + numComment);
            setCommentList(commentList.concat(
                <Card body inverse color="success">
                    <CardTitle id={"h" + numComment}>Time: </CardTitle>
                    <p id={"l" +numComment}>Selected Lines: </p>
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
        let linesNum = "l" + numComment;
        let date = new Date();
        document.getElementById(textAreaNum).readOnly = true;
        document.getElementById(timeHeaderNum).innerHTML += date;
        document.getElementById(linesNum).innerHTML += (props.startSel + ', ' + props.endSel);
        let text = document.getElementById(textAreaNum).value;

        // Submit HTTP request for creating new comment
        //createCommentHTTP(date, text);

        // Increase comment number
        setNumComment(numComment + 1);
        setCommentBoxToggle(true);
    }

    // ----------------------- LOAD COMMENTS FROM REQUEST ---------------------
    // Send HTTP request to load comments
    // function loadCommentsHTTP(){
    //     // Create JSON comment
    //     let data = {};
    //     data["snippetID"] = props.snipID;
    //
    //     let json = JSON.stringify(data);
    //     console.log(json);
    //
    //     // Setup:Send the HTTP Request to AWS
    //     let textURL = initURL + "/comments/listCommentsBySnippet";
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("POST", textURL, true);
    //     console.log("JSON: " + json);
    //     console.log(textURL);
    //
    //     xhr.setRequestHeader("Content-Type", "application/json");
    //
    //     // Send data as JSON
    //     xhr.send(json);
    //
    //     // Process the response an update GUI
    //     xhr.onloadend = function() {
    //         console.log(xhr);
    //         if(xhr.readyState === XMLHttpRequest.DONE){
    //             if(xhr.status === 200){
    //                 console.log("XHR: " + xhr.responseText);
    //                 let jsonResponse = JSON.parse(xhr.responseText);
    //                 console.log(jsonResponse);
    //                 var list = [];
    //                 loadComments(list);
    //             }
    //             else if(xhr.status === 400){
    //                 alert("Failed to get comments");
    //             }
    //         } else {
    //             console.log("Didn't processes");
    //         }
    //     }
    // }

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
            comments: [],

            startSelection: 0,
            endSelection: 0,
        };

        this.setLanguage = this.setLanguage.bind(this);

        this.infoChanged = this.infoChanged.bind(this);
        this.textChanged = this.textChanged.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);

        this.textSubmit = this.textSubmit.bind(this);
        this.infoSubmit = this.infoSubmit.bind(this);

        this.editInfo = this.editInfo.bind(this);
        this.deleteSnippet = this.deleteSnippet.bind(this);
    }

    componentDidMount() {

        // GET SNIPPET DATA
        Snippet.callLambda(this, this.state.url, "GET")
            .then(response => {
                let timestampNum = response["timestamp"];
                let unixDate = new Date(timestampNum);

                this.setState({
                    password: response["password"],
                    languageText: response["language"],
                    timestampText: unixDate.toLocaleString(),
                    info: response["info"],
                    text: response["text"],
                });
            })
            .catch(error => {
                console.log(error);
            });


        // GET COMMENTS
        const commentURl = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/comments/listCommentsBySnippet"
        let data = {};
        console.log(this.state.snippetID);
        data["snippetID"] = this.state.snippetID;

        Snippet.callLambda(this, commentURl, "POST", data)
            .then(response => {
                this.setState({
                    comments: response["comments"]
                });

                console.log(this.state.comments);

            })
            .catch(error => {
                console.log(error);
            });

    }

    static sanitizeText(text) {
        const backspace = String.fromCharCode(8);
        const formfeed = String.fromCharCode(12);
        const newline = String.fromCharCode(10);
        const carriage = String.fromCharCode(13);
        const tab = String.fromCharCode(9);
        const quote = String.fromCharCode(34);
        const backslash = String.fromCharCode(92);

        let cursedArray = [backslash, backspace, formfeed, newline, carriage, tab, quote];
        let blessedArray = ['\\', '\\b', '\\f', '\\n', '\\r', '\\t', '\\"']

        let snipText = text.replace(/[\x5c\x08\x0c\x0a\x0d\x09\x22]/g, function(x) {
            let i = cursedArray.indexOf(x);

            return blessedArray[i];
        });

        return snipText;
    }

    static callLambda(extThis, url, type, data=null, password=null) {
        console.log("Request " + type + " @ " + url);

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(type, url, true);

            if (password !== null) {
                data["password"] = password;
            }

            xhr.onload = () => {
                if(xhr.status >= 200 && xhr.status < 300){
                    console.log("XHR: " + xhr.responseText);

                    resolve(JSON.parse(xhr.responseText));
                }
                else {
                    console.log("    Request Failed: " + xhr.status);

                    reject(xhr.statusText);
                }
            };

            xhr.onerror = () => reject(xhr.statusText);

            if (data !== null) {
                xhr.setRequestHeader("Content-Type", "application/json");

                xhr.send(JSON.stringify(data));
            }
            else {
                xhr.send();
            }
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
        let infoText = Snippet.sanitizeText(this.state.info);

        let data = {};
        data["info"] = infoText;
        Snippet.callLambda(this, this.state.url + "/updateInfo", "POST",  data, this.state.inputtedPass)
            .catch(error => {
                console.log(error);
            });
    }

    textSubmit(event) {
        let textText = Snippet.sanitizeText(this.state.text);

        let data = {};
        data["text"] = textText;
        Snippet.callLambda(this, this.state.url + "/updateText", "POST", data)
            .catch(error => {
                console.log(error);
            });
    }

    deleteSnippet(event) {
        let delURL = this.state.url + "/deleteSnippet"
        Snippet.callLambda(this, delURL, "POST", {}, this.state.inputtedPass)
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

    onSelectionChanged(editor){
        let startRow = editor.anchor.row + 1;
        let endRow = editor.cursor.row + 1;

        this.setState({
            startSelection: startRow,
            endSelection: endRow,
        });
        console.log("Cursor: " + this.state.startSelection + ", " + this.state.endSelection);
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
                            <AceEditor
                                ref="mainEditor"
                                placeholder=""
                                mode={this.state.languageText}
                                width={"100%"}
                                theme={"monokai"}
                                height={"600px"}
                                onChange={this.textChanged}
                                onSelectionChange={this.onSelectionChanged}
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
                            <Comment snipID={this.state.snippetID} startSel={this.state.startSelection} endSel={this.state.endSelection} commentList={this.state.comments}/>
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