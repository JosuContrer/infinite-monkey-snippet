import React, { Component } from 'react';
import logo from './logo.png'
import {Table, Button} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faThumbsUp, faThumbsDown, faImage, faMoneyCheckAlt, faSearchDollar} from '@fortawesome/free-solid-svg-icons'
import AceEditor from "react-ace";


import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

class App extends Component {
    state = { 
        isLoading : false,
        invoices : [
            {
                "id" : "100",
                "Vendor" : "Niko",
                "Amount" : "319",
                "Invoice #" : "1231",
                "Date" : "08/20/10"
            },
            {
                "id" : "200",
                "Vendor" : "Liam",
                "Amount" : "90",
                "Invoice #" : "3453",
                "Date" : "06/10/16"
            },
            {
                "id" : "300",
                "Vendor" : "Deep",
                "Amount" : "545",
                "Invoice #" : "85869",
                "Date" : "05/10/19"
            },
        ]
    }
    
    remove(id){
        let update = [...this.state.invoices].filter(i => i.id != id)
        this.setState({invoices : update})
    }

    render() {
        const isLoading = this.state.isLoading;
        const allInvoices = this.state.invoices;
        
        if(isLoading){
            return(<div>Loading...</div>)
        }

        let invoices = allInvoices.map(invoice =>
            <tr key={invoice.id}>
                <td>{invoice.Vendor}</td>
                <td>{invoice.Amount}</td>
                <td>{invoice["Invoice #"]}</td>
                <td>{invoice.Date}</td>
                <td><Button className="btn btn-lg btn-success" onClick={() => this.remove(invoice.id)}>
                        <FontAwesomeIcon icon={faThumbsUp} /> OK
                    </Button></td>
                <td><Button className="btn btn-lg btn-danger" onClick={() => this.remove(invoice.id)}>
                    <FontAwesomeIcon icon={faThumbsDown} />NOK</Button></td>
                <td><Button className="btn btn-lg btn-info" onClick={() => this.remove(invoice.id)}>
                    <FontAwesomeIcon icon={faMoneyCheckAlt} />50%</Button></td>
                <td><Button className="btn btn-lg btn-warning" onClick={() => this.remove(invoice.id)}>
                    <FontAwesomeIcon icon={faSearchDollar} />??</Button></td>
                <td><Button className="btn btn-lg btn-info" onClick={() => this.remove(invoice.id)}>
                    <FontAwesomeIcon icon={faImage} />Image</Button></td>
            </tr>


        )

        function onChange(newValue) {
            console.log("change", newValue);
          }

        return (  
            <div className="container border border-secondary rounded center">
                <div className="row">
                    <div className="col-12">
                        <img src={logo} className="Main-logo" height="400px" width="auto"/>
                        <h>This is the Start of Infinite Monkey</h>
                    </div>
                </div>
                <div className="row">
                    <div className=".col-xs-12 center text-center">
                        <Table dark responsive striped bordered hover>
                            <thead>
                                <th>Vendor</th>
                                <th>Amount</th>
                                <th>Invoice #</th>
                                <th>Date</th>
                                <th colSpan="4">Actions</th>
                                <th>Image</th>
                            </thead>
                            <tbody>
                                {this.state.invoices.length === 0 ? <td colSpan="9">All caught up</td> : invoices}
                            </tbody>

                        </Table>
                    </div>
                </div>
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
            
        );
    }
}
 
export default App;