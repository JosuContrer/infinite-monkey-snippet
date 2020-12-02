import React, {Component} from "react";
import './AdminHomepage.css';
import { Button} from "reactstrap";

class AdminHomepage extends Component{
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return(
            <div id="AdminPage">
                <h1 className="page-title">Welcome Administrator</h1>
                <div className="row">
                <div class="form-container">
                    <input class="input-container" type="password" required/>
                    <label class="input-label">
                        <span class="input-name">Password</span>
                    </label>
                </div>
                </div>
                <div class="button-container">
                    <Button id="pass-button" outline color="primary">Enter</Button>
                </div>
            </div>

        );
    }
}

export default AdminHomepage;