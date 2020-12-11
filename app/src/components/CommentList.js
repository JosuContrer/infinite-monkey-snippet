import React, { Component } from "react";
import { Card, CardTitle } from 'reactstrap';
import {callLambda, sanitizeText} from "./Utilities";
import "./styles.css";
import Loader from "react-loaders";

const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/comments/"

class CommentList extends Component {

    constructor(props){
        super(props);

        this.state = {
            snippetID: props.snipID,
            commentList: [],

            inProgCom: null,
            inProgText: "",

            isLoading: false,
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
        setInterval(() => {
                extThis.loadComments();
        }, extThis.props.timerInterval);

    }

    // Add comment by clicking on the 'comment' button
    addComment(event) {
        if (this.state.inProgCom !== null) {
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

            this.setState({
                inProgCom: {
                    text: "",
                    regionStart: start,
                    regionEnd: end,
                }
            });

        }
    }

    cancelComment(event) {
        this.setState({
            inProgCom: null,
        });
    }

    submitComment(event) {
        let extThis = this;

        this.setState({
            isLoading: true,
        });
        
        let data = {};
        data["snippetID"] = this.state.snippetID;
        data["text"] = sanitizeText(this.state.inProgCom["text"]);
        data["regionStart"] = this.state.inProgCom["regionStart"];
        data["regionEnd"] = this.state.inProgCom["regionEnd"];

        callLambda(extThis, url, "POST", data)
            .then(response => {
                extThis.loadComments();

                extThis.setState({
                    isLoading: false,
                    inProgCom: null,
                });
            })
            .catch(error => {
                console.log(error);

                extThis.setState({
                    isLoading: false,
                    inProgCom: null,
                });
            });
    }

    deleteComment(commentID){
        let extThis = this;
        return function(e) {

            extThis.setState({
                isLoading: true,
            });

            let data = {};
            data["snippetID"] = extThis.state.snippetID;
            data["commentID"] = commentID;
            data["password"] = extThis.props.snipPassword;

            callLambda(extThis, url +  commentID + "/deleteComment", "POST", data)
                .then(response => {
                    extThis.loadComments();

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
    }


    // ----------------------- LOAD COMMENTS FROM REQUEST ---------------------
    loadComments(event){
        let extThis = this;
        const commentURl = url + "listCommentsBySnippet"
        let data = {};
        data["snippetID"] = this.state.snippetID;

        callLambda(this, commentURl, "POST", data)
            .then(response => {
                let newArray = response["comments"];
                newArray.sort((a, b) => ((a.regionStart + a.regionEnd) > (b.regionStart + b.regionEnd)) ? 1:-1);

                extThis.setState({
                    commentList: newArray,
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    renderItem(listItem) {
        let extThis = this;
        let unixDate = new Date(listItem["timestamp"])
        return(
            <Card key={listItem["ID"]} id={listItem["ID"]} body inverse color="success">
                {extThis.props.creatorMode ?
                    <button id="commentDeleteButton" onClick={extThis.deleteComment(listItem["ID"])}>x</button>
                    : <div></div>
                }
                <CardTitle>Time: {unixDate.toLocaleString()}</CardTitle>
                <p> Selected Lines: {listItem["regionStart"] + ", " + listItem["regionEnd"]} </p>
                <p className="not_textarea">{listItem["text"]}</p>
            </Card>
        )
    }

    renderProg() {
        let extThis = this;
        return <Card key="comInProg" id="comInProg" body inverse color="success">
            <p>Selected Lines: {extThis.state.inProgCom["regionStart"] + ", " + extThis.state.inProgCom["regionEnd"]}</p>
            <textarea onChange={extThis.newComUpdate}></textarea>
            <div id="newComDiv">
                <button className="monkeyButton" onClick={extThis.submitComment}>Submit Comment</button>
                <button className="monkeyButton" id="cancelButt" onClick={extThis.cancelComment}>Cancel Comment</button>
            </div>
        </Card>
    }

    newComUpdate(event) {
        let extThis = this;
        this.setState({
            inProgCom: {
                text: event.target.value,
                regionStart: extThis.state.inProgCom["regionStart"],
                regionEnd: extThis.state.inProgCom["regionEnd"],
            },
        });
    }

    render(){
        return(
            <>
                <div id="commentArea">
                    {(this.state.commentList !== null) ?
                    this.state.commentList.map((x) => this.renderItem(x))
                        : <div></div>}
                    {(this.state.inProgCom !== null) ?
                    this.renderProg()
                        : <div></div>}
                </div>
                <button id="addComButt" className="monkeyButton" onClick={this.addComment}>Add Comment</button>
            </>
        );
    }
}

export default CommentList;