import React, {  useState } from "react";

const changeTodo = (AddOrEdit) => props => {
  let { title, description } = props;
  let setTitle, setDesc;
  [title, setTitle] = useState(title || "");
  [description, setDesc] = useState(description || "");

  const resetState = () => {
    setTitle("");
    setDesc("");
  };

  return (
    <AddOrEdit
      onTitleChange={e =>
        setTitle(
          e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        )
      }
      onDescChange={e =>
        setDesc(
          e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        )
      }
      resetState={resetState}
      {...props}
      title={title}
      description={description}
    />
  );
};

export default changeTodo;
