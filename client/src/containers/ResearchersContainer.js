import React, { useState } from 'react'

import Container from 'react-bootstrap/Container'

import Researcher from '../components/researchers/Researcher'
import ResearcherFilterForm from '../components/researchers/ResearcherFilterForm'
import ResearcherCreateForm from '../components/researchers/ResearcherCreateForm'

import {
  deleteResearcherByResearcherId,
  fetchResearcherByResearcherName,
  createResearcher
} from '../api/ResearcherClient'

const ResearchersContainer = () => {
  const [researcher, setResearcher] = useState(undefined)

  const handleSubmit = (query) => {
    const researcherName = query.name

    fetchResearcherByResearcherName(researcherName).then(researcher => {
      setResearcher(researcher)
    })
  }

  const handleUpdate = (name) => {
    fetchResearcherByResearcherName(name).then(researcher => {
      alert(JSON.stringify(researcher))
      setResearcher(researcher)
    })
  }

  const handleCreate = researcher => {
    createResearcher(researcher).then(researcher => {
      alert('Created')
    })
  }

  const handleDelete = () => {
    deleteResearcherByResearcherId(researcher.rid).then(article => {
      alert("Deleted")
    })
  }

  return (
    <Container className='pt-5'>
      <ResearcherFilterForm onSubmit={handleSubmit} />
      {
        researcher && (
          <div className='pt-3'>
            <Researcher
              data={researcher}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        )
      }
      <ResearcherCreateForm onCreate={handleCreate} />
    </Container>
  )
}

export default ResearchersContainer