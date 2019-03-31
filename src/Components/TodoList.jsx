import React, { memo, useState } from "react";
import { List, Paper, Grid, Checkbox } from "@material-ui/core";

import TodoDisplay from "./TodoDisplay";

const TodoList = memo(props => {
  const [checked, setChecked] = useState(false);
  return (
    <>
      
        
        <List>{props.children}</List>
      
    </>
  );
});

export default TodoList;
