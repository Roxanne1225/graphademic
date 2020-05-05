import React from 'react'

import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'

const Researcher = ({ data }) => {

  const renderCardBody = () => {
    return (
      <div className='pt-1'>
        <Image src={data.picture_url} rounded />
        <p className='pt-1'>ResearcherId: {data.rid}</p>
        <p>Institute: {data.institute}</p>
      </div>
    )
  }

  return (
    <Card>
      <Card.Body>
        <h3>{data.name}</h3>
        {renderCardBody()}
      </Card.Body>
    </Card>
  )
}

export default Researcher