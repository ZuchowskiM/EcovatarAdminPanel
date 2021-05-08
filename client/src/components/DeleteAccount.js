import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import {SERVER_HOST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"


export default class DeleteAccount extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            redirectToDisplayAllAccounts:false,
            redirectToDisplayLogin: false
        }
    }
    
    
    componentDidMount() 
    {   
        axios.delete(`${SERVER_HOST}/accounts/${this.props.match.params.id}`, {headers:{"authorization":localStorage.token}})
        .then(res => 
        {
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)
                    this.setState({redirectToDisplayLogin:true})    
                }
                else // success
                { 
                    console.log("Record deleted")
                }
                this.setState({redirectToDisplayAllAccounts:true})
            }
            else 
            {
                console.log("Record not deleted")
            }
        })
    }
  
  
    render() 
    {
        return (
            <div>
                {parseInt(localStorage.accessLevel) >= parseInt(ACCESS_LEVEL_ADMIN) ? null : <Redirect to="/Login"/>}    
                {this.state.redirectToDisplayAllAccounts ? <Redirect to="/DisplayAllAccounts"/> : null}
                {this.state.redirectToDisplayLogin ? <Redirect to="/Login"/> : null}                       
            </div>
        )
    }
}