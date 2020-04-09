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
  const queryObject = url.parse(req.url,true).query;
  const articleName = queryObject.articleName;
  try {
    const client = await pool.connect()
    var query = `SELECT aid,fid,citation FROM articles where upper(title)=upper('${articleName}')`;
    const result = await client.query(query);
    var articleQueryObject = {authorInfo:[],fieldInfo:[]};
    if (result) {
      const aid = result.rows[0].aid;
      const fid = result.rows[0].fid;
    query = `SELECT name,title FROM (SELECT rid,title from (SELECT rid,articles.title as title,DENSE_RANK() OVER(PARTITION BY rid ORDER BY articles.citation DESC) as rank FROM
    (SELECT rid,aid FROM authorizations WHERE rid in (SELECT rid FROM authorizations WHERE aid = ${aid})) as a
    NATURAL JOIN
    articles) as b
    WHERE rank <= 3) as c natural join researchers
    ORDER BY name`;
    const authorInfoObject = await client.query(query);
    if (authorInfoObject) {
      var curauthorName = authorInfoObject.rows[0].name;
      var curauthor =  {name:curauthorName,otherHighlyCitedArticles:[]};
      authorInfoObject.rows.forEach(function(item) {
        if (item.name == curauthorName) {
          curauthor.otherHighlyCitedArticles.push(item.title);
        } else {
          articleQueryObject.authorInfo.push(curauthor);
          curauthorName = item.name;
          curauthor = {name:item.name,otherHighlyCitedArticles:[item.title]};
        }
      }
    );
    articleQueryObject.authorInfo.push(curauthor);
    }
    if (fid) {
      query = `SELECT title FROM articles WHERE fid = ${fid} ORDER BY citation DESC LIMIT 5`;
      const fieldarticles = await client.query(query);
      fieldarticles.rows.forEach(function(item) {
        authorQueryObject.fieldInfo.push(item.title);
      });
    }
    }
    client.release();
    console.log(articleQueryObject);
    res.send(articleQueryObject);
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
