import React, { Component } from "react";
import Signin from "./Components/Signin";
import "./App.css";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import Logout from "./Components/Logout";
import { Container, Row, Col } from "reactstrap";
import Todo from "./Components/Todo";
import AddTodo from "./Components/AddTodo";
import axios from "axios";

const poolData = {
  UserPoolId: "us-east-2_Gu32DUJYY",
  ClientId: "6rljq8ni43uhggokqh9mr51b3v"
};

const userPool = new CognitoUserPool(poolData);
const cognitoUser = userPool.getCurrentUser();

class App extends Component {
  state = {
    username: "",
    password: "",
    loader: false,
    user: "",
    title: "",
    description: "",
    todos: null
  };

  getToDos = async () => {
    const accessToken = await this.retrieveCurrentUser();
    let data = await axios
      .get("http://localhost:3001/todos", {
        headers: {
          accessToken: accessToken.accessToken.jwtToken
        }
      })
      .then(res => {
        return res.data;
      })
      .catch(err => console.error(err));

    return data;
  };

  addTodo = async () => {
    const { title, description } = this.state;
    const accessToken = await this.retrieveCurrentUser();

    axios
      .post(
        "http://localhost:3001/todos",
        {
          title,
          description
        },
        {
          headers: {
            accessToken: accessToken.accessToken.jwtToken
          }
        }
      )
      .then(res => console.log(res))
      .catch(err => console.error(err));
  };

  retrieveCurrentUser = () => {
    if (cognitoUser != null) {
      let session = cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          this.setState({ loader: false });
          return;
        } else {
          console.log(session);
          return session;
        }
        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        // cognitoUser.getUserAttributes(function(err, attributes) {
        //   if (err) {
        //     // Handle error
        //   } else {
        //     // Do something with attributes
        //   }
        // });

        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //   IdentityPoolId: "...", // your identity pool id here
        //   Logins: {
        //     // Change the key below according to the specific region your user pool is in.
        //     "cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>": session
        //       .getIdToken()
        //       .getJwtToken()
        //   }
        // });

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
      });
      return session;
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  displayTodos = numTodos => {};

  loadTodos = () => {};

  login = e => {
    e.preventDefault();
    const { username, password } = this.state;
    var authenticationData = {
      Username: username,
      Password: password
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var userPool = new CognitoUserPool(poolData);
    var userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        var accessToken = result.getAccessToken().getJwtToken();
        var cognitoUser = userPool.getCurrentUser();
        this.setState({ user: cognitoUser });

        // this.setState({user: })
        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        // AWS.config.region = '<region>';

        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId : '...', // your identity pool id here
        //     Logins : {
        //         // Change the key below according to the specific region your user pool is in.
        //         'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>' : result.getIdToken().getJwtToken()
        //     }
        // });

        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        // AWS.config.credentials.refresh((error) => {
        //     if (error) {
        //          console.error(error);
        //     } else {
        //          // Instantiate aws sdk service objects now that the credentials have been updated.
        //          // example: var s3 = new AWS.S3();
        //          console.log('Successfully logged!');
        //     }
        // });
      },

      onFailure: function(err) {
        alert(err.message || JSON.stringify(err));
      }
    });
  };

  logout = () => {
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    this.setState({ user: "" });
  };

  componentDidMount() {
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          this.setState({ loader: false });
          return;
        }
        this.getToDos().then(todos => {
          console.log(todos);
          this.setState({ loader: false, user: cognitoUser, todos });
        });

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        // cognitoUser.getUserAttributes(function(err, attributes) {
        //   if (err) {
        //     // Handle error
        //   } else {
        //     // Do something with attributes
        //   }
        // });

        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //   IdentityPoolId: "...", // your identity pool id here
        //   Logins: {
        //     // Change the key below according to the specific region your user pool is in.
        //     "cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>": session
        //       .getIdToken()
        //       .getJwtToken()
        //   }
        // });

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
      });
    }
  }
  render() {
    const { user, username, password, todos } = this.state;
    console.log(user);
    if (user) {
      return (
        <Container>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>hello {user.username}</Col>
            <Col sm="3">
              <Logout logout={this.logout} />
            </Col>
          </Row>
          <Row>
            {this.state.todos &&
              this.state.todos.map(todo => (
                <Todo
                  key={todo._id}
                  title={todo.title}
                  description={todo.description}
                  date={todo.date}
                />
              ))}
          </Row>
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              <AddTodo
                onChange={this.onChange}
                title={this.title}
                description={this.description}
                addTodo={this.addTodo}
              />
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <>
          <Signin
            login={this.login}
            onChange={this.onChange}
            username={username}
            password={password}
          />
        </>
      );
    }
  }
}

export default App;
