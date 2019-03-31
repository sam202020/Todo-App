import React from 'react'
import {Button} from '@material-ui/core'

export default ({logout}) => {
  return (
    <Button style={{position: 'absolute', right: '10px'}} onClick={()=>logout()}>Logout</Button>
  )
}
