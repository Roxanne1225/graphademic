import React from 'react'
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container'

const ArticlesContainer = () => {
  const { articleId } = useParams()
  return (
    <Container className='pt-5'>
      <p>Articles Page: {articleId || 'no articleId given'}</p>
    </Container>
  )
}

export default ArticlesContainer