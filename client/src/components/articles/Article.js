import React, { useState } from 'react'

import { updateArticleByArticleId } from '../../api/ArticleClient'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'

const STATES = {
  VIEWING: 'VIEWING',
  EDITING: 'EDITING',
  EDIT_REQUEST: 'EDIT_REQUEST',
  EDIT_SUCCESS: 'EDIT_SUCCESS',
  EDIT_FAILED: 'EDIT_FAILED'
}

const Article = ({ article, articleInfo, onUpdate, onDelete }) => {
  const [uiState, setUiState] = useState(STATES.VIEWING)

  const [articleValue, setArticleValue] = useState(
    JSON.stringify(article, undefined, 4)
  )

  const handleChange = e => {
    setArticleValue(e.target.value)
  }

  const handleUpdate = () => {
    const articleId = article.aid
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
            <p>ArticleID: {article.aid} </p>
            <p>Year published: {article.pub_year}</p>
            <p>FieldID: {article.fid}</p>
            <p>Citations: {article.citation}</p>
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
            <p>ArticleID: {article.aid} </p>
            <p>Year published: {article.pub_year}</p>
            <p>FieldID: {article.fid}</p>
            <p>Citations: {article.citation}</p>
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

  const renderOtherHighlyCitedArticleByAuthors = () => {
    if (!articleInfo || articleInfo.authorInfo.length < 1) {
      return null
    }

    return (
      <div className='pt-5'>
        <h4 className='pb-2'>Additional Info</h4>
        <h5 className='pb-3'>Other highly cited article by the authors:</h5>
        {
          articleInfo.authorInfo.map(author => (
            <Row className='pb-4'>
              <Col md={2}>
                <h6>{author.name}</h6>
              </Col>
              <Col md={10}>
                <ListGroup>
                  {author.otherHighlyCitedArticles.map(article => (
                    <ListGroup.Item>{article}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          ))
        }
      </div>
    )
  }

  const renderArticlesWithinThisField = () => {
    if (!articleInfo || articleInfo.fieldInfo.length < 1) {
      return null
    }

    return (
      <div className='pt-2'>
        <h5 className='pb-3'>Other articles within this field:</h5>
        <ListGroup>
          {
            articleInfo.fieldInfo.length > 0 && articleInfo.fieldInfo.map(articles => (
              <ListGroup.Item>{articles}</ListGroup.Item>
            ))
          }
        </ListGroup>
      </div>
    )
  }

  return (
    <Card>
      <Card.Body>
        <h3>
          <a target='_blank' href={article.url}>{article.title}</a>
        </h3>
        {renderCardBody()}
        {renderOtherHighlyCitedArticleByAuthors()}
        {renderArticlesWithinThisField()}
      </Card.Body>
    </Card>
  )
}

export default Article