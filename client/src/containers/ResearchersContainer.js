import React, { useState } from 'react'

import Container from 'react-bootstrap/Container'

import Researcher from '../components/researchers/Researcher'
import ResearcherFilterForm from '../components/researchers/ResearcherFilterForm'

import { fetchResearcherByResearcherName } from '../api/ResearcherClient'

const ResearchersContainer = () => {
  const [researcher, setResearcher] = useState(undefined)

  const handleSubmit = (query) => {
    const researcherName = query.name

    fetchResearcherByResearcherName(researcherName).then(researcher => {
      setResearcher(researcher)
    })
  }

  return (
    <Container className='pt-5'>
      <ResearcherFilterForm onSubmit={handleSubmit} />
      {
        researcher && (
          <div className='pt-3'>
            <Researcher data={researcher} />
          </div>
        )
      }

    </Container>
  )
}

export default ResearchersContainer