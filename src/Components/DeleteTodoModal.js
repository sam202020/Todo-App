import React from "react";
import { Button, Modal, Typography } from "@material-ui/core";

// This component renders a dialog confirming deletion of a todo, both a single todo as well as multiple todos.

const DeleteTodoModal = props => {
  const {
    open,
    className,
    handleModal,
    multiple,  // pass multiple={true} for deletion of multiple todos; else it is assumed a single todo is to be deleted
    deleteTodo,
    todo
  } = props;
  let pronoun;
  if (multiple) {
    pronoun = "these";  
  } else {
    pronoun = "this";
  }
  return (
    <Modal open={open}>
      <div className={className}>
        <Typography
          variant="h6"
          id="modal-title"
          style={{ textAlign: "center" }}
        >
          Are you sure you would like to delete {pronoun} ToDo
          {multiple && "s"}?
        </Typography>

        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: 30, marginRight: 150 }}
          onClick={() => deleteTodo(todo)}
        >
          Yes
        </Button>
        <Button variant="contained" color="secondary" onClick={handleModal}>
          No
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteTodoModal;
