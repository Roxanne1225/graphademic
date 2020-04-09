import React from 'react'
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container'

import { useFetch } from '../hooks/useFetch'
import { fetchArticleById } from '../api/ArticleClient'

import ArticleFilterForm from '../components/articles/ArticleFilterForm'

const ArticlesContainer = () => {
  const { articleId } = useParams()

  const { isReceived, data: article } =
    useFetch(fetchArticleById, articleId)

  return (
    <Container className='pt-5'>
      <p>Articles Page: {articleId || 'no articleId given'}</p>
      {articleId && isReceived && JSON.stringify(article)}
      <ArticleFilterForm />
    </Container>
  )
}

export default ArticlesContainer