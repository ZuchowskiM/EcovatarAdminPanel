import React, {Component} from "react"
import AccountTableRow from "./AccountTableRow"
import {Redirect, Link } from "react-router-dom";
import {ACCESS_LEVEL_ADMIN} from "../config/global_constants"

export default class AccountTable extends Component 
{

    constructor(props) 
    {
        super(props)
        
        this.state = {
            sortIDAscending: true,
            sortUsernameAscending: true,
            sortCoinsCountAscending: true,
            sortPremiumAscending: true,
            sortLastLoginAscending: true,
            defaultSorting: true,
        }
    }

    handleSortingID = (e) => 
    {
        this.setState({defaultSorting: false});

        if(this.state.sortIDAscending === true)
        {
            
            this.setState({sortIDAscending: false});
        }
        else
        {
            this.setState({sortIDAscending: true});
        }
        this.props.accounts.sort((a,b) => parseInt(a.id) < parseInt(b.id) ? this.state.sortIDAscending : !this.state.sortIDAscending);
           
    }

    handleSortingUsername = (e) => 
    {
        this.setState({defaultSorting: false});

        if(this.state.sortUsernameAscending === true)
        {
            this.setState({sortUsernameAscending: false});
        }
        else
        {
            this.setState({sortUsernameAscending: true});
        }
        this.props.accounts.sort((a,b) => a.username < b.username ? this.state.sortUsernameAscending : !this.state.sortUsernameAscending)
    }

    handleSortingCoinsCount = (e) => 
    {
        this.setState({defaultSorting: false});

        if(this.state.sortCoinsCountAscending === true)
        {
            this.setState({sortCoinsCountAscending: false});
        }
        else
        {
            this.setState({sortCoinsCountAscending: true});
        }

        this.props.accounts.sort((a,b) => parseInt(a.coinsCount) < parseInt(b.coinsCount) ? this.state.sortCoinsCountAscending : !this.state.sortCoinsCountAscending)
    }

    handleSortingPremium = (e) => 
    {
        this.setState({defaultSorting: false});

        if(this.state.sortPremiumAscending === true)
        {
            this.setState({sortPremiumAscending: false});
        }
        else
        {
            this.setState({sortPremiumAscending: true});
        }
        this.props.accounts.sort((a,b) => a.isPremium < b.isPremium ? this.state.sortPremiumAscending : !this.state.sortPremiumAscending)
    }

    handleSortingLastLogin = (e) => 
    {
        this.setState({defaultSorting: false});

        if(this.state.sortLastLoginAscending === true)
        {
            this.setState({sortLastLoginAscending: false});
        }
        else
        {
            this.setState({sortLastLoginAscending: true});
        }
        this.props.accounts.sort((a,b) => a.lastLogin.seconds > b.lastLogin.seconds ?
         this.state.sortLastLoginAscending : !this.state.sortLastLoginAscending)
    }

    render() 
    {
        
        if(this.state.defaultSorting)
        {
            this.props.accounts.sort((a,b) => parseInt(a.id) > parseInt(b.id) ? this.state.sortIDAscending : !this.state.sortIDAscending);
        }

        return (
            <table className="table table-striped table-light table-bordered table-hover table-sm text-center">
                {parseInt(localStorage.accessLevel) >= parseInt(ACCESS_LEVEL_ADMIN) ? null : <Redirect to="/Login"/>} 
                <thead>
                    <tr className="thead-dark no-gutters">
                        <th scope="col" onClick={this.handleSortingID}>#</th>
                        <th scope="col" onClick={this.handleSortingUsername}>User name</th>
                        <th scope="col" onClick={this.handleSortingCoinsCount}>Coins</th>
                        <th scope="col" onClick={this.handleSortingPremium}>Premium Account</th>
                        <th scope="col" onClick={this.handleSortingLastLogin}>Last login</th>
                        <th scope="col" className="fixed-th"><Link className="blue-button" to={"/AddAccount"}>Add account</Link></th>
                    </tr>
                </thead>
                  
                <tbody>
                    {this.props.accounts.filter(account => account.username.toLowerCase().includes(this.props.filter.toLowerCase()))
                    .map((accounts) => <AccountTableRow key={accounts.id} accounts={accounts}/>)}
                </tbody>
            </table>      
        )
    }
}