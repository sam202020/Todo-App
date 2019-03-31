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
  Button,
  Collapse,
  Modal,
  Typography,
  ListItemIcon
} from "@material-ui/core";

import AddTodoDisplay from "./AddTodoDisplay";

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
    open: false,
    edit: false
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
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

  render() {
    const date = new Date(this.props.date).toDateString();
    return (
      <>
        <ListItem divider>
          <Checkbox
            checked={this.props.checked.includes(this.props._id)}
            onChange={this.setChecked}
          />
          <ListItemText primary={date} />
          <ListItemText
            onClick={this.handleClick}
            classes={{ primary: this.props.classes.title }}
            primary={this.props.title}
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
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div">
            <ListItem button divider={this.props.divider}>
              <ListItemText inset>{this.props.description}</ListItemText>
            </ListItem>
          </List>
        </Collapse>
        <Collapse in={this.state.edit} timeout="auto" unmountOnExit>
          {/* <AddTodoDisplay
            type={"Edit"}
            title={this.props.title}
            description={this.props.description}
            onChange={this.props.onChange}
            addTodo={this.props.editTodo}
          /> */}
          {this.props.children}
        </Collapse>
        <Modal open={this.state.modal}>
          <div className={this.props.classes.modal}>
            <Typography
              variant="h6"
              id="modal-title"
              style={{ textAlign: "center" }}
            >
              Are you sure you would like to delete this ToDo?
            </Typography>

            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: 30, marginRight: 150 }}
              onClick={() => this.handleDelete(this.props._id)}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleModal}
            >
              No
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default withStyles(styles)(TodoDisplay);
