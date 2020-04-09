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
    const client = await pool.connect();
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
  //  console.log(articleQueryObject);
    res.send(articleQueryObject);
  } catch(err) {
    console.error(err);
  }
})

//  POST /articles add
router.post('/',async (req, res) => {
  const frontArticle = req.body;
  const client = await pool.connect();
  try {
      const partialArticle = {title:null,authors:[],publishYear:null,url:null,citations:null,fieldID:null};
      const keys = Object.keys(frontArticle);
      keys.forEach(key => {
        partialArticle[key] = frontArticle[key];
      });
      await client.query('BEGIN');
      var query = `INSERT INTO articles (title,pub_year,url,citation,fid) values ('${partialArticle.title}',${partialArticle.publishYear},'${partialArticle.url}',${partialArticle.citations},'${partialArticle.fieldID}') RETURNING aid`;
      const rinserted = await client.query(query);
      const insertaid = rinsertid.rows[0].aid;
      partialArticle.authors.forEach(async function(item) {
        query = `SELECT rid FROM researchers WHERE name = '${item}'`;
        const result = await client.query(query);
        if (result) {
    const researcher = result.rows[0].rid;
    query = `INSERT INTO authorizations (aid,rid) values(${insertaid},${researcher})`;
    await client.query(query);
      }else {
        query = `INSERT INTO researchers (name) values('${item}') RETURNING rid`;
        const finsertid = await client.query(query);
        const finsertrid = finsertid.rows[0].rid;
        query = `INSERT INTO authorizations (aid,rid) values(${insertaid},${finsertrid})`;
        await client.query(query);
      }
      });
      await client.query('COMMIT');
      res.send('OK');
  } catch (e) {
    await client.query('ROLLBACK');
    res.send('Fail, try later');
  }finally {
    client.release();
  }
})

//  GET /articles/:articleName
router.get('/:articleName',async (req, res) => {

  try {
    const client = await pool.connect();
    var query = `SELECT * FROM articles WHERE upper(title) = upper('${req.param.articleName}')`;
    const result = await client.query(query);
    var articleObject = {articleId:null,title:null,authors:[],publishYear:null,url:null,citations:null,fieldID:null};
    if (result) {
      const curarticle = result.rows[0];
      articleObject.articleId=curarticle.aid;
      articleObject.title = curarticle.title;
      articleObject.publishYear = curarticle.pub_year;
      articleObject.url = curarticle.url;
      articleObject.citations = curarticle.citation;
      articleObject.fieldID = curarticle.fid;
      query = `SELECT name from authorizations natural join researchers WHERE aid = ${curarticle.aid}`;
      const authorlist = await client.query(query);
      if (authorlist) {
        authorlist.rows.forEach(function(item) {
          articleObject.authors.push(item.name);
        });
      }
    }
    res.send(articleObject);
    client.release();
  }catch(e) {
    console.error(e);
  }
})

//  PUT /articles/:articleId
router.put('/:articleId',async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    const aid = req.param.articleId;
    const partialArticleObject = req.body;
    const keys = Object.keys(partialArticleObject);
    const dict = {"title":"title","publishYear":"pub_year","url":"url","citations":"citations","fieldID":"fid"};
    keys.forEach(async function(key) {
      if (key == "publishYear" || key == "citations") {
      const query = `UPDATE articles set ${dict[key]} =  ${partialArticleObject[key]} WHERE aid = ${aid}`;
      await client.query(query);
    }
      else {
        const query = `UPDATE articles set ${dict[key]} =  '${partialArticleObject[key]}' WHERE aid = ${aid}`;
        await client.query(query);
      }
    });
    await client.query('COMMIT');
    res.send('OK');
    client.release();
  }catch(e) {
    await client.query('ROLLBACK');
    res.send('Fail,try later');
    console.error(e);
  }
})

//  DELETE /articles/:articleId
router.delete('/:articleId', async (req, res) => {
  try {
    const client = await pool.connect();
    const aid = req.param.articleId;
    const query = `DELETE FROM articles WHERE aid = ${aid}`;
    await client.query(query);
    res.send('OK');
    client.release();
  }catch(e) {
    res.send('Fail,try later');
    console.error(e);
  }
})

module.exports = router
