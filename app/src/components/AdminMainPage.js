import React, {Component, setState} from "react";
import {Button} from "reactstrap/es";
import { List } from 'semantic-ui-react';
import 'react-calendar/dist/Calendar.css';
import Datetime from "react-datetime";
import moment from "moment";

import './AdminMainPage.css'
import 'semantic-ui-css/semantic.min.css'
import "react-datetime/css/react-datetime.css";


class AdminMainPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            removeDate: new Date(),
            accounts: ["hi", "bich", "who tf"]
        }

        this.onGetDate = this.onGetDate.bind(this);
        this.removeStale = this.removeStale.bind(this);

        this.handleAccounts = this.handleAccounts.bind(this);
        this.renderItem = this.renderItem.bind(this);
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

    handleAccounts(accounts) {
        this.setState({accounts});
    }

    renderItem(index, key) {
        return <div key={key}>{this.state.accounts[index].name}</div>;
    }

    render() {
        return(
            <div id="AdminMainPage">
                <div className="admin-menu-bar">
                    <h className="admin-menu-title">Infinite Monkey Snippet</h>
                </div>
                <div className="admin-container">
                    <div className="date-select-container">
                        <h className="date-select-title">Date:</h>
                        <Datetime className="date-select-calendar" onClose={this.onGetDate}/>
                        <Button outline color="primary" className="date-select-button" onClick={this.removeStale}>Delete</Button>
                    </div>
                    <div className="snippet-list-container">
                        <h className="snippet-list-title">Snippets In System</h>
                        <div className="snippet-list" style={{overflow: 'auto', maxHeight: 20}}>
                            <List divided relaxed>
                                <List.Item>
                                    <List.Icon name='github' size='large' verticalAlign='middle' />
                                    <List.Content href='https://react.semantic-ui.com/elements/list/#types-divided'>
                                        <List.Header as='a'>Semantic-Org/Semantic-UI</List.Header>
                                        <List.Description as='a'>Updated 10 mins ago</List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='github' size='large' verticalAlign='middle' />
                                    <List.Content>
                                        <List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header>
                                        <List.Description as='a'>Updated 22 mins ago</List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Icon name='github' size='large' verticalAlign='middle' />
                                    <List.Content>
                                        <List.Header as='a'>Semantic-Org/Semantic-UI-Meteor</List.Header>
                                        <List.Description as='a'>Updated 34 mins ago</List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminMainPage;