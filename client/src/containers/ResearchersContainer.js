import React from 'react'
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container'

const ResearchersContainer = () => {
  const { researcherId } = useParams()
  return (
    <Container>
      <p>Researchers Page: {researcherId}</p>
    </Container>
  )
}

export default ResearchersContainer