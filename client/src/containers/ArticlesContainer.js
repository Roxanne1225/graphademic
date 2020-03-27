import React from 'react'
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container'

const ArticlesContainer = () => {
  const { articleId } = useParams()
  return (
    <Container>
      <p>Articles Page: {articleId}</p>
    </Container>
  )
}

export default ArticlesContainer