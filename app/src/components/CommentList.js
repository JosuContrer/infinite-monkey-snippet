import React, { Component } from "react";
import { Card, CardTitle } from 'reactstrap';
import {callLambda, sanitizeText} from "./Utilities";
import "./styles.css";

const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/comments/"

class CommentList extends Component {

    constructor(props){
        super(props);

        this.state = {
            snippetID: props.snipID,
            password: props.snipPassword,
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
        this.submitComment = this.submitComment.bind(this);
        this.cancelComment = this.cancelComment.bind(this);
        this.loadComments = this.loadComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);

        this.newComUpdate = this.newComUpdate.bind(this);
    }
   
    componentDidMount(){

        // GET COMMENTS

        this.loadComments();

        let extThis = this;
        // Load comments on set interval
        setInterval(function() {
            if(!extThis.state.commentInProgress) {
                extThis.loadComments();
            }
        }, extThis.state.loadCommentInterval);

    }

    // Add comment by clicking on the 'comment' button
    addComment(event) {
        if (this.state.commentInProgress) {
            window.alert("Submit or cancel current comment before creating new one");
        } else {
            let ace = document.getElementById("ace-editor");
            let start = ace.env.editor.selection.anchor.row + 1;
            let end = ace.env.editor.selection.cursor.row + 1;

            if (start > end) {
                let temp = start;
                start = end;
                end = temp;
            }

            const c = (
                <Card key="comInProg" id="comInProg" body inverse color="success">
                    <p>Selected Lines: {start + ", " + end}</p>
                    <textarea onChange={this.newComUpdate}></textarea>
                    <div id="newComDiv">
                        <button className="monkeyButton" onClick={this.submitComment}>Submit Comment</button>
                        <button className="monkeyButton" id="cancelButt" onClick={this.cancelComment}>Cancel Comment</button>
                    </div>
                </Card>
            );

            // thank you react, very cool
            this.setState({
                commentInProgress: true,
            }, () => {
               this.setState({
                    commentCardList: this.state.commentCardList.concat(c),
                    startSelection: start,
                    endSelection: end,
                });
            });
        }
    }

    cancelComment(event) {
        this.setState({
            commentInProgress: false,
            commentCardList: this.state.commentCardList
                .filter(x => x.props.id !== "comInProg"),
        });
    }

    submitComment(event) {
        let extThis = this;
        
        let data = {};
        data["snippetID"] = this.state.snippetID;
        data["text"] = sanitizeText(this.state.newComText);
        data["regionStart"] = this.state.startSelection;
        data["regionEnd"] = this.state.endSelection;

        callLambda(extThis, url, "POST", data)
            .then(response => {
                // this.setState({
                //     commentCardList: [],
                // })
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
    }

    deleteComment(commentID){
        return function(e) {
            let extThis = this;

            let data = {};
            data["snippetID"] = this.state.snippetID;
            data["commentID"] = commentID;
            data["password"] = this.state.password;

            callLambda(extThis, url + "deleteComment", "POST", data)
                .then(response => {
                   
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
        }
    }


    // ----------------------- LOAD COMMENTS FROM REQUEST ---------------------

    // Function to load comments on GUI given a input list (TODO: Make it work onload of document and heartbeat?)
    loadComments(event){
        console.log("Loading comments ...");

        let extThis = this;
        const commentURl = url + "listCommentsBySnippet"
        let data = {};
        data["snippetID"] = this.state.snippetID;

        callLambda(this, commentURl, "POST", data)
            .then(response => {
                let idArray = this.state.commentList.map((comment) => comment.ID);

                let newArray = response["comments"].filter((comment) => {
                    if (!idArray.includes(comment.ID)) {
                        return comment;
                    }
                    return null;
                });

                newArray.sort((a, b) => ((a.regionStart + a.regionEnd) > (b.regionStart + b.regionEnd)) ? 1:-1);

                let c = newArray.map(function(comment){
                    let timestampNum = comment.timestamp;
                    let unixDate = new Date(timestampNum);

                    return(
                        <Card key={comment.ID} id={comment.ID} body inverse color="success">
                            <button id="commentDeleteButton" onClick={this.deleteComment}>x</button>
                            <CardTitle>Time: {unixDate.toLocaleString()}</CardTitle>
                            <p> Selected Lines: {comment.regionStart + ", " + comment.regionEnd} </p>
                            <textarea readOnly="readonly">{comment.text}</textarea>
                        </Card>
                    )
                });

                extThis.setState({
                    commentList: this.state.commentList.concat(newArray),
                    commentCardList: this.state.commentCardList.concat(c)
                        .filter(x => x.props.id !== "comInProg"),
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
                <button className="monkeyButton" onClick={this.addComment}>Add Comment</button>
            </>
        );
    }
}

export default CommentList;