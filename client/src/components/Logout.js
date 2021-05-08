import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"


export default class Logout extends Component
{
    constructor(props)
    {
        super(props)
        
        this.state = {
            isLoggedIn:true
        }
    }
    
    
    handleSubmit = (e) => 
    {
        e.preventDefault()
        
        axios.post(`${SERVER_HOST}/logout`)
        .then(res => 
        {     
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                { 
                    console.log("User logged out")
                    localStorage.clear() 
                    
                    this.setState({isLoggedIn:false}) 
                }
            }
            else
            {
                console.log("Logout failed")
            }
        }) 
    }


    render()
    {
        return (
            <div>   
                {parseInt(localStorage.accessLevel) >= parseInt(ACCESS_LEVEL_ADMIN) ? null : <Redirect to="/Login"/>} 
                {!this.state.isLoggedIn ? <Redirect to="/DisplayAllAccounts"/> : null} 
                  
                <LinkInClass value="Log out" className="red-button" onClick={this.handleSubmit}/> 
            </div>
        )
    }
}