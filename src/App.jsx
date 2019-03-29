import React, { Component, memo } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import Auth from "@aws-amplify/auth";
import { withAuthenticator } from "aws-amplify-react";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";

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

class App extends Component {
  state = {
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

  deleteTodo = async todoID => {
    const accessToken = await this.retrieveCurrentUser();
    let data = await axios
      .delete(`http://localhost:3001/todos/delete/${todoID}`, {
        headers: {
          accessToken: accessToken.accessToken.jwtToken
        }
      })
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
        alert("Error Deleting Todo");
      });

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

  editTodo = async todoID => {
    const { title, description } = this.state;
    const accessToken = await this.retrieveCurrentUser();

    axios
      .put(
        `http://localhost:3001/todos/${todoID}`,
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
        alert("Error Editing Todo");
      });
  };

  retrieveCurrentUser = async () => {
    let cognitoUser = await userPool.getCurrentUser();
    let session = cognitoUser.getSession((err, session) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      } else {
        return session;
      }
    });
    return session;
  };

  logout = async () => {
    await Auth.signOut();
  };

  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();
    this.getToDos().then(todos => {
      this.setState({
        loader: false,
        todos
      });
    });
  }

  render() {
    const { password, todos, loader } = this.state;
    const { username } = this.props.authData;
    if (loader) {
      return <Loader type="Puff" color="#00BFFF" height="100" width="100" />;
    }
    return (
      <Layout>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
        <h2 style={{ textAlign: "center" }}>{username}'s Todos</h2>
        <Logout logout={this.logout} /></div>
        {todos && <TodoList todos={todos} deleteTodo={this.deleteTodo} onChange={this.onChange}/>}
        <AddTodoDisplay
          type={"Add"}
          onChange={this.onChange}
          title={this.state.title}
          description={this.state.description}
          addTodo={this.addTodo}
        />
      </Layout>
    );
  }
}

export default withAuthenticator(App);
