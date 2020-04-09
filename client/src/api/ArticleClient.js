import { articleFixture } from '../fixtures/articles'

export function fetchArticleById(articleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(articleFixture), 1000)

  })
}