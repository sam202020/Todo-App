import React, { useState } from "react";
import { ConsoleLogger } from "@aws-amplify/core";

const changeTodo = AddOrEdit => props => {
  let { title, description } = props;
  let setTitle, setDesc;
  [title, setTitle] = useState(title || "");
  [description, setDesc] = useState(description || "");

  const setState = e => setField =>
    setField(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));

  const resetState = () => {
    setTitle("");
    setDesc("");
  };

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
