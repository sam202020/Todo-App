import React from 'react'
import {Button} from 'reactstrap'

export default ({logout}) => {
  return (
    <Button onClick={()=>logout()}>Logout</Button>
  )
}
