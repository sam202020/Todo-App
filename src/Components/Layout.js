import React from "react";
import { AppBar, Typography, Toolbar, Paper } from "@material-ui/core";

// Renders background styling, header, and any children

const Layout = props => (
  <Paper
    elevation={0}
    style={{ padding: 0, margin: 0, backgroundColor: "#fafafa" }}
  >
    <AppBar color="primary" position="static" style={{ height: 64 }}>
      <Toolbar style={{ height: 64 }}>
        <Typography color="inherit">TODO APP</Typography>
      </Toolbar>
    </AppBar>
    {props.children}
  </Paper>
);

export default Layout;
