import React, { useState } from 'react'

import { updateArticleByArticleId } from '../../api/ArticleClient'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

const STATES = {
  VIEWING: 'VIEWING',
  EDITING: 'EDITING',
  EDIT_REQUEST: 'EDIT_REQUEST',
  EDIT_SUCCESS: 'EDIT_SUCCESS',
  EDIT_FAILED: 'EDIT_FAILED'
}

const Article = ({ data, onUpdate, onDelete }) => {
  const [uiState, setUiState] = useState(STATES.VIEWING)

  const [articleValue, setArticleValue] = useState(
    JSON.stringify(data, undefined, 4)
  )

  const handleChange = e => {
    setArticleValue(e.target.value)
  }

  const handleUpdate = () => {
    const articleId = data.aid
    const updateObject = JSON.parse(articleValue)
    updateArticleByArticleId(articleId, updateObject)
      .then(res => {
        setUiState(STATES.EDIT_SUCCESS)
        setTimeout(() => setUiState(STATES.VIEWING), 2000)
      })
      .catch(e => {
        setUiState(STATES.EDIT_FAILED)
      })
    onUpdate(updateObject.title)
  }

  const renderCardBody = () => {
    switch (uiState) {
      case STATES.EDITING: {
        return (
          <div className='pt-1'>
            <Form.Control
              as='textarea'
              rows={10}
              onChange={handleChange}
              value={articleValue}
            />
            <Button
              className='mt-1'
              onClick={handleUpdate}
            >
              Save changes
              </Button>
          </div>
        )
      }
      case STATES.EDIT_SUCCESS: {
        return (
          <div className='pt-1'>
            <Alert variant='success'>Update successful.</Alert>
            <p>ArticleID: {data.aid} </p>
            <p>Year published: {data.pub_year}</p>
            <p>FieldID: {data.fid}</p>
            <p>Citations: {data.citation}</p>
            <Button onClick={() => setUiState(STATES.EDITING)}>
              Edit Article
            </Button>
          </div>
        )
      }
      case STATES.VIEWING:
      default: {
        return (
          <div className='pt-1'>
            <p>ArticleID: {data.aid} </p>
            <p>Year published: {data.pub_year}</p>
            <p>FieldID: {data.fid}</p>
            <p>Citations: {data.citation}</p>
            <Button className='mr-1' onClick={() => setUiState(STATES.EDITING)}>
              Edit Article
            </Button>
            <Button variant='danger' onClick={() => onDelete()}>
              Delete article
            </Button>
          </div>
        )
      }
    }
  }

  return (
    <Card>
      <Card.Body>
        <h3>
          <a target='_blank' href={data.url}>{data.title}</a>
        </h3>
        {renderCardBody()}
      </Card.Body>
    </Card>
  )
}

export default Article