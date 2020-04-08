const express = require('express')
const router = express.Router()

//connect to database
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

//  GET /articles
router.get('/',async (req, res) => {
  try {
    const client = await pool.connect()
    const query = `SELECT * FROM researchers where name='Xiaoyi Ma'`;
    const result = await client.query(query);
    const results = {'results':(result)? result.rows:null};
    console.log(results);
    client.release();
  } catch(err) {
    console.error(err);
  }
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
