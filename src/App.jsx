import React, { Component, memo } from "react";
// import {
//   CognitoUserPool,
//   CognitoUserAttribute,
//   CognitoUser,
//   AuthenticationDetails
// } from "amazon-cognito-identity-js";
// import * as AWS from "aws-sdk/global";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import axios from "axios";
import Loader from "react-loader-spinner";

import Auth from '@aws-amplify/auth';
import { withAuthenticator } from "aws-amplify-react";
import Amplify from "aws-amplify";
import awsmobile from './aws-exports';
import Layout from "./Components/Layout";
import Signin from "./Components/Signin";
import Logout from "./Components/Logout";
import AddTodoDisplay from "./Components/AddTodoDisplay";
import Todo from "./Components/Todo";
import TodoDisplay from "./Components/TodoDisplay";
import TodoList from "./Components/TodoList";

Amplify.configure(awsmobile);

const poolData = {
  UserPoolId: "us-east-1_8lJlnr1IK",
  ClientId: "6d785s2ejh7sr2f59bcgtgv818"
};

const userPool = new CognitoUserPool(poolData);
const cognitoUser = userPool.getCurrentUser();

class App extends Component {
  state = {
    username: "",
    password: "",
    loader: true,
    title: "",
    description: "",
    todos: null
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
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
      .catch(err => {
        console.error(err);
        alert("Error Retrieving Todos");
      });

    return data;
  };

  // deleteTodo = async todoID => {
  //   const accessToken = await this.retrieveCurrentUser();
  //   let data = await axios
  //     .delete(`http://localhost:3001/todos/delete/${todoID}`, {
  //       headers: {
  //         accessToken: accessToken.accessToken.jwtToken
  //       }
  //     })
  //     .then(res => {
  //       this.getToDos().then(todos => {
  //         this.setState({
  //           loader: false,
  //           username: cognitoUser.username,
  //           todos
  //         });
  //       });
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       alert("Error Deleting Todo");
  //     });

  //   return data;
  // };

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
      .then(res => {
        this.getToDos().then(todos => {
          this.setState({
            loader: false,
            todos
          });
        });
      })
      .catch(err => {
        console.error(err);
        alert("Error Adding Todo");
      });
  };

  // editTodo = async todoID => {
  //   const { title, description } = this.state;
  //   const accessToken = await this.retrieveCurrentUser();

  //   axios
  //     .put(
  //       `http://localhost:3001/todos/${todoID}`,
  //       {
  //         title,
  //         description
  //       },
  //       {
  //         headers: {
  //           accessToken: accessToken.accessToken.jwtToken
  //         }
  //       }
  //     )
  //     .then(res => {
  //       this.getToDos().then(todos => {
  //         this.setState({
  //           loader: false,
  //           username: cognitoUser.username,
  //           todos
  //         });
  //       });
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       alert("Error Editing Todo");
  //     });
  // };

  retrieveCurrentUser = () => {
    if (cognitoUser != null) {
      let session = cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        } else {
          return session;
        }
      });
      return session;
    }
  };

  // login = e => {
  //   e.preventDefault();
  //   const { username, password } = this.state;
  //   let authenticationData = {
  //     Username: username,
  //     Password: password
  //   };
  //   let authenticationDetails = new AuthenticationDetails(authenticationData);

  //   let userPool = new CognitoUserPool(poolData);
  //   let userData = {
  //     Username: username,
  //     Pool: userPool
  //   };
  //   let cognitoUser = new CognitoUser(userData);
  //   cognitoUser.authenticateUser(authenticationDetails, {
  //     onSuccess: result => {
  //       let accessToken = result.getAccessToken().getJwtToken();
  //       let cognitoUser = userPool.getCurrentUser();
  //       this.setState({ username: cognitoUser.username });
  //     },

  //     onFailure: function(err) {
  //       alert(err.message || JSON.stringify(err));
  //     }
  //   });
  // };

  // logout = () => {
  //   cognitoUser.signOut();
  //   this.setState({ username: "" });
  // };

  componentDidMount() {
    if (cognitoUser != null) {
      console.log(cognitoUser);
      cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          this.setState({ loader: false });
          return;
        }
        this.getToDos().then(todos => {
          console.log(todos);
          this.setState({
            loader: false,
            username: cognitoUser.username,
            todos
          });
        });
      });
    } else {
      this.setState({ loader: false });
    }
  }

  render() {
    const { username, password, todos, loader } = this.state;
    // if (loader) {
    //   return <Loader type="Puff" color="#00BFFF" height="100" width="100" />;
    // }
    // if (username) {
      return (
        <Layout>
          <h2 style={{ textAlign: "center" }}>{this.props.authData.username}'s Todos</h2>
          <Logout logout={this.logout} />
          {todos && <TodoList todos={todos} deleteTodo={this.deleteTodo} />}
          <AddTodoDisplay
            onChange={this.onChange}
            title={this.state.title}
            description={this.state.description}
            addTodo={this.addTodo}
          />
        </Layout>
      );
    // } else {
    //   return (
    //     <Layout>
    //       <Signin
    //         login={this.login}
    //         onChange={this.onChange}
    //         username={username}
    //         password={password}
    //       />
    //     </Layout>
    //   );
    //}
  }
}

export default withAuthenticator(App);
