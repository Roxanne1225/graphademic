import React, { useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'

import { updateResearcherByResearcherId } from '../../api/ResearcherClient'

const STATES = {
  VIEWING: 'VIEWING',
  EDITING: 'EDITING',
  EDIT_REQUEST: 'EDIT_REQUEST',
  EDIT_SUCCESS: 'EDIT_SUCCESS',
  EDIT_FAILED: 'EDIT_FAILED'
}

const Researcher = ({ data, onDelete, onUpdate }) => {
  const [uiState, setUiState] = useState(STATES.VIEWING)

  const [researcherValue, setResearcherValue] = useState(
    JSON.stringify(data, undefined, 4)
  )

  const handleChange = e => {
    setResearcherValue(e.target.value)
  }

  const handleUpdate = () => {
    const researcherId = data.rid
    const updateObject = JSON.parse(researcherValue)
    updateResearcherByResearcherId(researcherId, updateObject)
      .then(res => {
        setUiState(STATES.EDIT_SUCCESS)
        setTimeout(() => setUiState(STATES.VIEWING), 2000)
      })
      .catch(e => {
        setUiState(STATES.EDIT_FAILED)
      })
    onUpdate(updateObject.name)
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
              value={researcherValue}
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
            <Image src={data.picture_url} rounded />
            <p className='pt-1'>ResearcherId: {data.rid}</p>
            <p>Institute: {data.institute}</p>
            <Button className='mr-1' onClick={() => setUiState(STATES.EDITING)}>
              Edit Researcher
            </Button>
            <Button variant='danger' onClick={onDelete}>
              Delete researcher
            </Button>
          </div>
        )
      }
      case STATES.VIEWING:
      default: {
        return (
          <div className='pt-1'>
            <Image src={data.picture_url} rounded />
            <p className='pt-1'>ResearcherId: {data.rid}</p>
            <p>Institute: {data.institute}</p>
            <Button className='mr-1' onClick={() => setUiState(STATES.EDITING)}>
              Edit Researcher
            </Button>
            <Button variant='danger' onClick={onDelete}>
              Delete reseaarcher
            </Button>
          </div>
        )
      }
    }
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