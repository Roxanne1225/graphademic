const express = require('express')
const router = express.Router()

//  GET /researchers
router.get('/', (req, res) => {
  res.send('temp')
})

//  POST /researchers
router.post('/', (req, res) => {
  res.send('temp')
})

//  GET /researchers/:resercherId
router.get('/:researcherId', (req, res) => {
  res.send('temp')
})

//  PUT /researchers/:researcherId
router.put('/:researcherId', (req, res) => {
  res.send('temp')
})

//  DELETE /researchers/:researcherId
router.delete('/:researcherId', (req, res) => {
  res.send('temp')
})

module.exports = router