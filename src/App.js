import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  CssBaseline,
  Typography,
  Paper,
  Checkbox,
  List,
  Button,
  Collapse,
  Grid
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import Loader from "react-loader-spinner";
import Auth from "@aws-amplify/auth";
import { withAuthenticator } from "aws-amplify-react";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";

import Layout from "./Components/Layout";
import Logout from "./Components/Logout";
import AddTodoDisplay from "./Components/AddTodoDisplay";
import TodoDisplay from "./Components/TodoDisplay";
import DeleteTodoModal from "./Components/DeleteTodoModal";

const styles = theme => ({
  modal: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`
  }
});

Amplify.configure(awsmobile);

class App extends Component {
  state = {
    loader: true,
    todos: [],
    checked: [],
    deleteModal: false
  };

  getToDos = async () => {
    const accessToken = await this.retrieveCurrentUserAccessToken();
    let data = await axios
      .get("https://todo-api-sam.azurewebsites.net/todos", {
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
    let { todos } = this.state;
    const accessToken = await this.retrieveCurrentUserAccessToken();
    let data = await axios
      .delete(`https://todo-api-sam.azurewebsites.net/todos/delete/${todoID}`, {
        headers: {
          accessToken
        }
      })
      .then(() => {
        this.getToDos().then(todos => {
          this.setState({ todos, deleteModal: false, checked: [] });
        });
      })
      .catch(err => {
        console.error(err);
        alert("Error Deleting Todo");
        this.setState({ todos, deleteModal: false, checked: [] });
      });
    return data;
  };

  addTodo = async (todoID = null, title, description) => {
    const accessToken = await this.retrieveCurrentUserAccessToken();

    let addedTodo = axios
      .post(
        "https://todo-api-sam.azurewebsites.net/todos",
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
          this.setState(state => ({
            addedTodo: state.addedTodo + 1,
            todos
          }));
        });
        return res;
      })
      .catch(err => {
        console.error(err);
        alert("Error Adding Todo", err.message);
        return err;
      });
    return addedTodo;
  };

  editTodo = async (todoID, title, description) => {
    const accessToken = await this.retrieveCurrentUserAccessToken();

    let editedTodo = axios
      .put(
        `https://todo-api-sam.azurewebsites.net/todos/edit/${todoID}`,
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
          this.setState(() => ({
            todos
          }));
        });
        return res;
      })
      .catch(err => {
        console.error(err);
        alert("Error Editing Todo");
        return err;
      });
    return editedTodo;
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

  handleModal = () => {
    this.setState(state => ({ deleteModal: !state.deleteModal }));
  };

  componentDidMount() {
    this.getToDos()
      .then(todos => {
        this.setState({
          loader: false,
          todos
        });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  }

  render() {
    const { username } = this.props.authData;
    const { todos, loader, checked, deleteModal, addedTodo } = this.state;
    if (loader) {
      return (
        <div style={{ position: "fixed", top: "50%", left: "50%" }}>
          <Loader type="Puff" color="#00BFFF" height="100" width="100" />
        </div>
      );
    }
    return (
      <>
      <CssBaseline />
        <Layout>
          <Grid container direction="row" justify="center" alignItems="center">
            <Typography variant="h4">{username}'s ToDos</Typography>
            <Logout logout={this.logout} />
          </Grid>
          <Paper style={{ margin: 16 }}>
            {todos && todos[0] && (
              <List>
                <Grid container direction="row">
                  <Checkbox
                    style={{ marginLeft: 16 }}
                    checked={checked.length === todos.length}
                    onChange={this.setChecked}
                  />{" "}
                  <Collapse
                    in={checked.length > 0}
                    timeout="auto"
                    mountOnEnter
                    unmountOnExit
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={this.handleModal}
                    >
                      Delete <DeleteIcon />
                    </Button>
                  </Collapse>
                </Grid>

                {todos.map((todo, index) => (
                  <TodoDisplay
                    key={todo._id}
                    {...todo}
                    checked={checked}
                    setChecked={this.setIndivChecked}
                    divider={index < todos.length - 1}
                    deleteTodo={this.deleteTodo}
                    editTodo={this.editTodo}
                  />
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
            addedTodo={addedTodo}
          />
        </Layout>
        <DeleteTodoModal
          open={deleteModal}
          multiple={checked.length > 1}
          className={this.props.classes.modal}
          handleModal={this.handleModal}
          deleteTodo={this.deleteTodo}
          todo={checked}
        />
      </>
    );
  }
}

export default withAuthenticator(withStyles(styles)(App));
