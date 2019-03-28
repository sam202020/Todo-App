import React, { memo, PureComponent } from "react";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
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
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  title: {
    fontWeight: "bold",
    paddingLedt: 20
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

// function getModalStyle() {
//   const top = 50
//   const left = 50

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`
//   };
// }
class TodoDisplay extends PureComponent {
  state = {
    modal: false,
    open: true
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleModal = () => {
    this.setState(state => ({ modal: !state.modal }));
  };

  handleDelete = async (id) => {
    this.props.deleteTodo(id);
    // console.log(didDelete)
    // if (didDelete._id === id) {
    //     this.handleModal();
    // }
    this.handleModal();
  }

  render() {
    return (
      <>
        <ListItem onClick={this.handleClick} divider>
          <ListItemText
            classes={{ primary: this.props.classes.title }}
            primary={this.props.title}
          />
          <ListItemSecondaryAction onClick={this.handleModal}>
            <IconButton aria-label="Delete Todo">
              <DeleteOutlined />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div">
            <ListItem button divider={this.props.divider}>
              <ListItemText inset style={{ paddingLeft: 50 }}>
                {this.props.description}
              </ListItemText>
            </ListItem>
          </List>
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
              onClick={()=>this.handleDelete(this.props._id)}
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
