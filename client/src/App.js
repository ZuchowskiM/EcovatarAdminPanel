import React, {Component} from "react"
import {BrowserRouter, Switch, Route,} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/App.css"

import SignIn from "./components/SignIn"
import DisplayAllAccounts from "./components/DisplayAllAccounts"
import EditAccount from "./components/EditAccount"
import DeleteAccount from "./components/DeleteAccount"
import AddAccount from "./components/AddAccount"
import PrivateRoute from "./components/PrivateRoute"
import Logout from "./components/Logout"

import {ACCESS_LEVEL_GUEST} from "./config/global_constants"

if (typeof localStorage.accessLevel === "undefined")
{
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
}

export default class App extends Component {
    
    render() 
    {
        return (
            <BrowserRouter>
                <Switch>
					<Route exact path="/Login" component={SignIn}/>
                    <PrivateRoute exact path="/DisplayAllAccounts" component={DisplayAllAccounts}/>
                    <PrivateRoute exact path="/EditAccount/:id" component={EditAccount}/>
                    <PrivateRoute exact path="/DeleteAccount/:id" component={DeleteAccount}/>
                    <PrivateRoute exact path="/AddAccount" component={AddAccount}/>
                    <PrivateRoute exact path="/Logout" component={Logout}/>					
                    <Route exact path="/" component={SignIn} />
                    <Route exact path="*" component={SignIn} />    
                </Switch>
            </BrowserRouter>
        )
    }
}