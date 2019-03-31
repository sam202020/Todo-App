import React, { Component } from "react";
import {
  Typography,
  Toolbar,
  Paper,
  Checkbox,
  List,
  Button,
  Collapse
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import Loader from "react-loader-spinner";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import Auth from "@aws-amplify/auth";
import { withAuthenticator } from "aws-amplify-react";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";

import Layout from "./Components/Layout";
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
    todos: [],
    checked: []
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getToDos = async () => {
    const accessToken = await this.retrieveCurrentUserAccessToken();
    let data = await axios
      .get("http://localhost:3001/todos", {
        headers: {
          accessToken
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
    const accessToken = this.retrieveCurrentUserAccessToken();
    let data = await axios
      .delete(`http://localhost:3001/todos/delete/${todoID}`, {
        headers: {
          accessToken
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

  // deleteMultipleTodos = async todoID => {
  //   const accessToken = this.retrieveCurrentUserAccessToken();
  //   let data = await axios
  //     .delete(`http://localhost:3001/todos/delete/`, {

  //     } {
  //       headers: {
  //         accessToken
  //       }
  //     })
  //     .then(res => {
  //       this.getToDos().then(todos => {
  //         this.setState({
  //           loader: false,
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

  addTodo = async (title, description) => {
    console.log(title, description)
    const accessToken = await this.retrieveCurrentUserAccessToken();

    axios
      .post(
        "http://localhost:3001/todos",
        {
          title,
          description
        },
        {
          headers: {
            accessToken
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

  editTodo = todoID => (title, description) => {
    const accessToken = this.retrieveCurrentUserAccessToken();

    axios
      .put(
        `http://localhost:3001/todos/${todoID}`,
        {
          title,
          description
        },
        {
          headers: {
            accessToken
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

  retrieveCurrentUserAccessToken = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const accessToken = user.signInUserSession.accessToken.jwtToken;
    return accessToken;
  };

  logout = async () => {
    await Auth.signOut();
  };

  setChecked = (e, checked) => {
    const ids = this.state.todos.map(todo => todo._id);
    if (checked === true) {
      this.setState({ checked: ids });
    } else {
      this.setState({ checked: [] });
    }
  };

  setIndivChecked = (checked, id) => {
    let ids = this.state.checked.map(id => id);
    if (checked === true) {
      ids.push(id);
      this.setState({ checked: ids });
    } else {
      let newids = ids.filter(i => i !== id);
      this.setState({ checked: newids });
    }
  };

  componentDidMount() {
    this.getToDos()
      .then(todos => {
        this.setState({
          loader: false,
          todos
        });
      })
      .catch(err => {
        this.setState({ loader: false });
      });
  }

  render() {
    const { username } = this.props.authData;
    const { todos, loader, checked } = this.state;
    if (loader) {
      return (
        <div style={{ position: "fixed", top: "50%", left: "50%" }}>
          <Loader type="Puff" color="#00BFFF" height="100" width="100" />
        </div>
      );
    }
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: 10
          }}
        >
          <h2 style={{ textAlign: "center" }}>{username}'s Todos</h2>
          <Logout logout={this.logout} />
        </div>
        <Paper style={{ margin: 16 }}>
          {todos[0] && (
            <List>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Checkbox
                  style={{ marginLeft: 16 }}
                  checked={checked.length === todos.length}
                  onChange={this.setChecked}
                />{" "}
                <Collapse in={checked.length > 0} timeout="auto" unmountOnExit>
                  <Button variant="contained" color="secondary">
                    Delete <DeleteIcon />
                  </Button>
                </Collapse>
              </div>
              {todos.map((todo, index) => (
                <TodoDisplay
                  {...todo}
                  button={this.state.button}
                  key={todo._id}
                  checked={checked}
                  setChecked={this.setIndivChecked}
                  divider={index < todos.length - 1}
                  deleteTodo={this.deleteTodo}
                  onChange={this.onChange}
                >
                  <AddTodoDisplay
                    type={"Edit"}
                    addTodo={this.editTodo}
                  />
                </TodoDisplay>
              ))}
            </List>
          )}
        </Paper>
        <Typography variant="h6" style={{ textAlign: "center" }}>
          Add A ToDo
        </Typography>
        <AddTodoDisplay
          type={"Add"}
          changeTodo={this.addTodo}
        />
      </Layout>
    );
  }
}

export default withAuthenticator(App);
