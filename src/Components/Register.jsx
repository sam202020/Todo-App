import React, { Component } from 'react'
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
  } from "amazon-cognito-identity-js";
  import * as AWS from "aws-sdk/global";
  
const poolData = {
    UserPoolId: "us-east-2_Gu32DUJYY", // Your user pool id here
    ClientId: "6rljq8ni43uhggokqh9mr51b3v" // Your client id here
  };
export default class Register extends Component {


    doRegister = e => {
        var userPool = new CognitoUserPool(poolData);
        var email = this.email.value;
        var username = this.username.value;
        var phone = this.phone.value;
        var password = this.password.value;
    
        var attributeList = [];
    
        var dataEmail = {
          Name: "email",
          Value: email
        };
    
        var dataPhoneNumber = {
          Name: "phone_number",
          Value: phone
        };
    
        var dataPreferredUsername = {
          Name: "preferred_username",
          Value: username
        };
    
        var attributeEmail = new CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
        var attributePreferredUsername = new CognitoUserAttribute(
          dataPreferredUsername
        );
    
        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);
        attributeList.push(attributePreferredUsername);
    
        console.log(userPool);
    
        userPool.signUp(username, password, attributeList, null, function(
          err,
          result
        ) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          var cognitoUser = result.user;
          console.log("user name is " + cognitoUser.getUsername());
        });
      };
  render() {
    return (
      <div>
        <div className="App">
        <input
          type="text"
          placeholder="email"
          ref={input => {
            this.email = input;
          }}
        />
        <input
          type="text"
          placeholder="username"
          ref={input => {
            this.username = input;
          }}
        />
        <input
          type="text"
          placeholder="phone"
          ref={input => {
            this.phone = input;
          }}
        />
        <input
          type="password"
          placeholder="password"
          ref={input => {
            this.password = input;
          }}
        />

        <button onClick={e => this.doRegister(e)} />
        <br />

        <input
          type="text"
          placeholder="code"
          ref={input => {
            this.code = input;
          }}
        />
        <button onClick={e => this.doConfirm(e)} />
        <br />
        <button onClick={e => this.doLogin(e)} />
      </div>
      </div>
    )
  }
}
