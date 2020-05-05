import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

const ResearcherCreateForm = ({ onCreate }) => {
  const [researcher, setResearcher] = useState({})

  const makeHandleChange = (field, type) => e => {
    let value = e.target.value
    if (type === 'integer') {
      value = parseInt(value)
    }

    setResearcher({
      ...researcher,
      [field]: value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    onCreate(researcher)
  }

  return (
    <Card className='mt-5'>
      <Card.Body>
        <Card.Title>Create a Researcher</Card.Title>
        <Form>
          <Form.Group controlId="">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={makeHandleChange('name', 'string')}
              type="text"
              placeholder="enter a title"
            />
          </Form.Group>

          <Form.Group controlId="">
            <Form.Label>Institute</Form.Label>
            <Form.Control
              onChange={makeHandleChange('institute', 'string')}
              type="text"
              placeholder="enter a title"
            />
          </Form.Group>

          <Form.Group controlId="">
            <Form.Label>PictureURL</Form.Label>
            <Form.Control
              onChange={makeHandleChange('picture_url', 'string')}
              type="text"
              placeholder="enter a title"
            />
          </Form.Group>

          <Button
            onClick={handleSubmit}
            variant="primary"
            type="button"
          >
            Create researcher
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ResearcherCreateForm