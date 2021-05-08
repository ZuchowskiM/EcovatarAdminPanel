import React from "react";
import {Component} from "react"
import { Redirect } from 'react-router';
import axios from "axios"
import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST, ACCESS_LEVEL_GUEST} from "../config/global_constants"

export default class SignIn extends Component 
{
    
    constructor() 
    {
      super();
      this.state = {
          email: "",
          password: "",
          error: "",
          wasSubmittedAtLeastOnce: false,
          redirect: false,
      }
      this.signInWithEmailAndPasswordHandler=this.signInWithEmailAndPasswordHandler.bind(this);  
    }

    setEmail(email)
    {
        this.setState({email: email});
    }

    setPassword(password)
    {
        this.setState({password: password});
    }


    signInWithEmailAndPasswordHandler(event,email, password)
    {
      if(this.validate().email && this.validate().password)
      {
        const loginObject = {
          email: this.state.email,
          password: this.state.password,
        }

        axios.put(`${SERVER_HOST}/login/${this.state.email}`, loginObject)
        .then(res => 
        {  
          this.setState({wasSubmittedAtLeastOnce: true});
          if(res.data)
          {
            console.log(res.data.message)
            var mess = res.data.message
            
            if (mess === "success")
            {
              localStorage.name = res.data.name
              localStorage.accessLevel = res.data.accessLevel
              localStorage.token = res.data.token

              this.setState({
                redirect: true,
              })

            }
            else
            { 
              //console.log(res.data.errorMessage)
              localStorage.accessLevel = ACCESS_LEVEL_GUEST
              localStorage.token = null
            }
          }
          else
          {
            console.log("authentication failed")
            localStorage.accessLevel = ACCESS_LEVEL_GUEST
            localStorage.token = null
          }
        })
        .catch(error => 
        {
          console.log(error)
          localStorage.accessLevel = ACCESS_LEVEL_GUEST
          localStorage.token = null
        })
      }
        

    };

    onChangeHandler(event)
    {
          const {name, value} = event.currentTarget;
          this.validate();

          if(name === 'userEmail') {
              this.setEmail(value);
          }
          else if(name === 'userPassword'){
            this.setPassword(value);
          }
      };

      validateEmail()
      {    
        const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        return pattern.test(String(this.state.email));
      }


      validatePassword()
      {    
        const pattern = /^(?=.*[0-9]).{6,}$/;
        return pattern.test(String(this.state.password));
        //return true; 
      }


      validate() 
      {
          return {
            email: this.validateEmail(),
              password: this.validatePassword()
          };
      }


    render() 
    {
        if (this.state.redirect) {
            return <Redirect push to="/DisplayAllAccounts" />;
          }
        
        

        if(!this.validate().email)
        {
          var emailErrorMessage;
          let emailErrorMessages = [];
          emailErrorMessages.push("This is not a valid email format");
          emailErrorMessage = <div className="error"><ul>{emailErrorMessages.map(errorMessage => <li key={emailErrorMessages.indexOf(errorMessage)}> {errorMessage} </li>)}</ul></div>;
        }

        if(!this.validate().password)
        {
          var passwordErrorMessage;
          let passwordErrorMessages = [];
          if(this.state.password.length < 6)
          {
            passwordErrorMessages.push("Password must be at least six characters long.");
          }
          if(!this.state.password.match(/[0-9]/))
          {
            passwordErrorMessages.push("Password must contain at least one digit (0-9).");
          }
          if(!this.state.password.match(/[A-Z]/))
          {
            passwordErrorMessages.push("Password must contain at least one uppercase character.");
          }
          passwordErrorMessage = <div className="error"><ul>{passwordErrorMessages.map(errorMessage => <li key={passwordErrorMessages.indexOf(errorMessage)}> {errorMessage} </li>)}</ul></div>;      

        }

        if(this.state.wasSubmittedAtLeastOnce)
        {
            var errorMessage = <div className="error">Login Details are incorrect<br/></div>;
        }


        return (
          <div className = "loginScreen">
            <h1 className="p-5 text-center bg-success">
              Ecovatar Admin Panel
            </h1>
            <div id = "loginForm">
              <h1>Sign In</h1>
              {errorMessage}
              <div>
                {this.state.error !== null && <div>{this.state.error}</div>}
                <form className="">
                  <label htmlFor="userEmail">
                    Email:
                  </label><br></br>
                  <input
                    type="email"
                    name="userEmail"
                    value = {this.state.email}
                    placeholder="E.g: john123@gmail.com"
                    id="userEmail"
                    onChange = {(event) => this.onChangeHandler(event)}
                  />
                  {emailErrorMessage}
                  <label htmlFor="userPassword">
                    Password:
                  </label><br></br>
                  <input
                    type="password"
                    name="userPassword"
                    value = {this.state.password}
                    placeholder="Your Password"
                    id="userPassword"
                    onChange = {(event) => this.onChangeHandler(event)}
                  />
                  {passwordErrorMessage}
                  <LinkInClass value="Sign In" className="green-button" onClick={this.signInWithEmailAndPasswordHandler}/>  
                </form>
                {/* <p>or</p>
                <button>
                  Sign in with Google
                </button>
                <p>
                  Don't have an account?{" "}
                  <Link to="signUp">
                    Sign up here
                  </Link>{" "}
                  <br/>{" "}
                  <Link to = "passwordReset">
                    Forgot Password?
                  </Link>
                </p> */}
              </div>
            </div>
            </div>
          );
    }
  
};

