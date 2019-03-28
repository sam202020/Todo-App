import React, { Component } from "react";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Button
} from "reactstrap";

const poolData = {
  UserPoolId: "us-east-2_Gu32DUJYY",
  ClientId: "6rljq8ni43uhggokqh9mr51b3v"
};

export default class Signin extends Component {
  
  onChange = (e) => {
    this.props.onChange(e)
  };
  render() {
    const{username, password} = this.props
    return (
      <Container>
        <Row style={{ textAlign: "center" }}>
          <Col size={{ offset: 3, sm: 6 }}>
            <h2>Sign In to View Your To Do List:</h2>
            <Form>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name='username'
                  placeholder="username"
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name='password'
                  placeholder="password"
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <Button size="lg" block onClick={e => this.props.login(e)}>
              Sign In
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
