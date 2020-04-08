const express = require('express');
const router = express.Router();
const url = require('url');
//connect to database
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

//  GET /articles
router.get('/',async (req, res) => {
  console.log("here");
  const queryObject = url.parse(req.url,true).query;
  const articleName = queryObject.articleName;
  try {
    const client = await pool.connect()
    var query = `SELECT aid,fid FROM articles where title='${articleName}'`;
    var result = await client.query(query);
    if (result) {
      const aid = result.rows[0].aid;
      const fid = result.rows[0].fid;
      //query = `SELECT rid FROM authorizations where aid = ${aid}`;
      //result = await client.query(query);
      //var articleQueryObject = {authorInfo:[],}
      console.log(aid + " " + fid);
    }
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
