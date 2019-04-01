import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import EditOutlined from "@material-ui/icons/EditOutlined";
import {
  List,
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  ListItemIcon
} from "@material-ui/core";

import AddTodoDisplay from "./AddTodoDisplay";
import DeleteTodoModal from "./DeleteTodoModal";

const styles = theme => ({
  title: {
    fontWeight: "bold",
    cursor: "pointer"
  },
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

class TodoDisplay extends Component {
  state = {
    modal: false,
    descriptionDisplayed: false,
    edit: false
  };

  //Toggles display of description text:

  handleDescription = () => {
    this.setState(state => ({
      descriptionDisplayed: !state.descriptionDisplayed
    }));
  };

  handleModal = () => {
    this.setState(state => ({ modal: !state.modal }));
  };

  handleDelete = async id => {
    this.props.deleteTodo(id);
    this.handleModal();
  };

  handleEdit = () => {
    this.setState(state => ({ edit: !state.edit }));
  };

  setChecked = (e, checked) => {
    this.props.setChecked(checked, this.props._id);
  };

  editTodo = async (id, title, description) => {
    let edited = await this.props.editTodo(id, title, description);
    if (edited.status === 200) {
      this.handleEdit();  // Close the edit todo dialog if todo was successfully edited.
      return 200;
    }
    return "error";
  };

  render() {
    const date = new Date(this.props.date).toDateString();
    const { title, description, _id, checked, classes, divider } = this.props;
    const { descriptionDisplayed, modal, edit } = this.state;
    return (
      <>
        <ListItem divider>
          <Checkbox
            checked={checked.includes(_id)}
            onChange={this.setChecked}
          />
          <ListItemText primary={date} />
          <ListItemText
            onClick={this.handleDescription}
            classes={{ primary: classes.title }}
            primary={title}
          />
          <ListItemIcon>
            <IconButton
              aria-label="Edit Todo"
              onClick={this.handleEdit}
              style={{ cursor: "pointer" }}
            >
              <EditOutlined />
            </IconButton>
          </ListItemIcon>
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete Todo" onClick={this.handleModal}>
              <DeleteOutlined />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={descriptionDisplayed} timeout="auto" unmountOnExit>
          <List component="div">
            <ListItem button divider={divider}>
              <ListItemText inset>{description}</ListItemText>
            </ListItem>
          </List>
        </Collapse>
        <Collapse in={edit} timeout="auto" mountOnEnter unmountOnExit>
          <AddTodoDisplay
            _id={_id}
            title={title}
            description={description}
            type={"Edit"}
            changeTodo={this.editTodo}
          />
        </Collapse>

        <DeleteTodoModal
          open={modal}
          multiple={false}
          className={classes.modal}
          handleModal={this.handleModal}
          deleteTodo={this.handleDelete}
          todo={_id}
        />
      </>
    );
  }
}

export default withStyles(styles)(TodoDisplay);
