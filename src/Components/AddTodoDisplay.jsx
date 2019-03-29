import React, { memo } from "react";
import { TextField, Paper, Button, Grid } from "@material-ui/core";

const AddtodoDisplay = memo(props => (
  <Paper style={{ margin: 16, padding: 16 }}>
    <Grid container>
      <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
        <TextField
          placeholder={`${props.type} Todo Title Here`}
          defaultValue={props.title}
          name="title"
          onChange={props.onChange}
          //   onKeyPress={props.onInputKeyPress}
          fullWidth
        />
      </Grid>

      <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
        <TextField
          placeholder={`${props.type} Todo Description Here`}
          defaultValue={props.description}
          onChange={props.onChange}
          name="description"
          //   onKeyPress={props.onInputKeyPress}
          fullWidth
        />
      </Grid>
      <Grid xs={2} md={1} item>
        <Button
          fullWidth
          color="secondary"
          variant="outlined"
          onClick={props.addTodo}
        >
          {props.type}
        </Button>
      </Grid>
    </Grid>
  </Paper>
));

export default AddtodoDisplay;
