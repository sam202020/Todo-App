import React, { Component, useState } from "react";

const changeTodo = AddOrEdit => props => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");

  return (
    <AddOrEdit
      onTitleChange={e => setTitle(e.target.value)}
      onDescChange={e => setDesc(e.target.value)}
      title={title}
      description={description}
      {...props}
    />
  );
};

export default changeTodo;
