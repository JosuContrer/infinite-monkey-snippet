import React, {Component, setState} from "react";
import {Button} from "reactstrap/es";
import { List } from 'semantic-ui-react';
import 'react-calendar/dist/Calendar.css';
import Datetime from "react-datetime";
import moment from "moment";


import './Admin.css'
import 'semantic-ui-css/semantic.min.css'
import "react-datetime/css/react-datetime.css";
import {callLambda} from "./Utilities";

const url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets/";

class Admin extends Component{

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            removeDate: new Date(),
            password: "",
            snippetList: null,
        }

        this.onGetDate = this.onGetDate.bind(this);
        this.removeStale = this.removeStale.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.checkAdminPass = this.checkAdminPass.bind(this);
    }

    componentDidMount() {
        // check password
        this.checkAdminPass();
    }

    checkAdminPass() {
        let extThis = this;
        const promptResp = prompt("Please Enter Admin Password:");
        this.setState({
            password: promptResp,
        }, () => {
            const list_url = url + "listSnippets"
            let data = {};
            data["adminPass"] = this.state.password;
            callLambda(extThis, list_url, "POST", data)
                .then(response => {
                    if (response["statusCode"] === 200) {
                        console.log(response);
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
                });
        });
    }

    onGetDate(e){
        let dateSel = moment(e).toDate();
        this.setState({
            removeDate: dateSel,
        });
    }

    removeStale(e){
        console.log(this.state.removeDate);
    }

    renderItem(listItem) {
        let unixDate = new Date(listItem["timestamp"]);
        return <List.Item>
            <List.Content href={"snippet#" + listItem["id"]}>
                <List.Header as='a'>Snippet ID: {listItem["id"]}</List.Header>
                <List.Description as='a'>Time Created: {unixDate.toLocaleString()}</List.Description>
            </List.Content>
        </List.Item>;
    }

    render() {
        return(
            <div id="AdminMainPage">
                <div className="admin-menu-bar">
                    <h1 className="admin-menu-title">Infinite Monkey Snippet</h1>
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