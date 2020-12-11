import React, {Component} from "react";
import {Button} from "reactstrap/es";
import { List } from 'semantic-ui-react';
import 'react-calendar/dist/Calendar.css';
import Datetime from "react-datetime";
import moment from "moment";


import './Admin.css'
import 'semantic-ui-css/semantic.min.css'
import "react-datetime/css/react-datetime.css";
import {callLambda} from "./Utilities";
import Loader from "react-loaders";

const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets/";

class Admin extends Component{

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            removeDate: new Date(),
            password: "",
            snippetList: null,

            isLoading: false,
        }

        this.onGetDate = this.onGetDate.bind(this);
        this.removeStale = this.removeStale.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.checkAdminPass = this.checkAdminPass.bind(this);
        this.deleteSnippet = this.deleteSnippet.bind(this);
    }

    componentDidMount() {
        // check password
        this.checkAdminPass();
    }

    checkAdminPass() {
        let extThis = this;
        const promptResp = prompt("Please Enter Admin Password:");
        this.setState({
            isLoading: true,
            password: promptResp,
        }, () => {
            const list_url = url + "listSnippets"
            let data = {};
            data["adminPass"] = this.state.password;
            callLambda(extThis, list_url, "POST", data)
                .then(response => {
                    console.log(response);

                    extThis.setState({
                        isLoading: false,
                    });

                    if (response["statusCode"] === 200) {
                        extThis.setState({
                           snippetList: response["snippetList"],
                        });
                    }
                    else {
                        alert("Incorrect Password - Please try again");
                        extThis.checkAdminPass();
                    }
                })
                .catch(error => {
                    alert("Something went wrong");
                    console.log(error);

                    extThis.setState({
                        isLoading: false,
                    });
                });
        });
    }

    onGetDate(e){
        let dateSel = moment(e).toDate();
        this.setState({
            removeDate: dateSel,
        });
    }

    removeStale(e) {
        let extThis = this;
        const promptResp = prompt("Would you like to delete all Snippets created before:\n\n" + this.state.removeDate.toLocaleString()
        + "\n\nEnter 'delete' to confirm");

        if (promptResp != null && promptResp.includes("delete")) {
            this.setState({
                isLoading: true,
            });

            const rm_url = url + "removeStaleSnippets"
            let data = {};
            data["adminPass"] = this.state.password;
            data["staleTime"] = this.state.removeDate.getTime();
            data["snipID"] = "";

            callLambda(extThis, rm_url, "POST", data)
                .then(response => {
                    console.log(response);
                    extThis.setState({
                        isLoading: false,
                    });

                    if (response["statusCode"] === 200) {
                        extThis.setState({
                            snippetList: response["snippetList"],
                        });

                        alert("Snippets successfully deleted");
                    }
                    else {
                        alert("Could not delete snippets\n\nLikely no Snippets created before:\n" + this.state.removeDate.toLocaleString());
                    }
                })
                .catch(error => {
                    extThis.setState({
                        isLoading: false,
                    });

                    alert("Something went wrong");
                    console.log(error);
                });
        }
        else {
            alert("Please input 'delete' to delete Snippets")
        }
    }

    deleteSnippet(snippetID) {
        let extThis = this;
        return function(e) {
            extThis.setState({
                isLoading: true,
            });

            const rm_url = url + "removeStaleSnippets"

            let data = {};
            data["adminPass"] = extThis.state.password;
            data["staleTime"] = extThis.state.removeDate.getTime();
            data["snipID"] = snippetID;

            callLambda(extThis, rm_url, "POST", data)
                .then(response => {
                    console.log(response);
                    extThis.setState({
                        isLoading: false,
                    });

                    if (response["statusCode"] === 200) {
                        extThis.setState({
                            snippetList: response["snippetList"],
                        });

                        alert("Snippet " + snippetID + " successfully deleted");
                    }
                    else {
                        alert("Could not delete snippet");
                    }
                })
                .catch(error => {
                    extThis.setState({
                        isLoading: false,
                    });

                    alert("Something went wrong");
                    console.log(error);
                });


            e.preventDefault();
        }
        
    }

    renderItem(listItem) {
        let unixDate = new Date(listItem["timestamp"]);
        return <List.Item key={listItem["id"]}>
            <List.Content>
                <div className="listItem">
                    <div className="listLeft">
                        <List.Header as='a' href={"snippet#" + listItem["id"]}>Snippet ID: {listItem["id"]}</List.Header>
                        <List.Description as='a'>Time Created: {unixDate.toLocaleString()}</List.Description>
                    </div>
                    <div className="listRight">
                        <Button className="delButt" onClick={this.deleteSnippet(listItem["id"])}>X</Button>
                    </div>
                </div>
            </List.Content>
        </List.Item>;
    }

    render() {
        return(
            <div id="AdminMainPage">
                <div className="admin-menu-bar">
                    <h1 className="admin-menu-title">Infinite Monkey Administrator</h1>
                    {this.state.isLoading ?
                        <div className="loaderDiv"><Loader type={"pacman"} /></div>
                        : <div className="loaderDiv"></div>
                    }
                </div>
                <div className="admin-container">
                    <div className="date-select-container">
                        <h1 className="date-select-title">Date:</h1>
                        <Datetime className="date-select-calendar" onClose={this.onGetDate}/>
                        <Button outline color="primary" className="date-select-button" onClick={this.removeStale}>Delete</Button>
                    </div>
                    <div className="snippet-list-container">
                        <h1 className="snippet-list-title">Snippets In System</h1>
                        <div className="snippet-list" style={{overflow: 'auto', maxHeight: 20}}>
                            <List divided relaxed>
                                { (this.state.snippetList !== null)
                                    ? this.state.snippetList.map((x) => this.renderItem(x))
                                    : <div></div>}
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;