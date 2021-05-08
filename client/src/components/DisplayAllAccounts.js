import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"
import AccountTable from "./AccountTable"
import Logout from "./Logout"

export default class DisplayAllAccounts extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            accountsData:[],
            usernameFilter: '',
            redirectToLogin: false
        }
    }
    
   
    componentDidMount() 
    {
        var accountsData = [];
        axios.get(`${SERVER_HOST}/accounts/`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {
           
            if(res.data.errorMessage === 'User is not logged in')
            {
                console.log(res.data.errorMessage)
                this.setState({redirectToLogin: true})
            }
            else
            {
                console.log(res.data)
                accountsData = res.data
                this.setState({accountsData: accountsData})
            }
            
        }).catch(error => {
            console.log(error)
            this.setState({redirectToLogin: true})
        })         
    }

    filterByUsername(event)
    {
        const {value} = event.currentTarget;
        this.setState({usernameFilter: value});
    }
   
 
    render() 
    {   
        return (           
            //<div className="form-container">
            <div className="row ml-1 mr-1 mt-3 open-sans-font">
                <div className="col-md-6">
                    <input className="form-control"
                        name="usernameFilter"
                        value = {this.state.usernameFilter}
                        placeholder="username filter"
                        id="usernameFilter"
                        onChange = {(event) => this.filterByUsername(event)}
                    />
                </div>
                <div className="col-md-4">
                </div>
                <div className="col-md-2">
                    <ul>
                        <Logout logout/>
                    </ul>
                </div>
                {parseInt(localStorage.accessLevel) >= parseInt(ACCESS_LEVEL_ADMIN) ? null : <Redirect to="/Login"/>}
                {this.state.redirectToLogin ? <Redirect to="/Login"/> : null}
                <div className="col-md-12">
                    <AccountTable accounts={this.state.accountsData} filter={this.state.usernameFilter}/> 
                </div>
            </div>
			
        )
    }
}