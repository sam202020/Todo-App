import React from "react";
import { TextField, Paper, Button, Grid } from "@material-ui/core";

import changeTodo from "./changeTodo";

const AddtodoDisplay = props => {
  const {
    _id,
    title,
    description,
    onTitleChange,
    onDescChange,
    changeTodo,
    type,
    resetState
  } = props;
  return (
    <Paper style={{ margin: 16, padding: 16 }}>
      <Grid container>
        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            placeholder={`${type} Todo Title Here`}
            value={title}
            onChange={onTitleChange}
            fullWidth
          />
        </Grid>

        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            placeholder={`${type} Todo Description Here`}
            value={description}
            onChange={onDescChange}
            fullWidth
          />
        </Grid>
        <Grid xs={2} md={1} item>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            onClick={async () => {
              let res = await changeTodo(_id, title, description);
              if (res.status === 200) {
                resetState();
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

export default changeTodo(AddtodoDisplay);
