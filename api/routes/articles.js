const express = require('express')
const router = express.Router()

//  GET /articles
router.get('/', (req, res) => {
  res.send('temp')
})

//  POST /articles
router.post('/', (req, res) => {
  res.send('temp')
})

//  GET /articles/:articleId
router.get('/:articleId', (req, res) => {
  res.send('temp')
})

//  PUT /articles/:articleId
router.put('/:articleId', (req, res) => {
  res.send('temp')
})

//  DELETE /articles/:articleId
router.delete('/:articleId', (req, res) => {
  res.send('temp')
})

module.exports = router