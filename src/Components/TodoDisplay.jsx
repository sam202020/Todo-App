import React, { PureComponent } from "react";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import EditOutlined from "@material-ui/icons/EditOutlined";
import {
  List,
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Paper,
  Button,
  Grid
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

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

class TodoDisplay extends PureComponent {
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

  render() {
    const date = new Date(this.props.date).toDateString();
    return (
      <>
        <ListItem onClick={this.handleClick} divider>
          <ListItemText primary={date} />
          <ListItemText
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
              <DeleteOutlined  />
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
          <AddTodoDisplay
            type={"Edit"}
            title={this.props.title}
            description={this.props.description}
            onChange={this.props.onChange}
          />
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
            {/* <Typography variant="subtitle1" id="simple-modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography> */}
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

// const TodoDisplay = memo(props => (
//   <ListItem divider={props.divider}>
//     <Checkbox
//     //   onClick={props.checkBoxToggle}
//     //   checked={props.checked}
//       disableRipple
//     />

//     <ListItemText primary={props.title} />
//     <ListItemSecondaryAction>
//       <IconButton aria-label="Delete Todo" >
//         <DeleteOutlined />
//       </IconButton>
//     </ListItemSecondaryAction>
//   </ListItem>
// ));

// export default TodoDisplay
