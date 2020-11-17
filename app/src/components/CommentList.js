import React, {Component, useState} from "react";
import { Card, CardTitle, Button} from 'reactstrap';

class CommentList extends Component {

    constructor(props){
        super(props);

        this.state = {
            snippetID: props.snipID,
            commentList: {},
            commentCardList: [],
            numComment: 0,
            commentInProgress: false,

            loadCommentInterval: 5000,
        }

        // this.addCommentClick = this.addCommentClick.bind(this);
        // this.submitCommentClick = this.submitCommentClick.bind(this);
        this.loadCommentsClick = this.loadCommentsClick.bind(this);
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
   
    componentDidMount(){

        // GET COMMENTS
        const commentURl = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/comments/listCommentsBySnippet"
        let data = {};
        console.log(this.state.snippetID);
        data["snippetID"] = this.state.snippetID;

        CommentList.callLambda(this, commentURl, "POST", data)
            .then(response => {
                this.setState({
                    commentList: response["comments"]
                });

                this.loadCommentsClick();

                console.log(this.state.commentList);

            })
            .catch(error => {
                console.log(error);
            });

        let comP = this;
        // Load comments on set interval
        setInterval(function() {
            if(!comP.state.commentInProgress){
                console.log("Loading comments ...");
                comP.loadCommentsClick();
            }
        }, comP.state.loadCommentInterval);
    }

    // // Add comment by clicking on the 'comment' button
    // addCommentClick(event) {
    //     // Spawn new textarea for new comment
    //     if(!this.state.commentInProgress){
    //         this.setState({
    //             commentInProgress: true,
    //         });
        
    //         this.state.commentList = commentList.concat(
    //             <Card body inverse color="success">
    //                 <CardTitle id={"h" + numComment}>Time: </CardTitle>
    //                 <p id={"l" +numComment}>Selected Lines: </p>
    //                 <textarea id={"ta" + numComment}></textarea>
    //             </Card>
    //         );
    //     }else{
    //         window.alert("Submit current comment before creating new one");
    //     }
    // };

    // On comment submission: 
    //  display time, snippet selection lines, make box not editable, make HTTP request
    // submitCommentClick(event) {
    //     // Current Comment textarea disabled
    //     let textAreaNum = "ta" + numComment;
    //     let timeHeaderNum = "h" + numComment;
    //     let linesNum = "l" + numComment;
    //     let date = new Date();
    //     document.getElementById(textAreaNum).readOnly = true;
    //     document.getElementById(timeHeaderNum).innerHTML += date;
    //     document.getElementById(linesNum).innerHTML += (props.startSel + ', ' + props.endSel);
    //     let text = document.getElementById(textAreaNum).value;

    //     // Submit HTTP request for creating new comment
    //     //createCommentHTTP(date, text);
    //     //props.func(date, text)

    //     setCommentBoxToggle(true);
    // }

    // ----------------------- LOAD COMMENTS FROM REQUEST ---------------------

    // Function to load comments on GUI given a input list (TODO: Make it work onload of document and heartbeat?)
    loadCommentsClick(event){
        const c = this.state.commentList.map(function(comment){
            return(
                    <Card id={comment.ID} body inverse color="success">
                        <CardTitle id={comment.ID}>Time: {comment.timestamp}</CardTitle>
                        <p id={comment.ID}>Selected Lines: {comment.regionStart + ", " + comment.regionEnd} </p>
                        <textarea readonly="readonly" id={"ta" + comment.ID}>{ comment.text}</textarea>
                    </Card>
                    )});

        this.setState({
            commentCardList: c,
        });  
        console.log("Comment List ", this.state.commentList);
        console.log("Card List ", this.state.commentCardList); 
    } 

    render(){
        return(
            <>
                <div id="commentArea">
                    {this.state.commentCardList}
                </div>
                <button onClick={this.loadCommentsClick}>Load Comments</button>
                {/* <button onClick={addCommentClick}>Add Comment</button>
                <button onClick={submitCommentClick}>Submit Comment</button> */}
            </>
        );
    }
}

export default CommentList;