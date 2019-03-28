import React from "react";
import { Col, Card } from 'reactstrap'
const Todo = ({ title, description, date }) => {
  console.log(title);
  return (
    <Col sm={{size:6, offset:3}}>
      <Card>
      {title} {description} {date}</Card>
    </Col>
  );
};

export default Todo;
