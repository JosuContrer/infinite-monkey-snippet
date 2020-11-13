import React, {Component} from "react"
import AceEditor from "react-ace";
import "./styles.css";

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

        };

        this.infoChanged = this.infoChanged.bind(this);
        this.textChanged = this.textChanged.bind(this);

        this.textSubmit = this.textSubmit.bind(this);
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

    infoChanged(event) {
        this.setState({
            info: event.target.value,
        });
    }

    textChanged(event) {
        this.setState({
            text: event.target.value,
        });
    }

    textSubmit(event) {
        let extThis = this;
        let text_url = this.state.url + "/updateText";

        let snipText = this.state.text;

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

        data["text"] = snipText;
        let json = JSON.stringify(data);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", text_url, true);

        console.log("JSON: " + json);
        console.log(text_url);

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
                    alert("Unable to update text");
                }
            } else {
                console.log("Didn't processes");
            }
        }
    }

    render() {
        return (
            <div id="snippetpage">
                <div className="column">
                    <div className="card">
                        <div className="header">
                            <h1>Infinite Monkey Snippet</h1>
                            <h2 id="snippetId">Snippet ID: {this.state.snippetID}</h2>
                        </div>
                    </div>
                    <div className="card">
                        <div id="infoDiv" className="leftCol">
                            <h5>Info:</h5>
                            <br/>
                            <form>
                                <textarea id="infoArea" value={this.state.info} onChange={this.infoChanged} />
                            </form>
                        </div>
                        <div id="langDiv" className="rightCol">
                            <div id="accessory">
                                <h5 id="languageText">Language: {this.state.languageText}</h5>
                                <h5 id="timestampText">Timestamp: {this.state.timestampText}</h5>
                            </div>
                            <button type="button">Save Info</button>
                        </div>
                    </div>
                    <div className="card">
                        <div id="textDiv" className="leftCol">
                            <h5>Text:</h5>
                            <br/>
                            <AceEditor
                                placeholder="Placeholder Text"
                                mode="javascript"
                                theme="monokai"
                                name="blah2"
                                onLoad={this.onLoad}
                                onChange={this.onChange}
                                fontSize={14}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                value={`function onLoad(editor) {
                                console.log("i've loaded");
                                }`}
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
                    <div className="card" id="contactDiv">
                        <h5>Contact Us</h5>
                        <p>some text and links (github, linkedin, instagram, etc.)</p>
                    </div>
            </div>
            </div>
        );
    }
}

export default Snippet;