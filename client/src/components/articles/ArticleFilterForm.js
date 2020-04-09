import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

const ArticleFilterForm = ({ onSubmit }) => {
  const [articleQuery, setArticleQuery] = useState({})

  const makeHandleChange = field => e => {
    setArticleQuery({
      ...articleQuery,
      [field]: e.target.value
    })
  }

  const handleSubmit = () => {
    onSubmit(articleQuery)
  }

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Article Title</Form.Label>
            <Form.Control
              type="text"
              onChange={makeHandleChange('title')}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Author</ Form.Label>
            <Form.Control
              type="text"
              onChange={makeHandleChange('author')}
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Label>Year Published</Form.Label>
            <Form.Control
              onChange={makeHandleChange('yearPublished')}
              type="text"
              placeholder="eg. 1999"
            />
          </Form.Group>
          <Button
            onClick={handleSubmit}
            variant="primary"
            type="submit"
          >
            Seach
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ArticleFilterForm