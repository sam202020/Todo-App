import React, { Component } from "react";

export default (props) => {
  const { onChange, title, description} = props;
  return (
    <div>
      <input
        name="title"
        type="text"
        value={props.title}
        onChange={e => props.onChange(e)}
      />
      <input
        name="description"
        type="text"
        value={props.description}
        onChange={e => props.onChange(e)}
      />
      <button onClick={props.addTodo}>Add To Do</button>
    </div>
  );
};
