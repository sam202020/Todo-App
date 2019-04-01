import React, { useState } from "react";

// Higher Order functional component that handles the adding and editing of a todo that is added or edited in the AddToDoDisplay component.

const changeTodo = AddOrEdit => props => {
  let { title, description } = props;
  let setTitle, setDesc;
  [title, setTitle] = useState(title || "");  // title and description can be passed in (as in the case of using AddTodoDisplay for editing), or can be empty (for adding a new todo)
  [description, setDesc] = useState(description || "");

  const setState = e => setField =>
    setField(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));

  // reset title and description on successful add or edit:

  const resetState = () => {
    setTitle("");
    setDesc("");
  };

  // check inputs for errors before sending to backend

  const checkTitleAndDesc = () => {
    const [titleError, descError] = [!title, !description];
    return {titleError, descError};
  };

  return (
    <AddOrEdit
      onTitleChange={e => setState(e)(setTitle)}
      onDescChange={e => setState(e)(setDesc)}
      errorCheck={checkTitleAndDesc}
      resetState={resetState}
      {...props}
      title={title}
      description={description}
    />
  );
};

export default changeTodo;
