import React, { useState } from 'react'

import Container from 'react-bootstrap/Container'

import { fetchArticleByArticleTitle, createArticle } from '../api/ArticleClient'

import Article from '../components/articles/Article'
import ArticleFilterForm from '../components/articles/ArticleFilterForm'
import ArticleCreateForm from '../components/articles/ArticleCreateForm'

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

  const handleCreate = article => {
    createArticle(article).then(article => {
      alert("Created")
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
      <ArticleCreateForm onCreate={handleCreate} />
    </Container>
  )
}

export default ArticlesContainer