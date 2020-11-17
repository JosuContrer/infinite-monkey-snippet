import React, {Component, useState} from "react";
import { Card, CardTitle, Button} from 'reactstrap';
import { callLambda } from "./Utilities";
import AceEditor from "react-ace";

const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/comments/"

class CommentList extends Component {

    constructor(props){
        super(props);

        this.state = {
            snippetID: props.snipID,
            commentList: [],
            commentCardList: [],
            numComment: 0,
            commentInProgress: false,

            startSelection: 0,
            endSelection: 0,
            newComText: "",

            loadCommentInterval: 5000,
        }

        this.addComment = this.addComment.bind(this);
        this.submitCommentClick = this.submitCommentClick.bind(this);
        this.loadComments = this.loadComments.bind(this);

        this.newComUpdate = this.newComUpdate.bind(this);
    }
   
    componentDidMount(){

        // GET COMMENTS

        this.loadComments();


        let extThis = this;
        // Load comments on set interval
        // setInterval(function() {
        //     if(!extThis.state.commentInProgress) {
        //         extThis.loadComments();
        //     }
        // }, extThis.state.loadCommentInterval);

    }

    // Add comment by clicking on the 'comment' button
    addComment(event) {
        let ace = document.getElementById("ace-editor");
        let start = ace.env.editor.selection.anchor.row + 1;
        let end = ace.env.editor.selection.cursor.row + 1;

        // Spawn new textarea for new comment
        if(!this.state.commentInProgress){
            const ca = this.state.commentCardList.concat(
                <Card id="comInProg" body inverse color="success">
                    <p>Selected Lines: {start + ", " + end}</p>
                    <textarea id="taInProg" onChange={this.newComUpdate}></textarea>
                    <button onClick={this.submitCommentClick}>Submit Comment</button>
                </Card>
            );

            this.setState({
                commentCardList: ca,
                commentInProgress: true,
                startSelection: start,
                endSelection: end,
            });

        }else{
            window.alert("Submit current comment before creating new one");
        }
    };

    submitCommentClick(event) {
        let extThis = this;

        let data = {};
        data["snippetID"] = this.state.snippetID;
        data["text"] = this.state.newComText;
        data["regionStart"] = this.state.startSelection;
        data["regionEnd"] = this.state.endSelection;

        callLambda(extThis, url, "POST", data)
            .then(response => {
                extThis.loadComments();
            })
            .catch(error => {
                console.log(error);
            });

        this.setState({
            commentInProgress: false,
            startSelection: 0,
            endSelection: 0,
            newComText: "",
        });
        // // Current Comment textarea disabled
        // let textAreaNum = "ta" + numComment;
        // let timeHeaderNum = "h" + numComment;
        // let linesNum = "l" + numComment;
        // let date = new Date();
        // document.getElementById(textAreaNum).readOnly = true;
        // document.getElementById(timeHeaderNum).innerHTML += date;
        // document.getElementById(linesNum).innerHTML += (props.startSel + ', ' + props.endSel);
        // let text = document.getElementById(textAreaNum).value;
        //
        // // Submit HTTP request for creating new comment
        // //createCommentHTTP(date, text);
        // //props.func(date, text)
        //
        // setCommentBoxToggle(true);

    }

    // ----------------------- LOAD COMMENTS FROM REQUEST ---------------------

    // Function to load comments on GUI given a input list (TODO: Make it work onload of document and heartbeat?)
    loadComments(event){
        console.log("Loading comments ...");

        const commentURl = url + "listCommentsBySnippet"
        let data = {};
        data["snippetID"] = this.state.snippetID;

        callLambda(this, commentURl, "POST", data)
            .then(response => {

                let c = response["comments"].map(function(comment){
                    let timestampNum = comment.timestamp;
                    let unixDate = new Date(timestampNum);
                    console.log(comment);
                    return(
                        <Card id={comment.ID} body inverse color="success">
                            <CardTitle>Time: {unixDate.toLocaleString()}</CardTitle>
                            <p> Selected Lines: {comment.regionStart + ", " + comment.regionEnd} </p>
                            <textarea readOnly="readonly">{comment.text}</textarea>
                        </Card>
                    )
                });

                this.setState({
                    commentList: response["comments"],
                    commentCardList: c,
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    newComUpdate(event) {
        this.setState({
            newComText: event.target.value,
        })
    }

    render(){
        return(
            <>
                <div id="commentArea">
                    {this.state.commentCardList}
                </div>
                <button onClick={this.loadComments}>Load Comments</button>
                <button onClick={this.addComment}>Add Comment</button>
                {/* */}
            </>
        );
    }
}

export default CommentList;