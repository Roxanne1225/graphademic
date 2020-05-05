import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

const ResearcherFilterForm = ({ onSubmit }) => {
  const [researcherQuery, setResearcherQuery] = useState({})

  const makeHandleChange = field => e => {
    setResearcherQuery({
      ...researcherQuery,
      [field]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(researcherQuery)
  }

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Researcher Name</Form.Label>
            <Form.Control
              type="text"
              onChange={makeHandleChange('name')}
            />
          </Form.Group>
          <Button
            onClick={handleSubmit}
            variant="primary"
            type="submit"
          >
            Search
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ResearcherFilterForm