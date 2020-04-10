import React, { useState } from 'react'

import Container from 'react-bootstrap/Container'

import { fetchArticleByArticleTitle } from '../api/ArticleClient'

import Article from '../components/articles/Article'
import ArticleFilterForm from '../components/articles/ArticleFilterForm'

const ArticlesContainer = () => {
  const [article, setArticle] = useState(undefined)

  const handleSubmit = (query) => {
    const articleName = query.title
    fetchArticleByArticleTitle(articleName).then(article => {
      setArticle(article)
    })
  }

  const handleUpdate = (articleName) => {
    fetchArticleByArticleTitle(articleName).then(article => {
      setArticle(article)
    })
  }

  return (
    <Container className='pt-5'>
      <ArticleFilterForm onSubmit={handleSubmit} />
      {
        article && (
          <div className='pt-3'>
            <Article
              data={article}
              onUpdate={handleUpdate}
            />
          </div>
        )
      }
    </Container>
  )
}

export default ArticlesContainer