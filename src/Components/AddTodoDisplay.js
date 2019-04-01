import React, { useReducer } from "react";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Paper, Button, Grid } from "@material-ui/core";

import changeTodo from "./changeTodo";

//This component is used for both adding a new todo and editing an existing todo, depending on the prop 'type'.

const initialState = { titleError: false, descError: false };

// handle error states for input fields:

function reducer(state, action) {
  switch (action.type) {
    case "error":
      return action.error;
    case "unError":
      return initialState;
    default:
      throw new Error();
  }
}

const styles = {
  input: {
    "&::placeholder": {
      color: "red"
    }
  }
};

const AddtodoDisplay = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    _id,
    title,
    description,
    onTitleChange,
    onDescChange,
    changeTodo,
    type, // Add or Edit
    resetState,
    errorCheck
  } = props;

  let titleErrorStyle, descErrorStyle;

  // conditionally inject props to input fields if they are in error state:

  if (state.titleError)
    titleErrorStyle = { classes: { input: props.classes["input"] } };
  if (state.descError)
    descErrorStyle = { classes: { input: props.classes["input"] } };

  return (
    <Paper style={{ margin: 16, padding: 16 }}>
      <Grid container>
        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            error={state.titleError}
            placeholder={`${type} Todo Title Here`}
            value={title}
            onChange={onTitleChange}
            fullWidth
            InputProps={titleErrorStyle}
          />
        </Grid>

        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            error={state.descError}
            placeholder={`${type} Todo Description Here`}
            value={description}
            onChange={onDescChange}
            fullWidth
            InputProps={descErrorStyle}
          />
        </Grid>
        <Grid xs={2} md={1} item>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            onClick={async () => {
              let error = await errorCheck();
              if (error) {
                if (Object.values(error).includes(true)) {
                  dispatch({ type: "error", error });
                  return;
                }
              }
              let res = await changeTodo(_id, title, description);
              if (res.status === 200) {
                resetState();
                dispatch({ type: "unError" });
              }
            }}
          >
            {type}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default changeTodo(withStyles(styles)(AddtodoDisplay));
