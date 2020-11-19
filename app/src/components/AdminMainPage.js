import React, {Component, setState} from "react";
import {Button} from "reactstrap/es";
import 'react-calendar/dist/Calendar.css'
import Datetime from "react-datetime";

import './AdminMainPage.css'
import "react-datetime/css/react-datetime.css";
import moment from "moment";

class AdminMainPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            removeDate: new Date(),
        }

        this.onGetDate = this.onGetDate.bind(this);
        this.removeStale = this.removeStale.bind(this);
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

    render() {
        return(
            <div id="AdminMainPage">
                <div className="admin-menu-bar">
                    <h className="admin-menu-title">Infinite Monkey Snippet</h>
                </div>
                <div className="admin-container">
                    <h className="date-select-title">Select Date Starting Date:</h>
                    <Datetime onClose={this.onGetDate}/>
                    <Button onClick={this.removeStale}>Delete</Button>
                    <div className="snippet-list-container">
                        <h className="snippet-list-header">Snippets In System</h>
                        <ul>
                            <li>Snippet ID (date)</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminMainPage;