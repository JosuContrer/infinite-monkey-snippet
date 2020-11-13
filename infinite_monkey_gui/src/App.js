import React, { Component } from 'react';
import {Table, Button} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faThumbsUp, faThumbsDown, faImage, faMoneyCheckAlt, faSearchDollar} from '@fortawesome/free-solid-svg-icons'
import AceEditor from "react-ace";
import './App.css'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

class App extends React.Component {
    state = { 
        isLoading : false,
    }

    render() {
        const isLoading = this.state.isLoading;

        function onChange(newValue) {
            console.log("change", newValue);
          }
        

        return (  
            <div> 
                <div className="column">
                    <div className="card">
                        <div className="header">
                            <h1>Infinite Monkey Snippet</h1>
                            <h2 id="snippetId">Snippet ID:</h2>
                        </div>
                    </div>

                    <div className="card">
                        <div id="infoDiv" className="leftCol">
                            <h5>Info:</h5>
                            <textarea type="text" id="infoArea"></textarea>
                        </div>
			            <div id="langDiv" className="rightCol" >
				            <div id="accessory" >
					            <h5 id="languageText" >Language: </h5>
					            <h5 id = "timestampText" >Timestamp: </h5>
                            </div>
				        </div>
				        <button type="button">Save Info</button>
			        </div>
                </div>
                <div className="card" >
                    <div id="textDiv" className="leftCol" >
                        <h5>Text:</h5>
                        <div id="text_container"></div>
                            <div className="row">
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
                    </div>
                    <div id="commentDiv" className="rightCol" >
                        <h5>Comments:</h5>
                        <div id="commentArea"></div>
                        <button type="button" onclick="saveText(this)" >Save Text</button>
                    </div> 
                </div>
                <div className="card" id="contactDiv" >
                        <h5>Contact Us</h5>
                        <p>some text and links (github, linkedin, instagram, etc.)</p>
                </div>
            </div>  
        );
    }
}
 
export default App;