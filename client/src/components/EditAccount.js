import React, {Component} from "react"
import Form from "react-bootstrap/Form"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"
import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"

export default class EditAccount extends Component 
{
    constructor(props) 
    {
        super(props)

        this.state = {
            id: '',
            username: '',
            coinsCount: '',
            isPremium: '',
            redirectToDisplayAllAccounts:false
        }
    }

    componentDidMount() 
    {      
        this.inputToFocus.focus()

        axios.get(`${SERVER_HOST}/accounts/${this.props.match.params.id}`, {headers:{"authorization":localStorage.token}})
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
                    this.setState({
                        username: res.data.username,
                        coinsCount: res.data.coinsCount,
                        isPremium: res.data.isPremium,
                    })
                }
            }
            else
            {
                console.log(`Record not found`)
            }
        })
    }


    handleChange = (e) => 
    {
        this.setState({[e.target.name]: e.target.value});
        this.validate();
    }


    validateUsername()
    {    
        const pattern = /^[a-zA-Z]([A-Za-z0-9]){3,11}$/;
        return pattern.test(String(this.state.username));
    }

    validateCoinsCount()
    {    
        const pattern = /^[1-9]([0-9]){0,6}$/;
        const patternZero = /^["0"]$/;

        if((pattern.test(String(this.state.coinsCount))
        || patternZero.test(String(this.state.coinsCount))) 
        && parseInt(this.state.coinsCount)>=0
        && parseInt(this.state.coinsCount)<=1000000)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    validate() 
    {
          return {
            username: this.validateUsername(),
            coinsCount: this.validateCoinsCount(),
          };
    }

    handleSubmit = (e) => 
    {
        if(this.validate().username && this.validate().coinsCount)
        {
            e.preventDefault()

            var premium

            if(this.state.isPremium === "YES")
            {
                premium = true;
            }
            else
            {
                premium = false;
            }

            const accountObject = {
                username: this.state.username,
                coinsCount: this.state.coinsCount,
                isPremium: premium,
            }

            axios.put(`${SERVER_HOST}/accounts/${this.props.match.params.id}`, accountObject, {headers:{"authorization":localStorage.token}})
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
                        console.log(`Record updated`)
                        this.setState({redirectToDisplayAllAccounts:true})
                    }
                }
                else
                {
                    console.log(`Record not updated`)
                }
            })
        }
        
    }

    
    render() 
    {  
        if(!this.validate().username && this.state.username !== "")
        {
          var usernameErrorMessage;
          let usernameErrorMessages = [];
          usernameErrorMessages.push("Between 4-12 letters");
          usernameErrorMessages.push("Must start with a-Z");
          usernameErrorMessages.push("Allowed only a-Z and 0-9");
          usernameErrorMessage = <div className="alert alert-danger"><ul>{usernameErrorMessages.map(errorMessage => <li key={usernameErrorMessages.indexOf(errorMessage)}> {errorMessage} </li>)}</ul></div>;
        }

        if(!this.validate().coinsCount && this.state.coinsCount !== "")
        {
          var coinsCountErrorMessage;
          let coinsCountErrorMessages = [];
          coinsCountErrorMessages.push("Integer value between 0-1.000.000");
          coinsCountErrorMessage = <div className="alert alert-danger"><ul>{coinsCountErrorMessages.map(errorMessage => <li key={coinsCountErrorMessages.indexOf(errorMessage)}> {errorMessage} </li>)}</ul></div>;
        }


        return (
            <div className="form-container open-sans-font">
                {parseInt(localStorage.accessLevel) >= parseInt(ACCESS_LEVEL_ADMIN) ? null : <Redirect to="/Login"/>} 
                {this.state.redirectToDisplayAllAccounts ? <Redirect to="/DisplayAllAccounts"/> : null}  
                        
                <Form>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control ref = {(input) => { this.inputToFocus = input }} type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                        {usernameErrorMessage}
                    </Form.Group>

                    <Form.Group controlId="coinsCount">
                        <Form.Label>Coins</Form.Label>
                        <Form.Control type="text" name="coinsCount" value={this.state.coinsCount} onChange={this.handleChange} />
                        {coinsCountErrorMessage}
                    </Form.Group>

                    <Form.Group controlId="isPremium">
                        {/* <Form.Label>is Premium?</Form.Label>
                        <Form.Control type="text" name="isPremium" value={this.state.isPremium} onChange={this.handleChange} /> */}
                        <Form.Label> is Premium? </Form.Label>
                            <Form.Control as="select" type="text" name="isPremium" value={this.state.isPremium} onChange={this.handleChange}>
                                <option>NO</option>
                                <option>YES</option>    
                            </Form.Control>
                    </Form.Group>
  
                    <LinkInClass value="Update" className="green-button" onClick={this.handleSubmit}/>  
    
                    <Link className="red-button" to={"/DisplayAllAccounts"}>Cancel</Link>
                </Form>
            </div>
        )
    }

}