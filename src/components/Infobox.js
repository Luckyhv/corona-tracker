import { Card,Typography,CardContent } from '@material-ui/core'
import React from 'react'
import './Infobox.css'

function Infobox({title, cases , total}) {
  return (
    <Card>
      <CardContent className='box'>
          <Typography className='title' color='textSecondary'>
              {title}
          </Typography>
          <h2 className='cases'>{cases}</h2>
          <Typography className='total'>
              {total} Total
          </Typography>
      </CardContent>
    </Card>
  )
}

export default Infobox
