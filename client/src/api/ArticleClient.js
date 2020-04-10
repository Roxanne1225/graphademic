import axios from 'axios'

import { articleFixture } from '../fixtures/articles'

export function fetchArticleById(articleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(articleFixture), 1000)

  })
}

export function fetchArticleByArticleTitle(articleName) {
  return axios.get(`/api/articles/byArticleName/${articleName}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
}

export function updateArticleByArticleId(articleId, updateObject) {
  return axios({
    method: 'PUT',
    url: `/api/articles/${articleId}`,
    data: updateObject
  }).then(res => res.data);
}

export function createArticle(article) {
  return axios({
    method: 'POST',
    url: `/api/articles`,
    data: article
  }).then(res => res.data)
}

export function deleteArticleByArticleId(articleId) {
  return axios({
    method: 'DELETE',
    url: `/api/articles/${articleId}`,
  }).then(res => res.data)
}