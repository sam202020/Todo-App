import React, { memo } from "react";
import { List, Paper, Grid } from "@material-ui/core";

import TodoDisplay from "./TodoDisplay";

const TodoList = memo(props => (
  <>
    {props.todos && (
      <Paper style={{ margin: 16 }}>
        <List>
          {props.todos.map((todo, index) => (
            <TodoDisplay
              {...todo}
              key={todo._id}
              divider={index < props.todos.length - 1}
              deleteTodo={props.deleteTodo}
            //   onButtonClick={() => props.onItemRemove(idx)}
            //   onCheckBoxToggle={() => props.onItemCheck(idx)}
            />
          ))}
        </List>
      </Paper>
    )}
  </>
));

export default TodoList;