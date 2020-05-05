import React from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

const ResearcherCreateForm = () => {

  return (
    <Card className='mt-5'>
      <Card.Body>
        <Card.Title>Create a Researcher</Card.Title>
        <Form>
          <Form.Group controlId="">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={makeHandleChange('title', 'string')}
              type="text"
              placeholder="enter a title"
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ResearcherCreateForm