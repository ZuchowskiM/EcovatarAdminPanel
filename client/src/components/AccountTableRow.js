import React, {Component} from "react"
import {Redirect, Link } from "react-router-dom";
import {ACCESS_LEVEL_ADMIN} from "../config/global_constants"

export default class AccountTableRow extends Component 
{  
    
    constructor(props) 
    {
        super(props)
        
        this.state = {
            premiumInfo: "",
        }
    }

    componentDidMount()
    {
        

        if(this.props.accounts.isPremium.toString() === "true")
        {
            this.setState({premiumInfo: "YES"});
        }
        else
        {
            this.setState({premiumInfo: "NO"});
        }
    }
    

    render() 
    {
        return (
            <tr>
                {parseInt(localStorage.accessLevel) >= parseInt(ACCESS_LEVEL_ADMIN) ? null : <Redirect to="/Login"/>} 
                <td>{this.props.accounts.id}</td>
                <td>{this.props.accounts.username}</td>
                <td>{this.props.accounts.coinsCount}</td>
                <td>{this.state.premiumInfo}</td>
                <td>{new Date(this.props.accounts.lastLogin.seconds * 1000).toISOString().slice(0,10)}</td>
                {/* <td>{this.props.accounts.lastLogin.toString()}</td> DEBUG */}
                <td>
                    <Link className="green-button" to={"/EditAccount/" + this.props.accounts.id}>Edit</Link>     
                    <Link className="red-button" to={"/DeleteAccount/" + this.props.accounts.id}>Delete</Link>    
                </td>
            </tr>
        )
    }
}