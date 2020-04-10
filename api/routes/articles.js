const express = require('express');
const router = express.Router();
const url = require('url');
//connect to database
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const ArticleModel = require('../models/ArticleModel')

//  GET /articles
router.get('/', async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const articleName = queryObject.articleName;

  try {
    const client = await pool.connect();
    var query = `
      SELECT aid,fid,citation 
      FROM articles 
      WHERE upper(title) = upper('${articleName}')
    `;

    const result = await client.query(query);

    var articleQueryObject = {
      authorInfo: [],
      fieldInfo: []
    };

    if (result && result.rowCount > 0) {
      const aid = result.rows[0].aid;
      const fid = result.rows[0].fid;
      query = `
        SELECT name, title 
        FROM (
          SELECT rid, title 
          FROM (
            SELECT rid, articles.title as title, DENSE_RANK() OVER(PARTITION BY rid ORDER BY articles.citation DESC) as rank 
            FROM (
              SELECT rid,aid 
              FROM authorizations 
              WHERE rid in (
                SELECT rid 
                FROM authorizations 
                WHERE aid = ${aid}
              )
            ) as a NATURAL JOIN articles
          ) as b
          WHERE rank <= 3
        ) as c NATURAL JOIN researchers
        ORDER BY name
      `;

      const authorInfoObject = await client.query(query);

      if (authorInfoObject && authorInfoObject.rowCount > 0) {
        var curauthorName = authorInfoObject.rows[0].name;
        var curauthor = { name: curauthorName, otherHighlyCitedArticles: [] };

        authorInfoObject.rows.forEach(function (item) {
          if (item.name == curauthorName) {
            curauthor.otherHighlyCitedArticles.push(item.title);
          } else {
            articleQueryObject.authorInfo.push(curauthor);
            curauthorName = item.name;
            curauthor = {
              name: item.name,
              otherHighlyCitedArticles: [item.title]
            };
          }
        }
        );
        articleQueryObject.authorInfo.push(curauthor);
      }
      if (fid) {
        query = `
          SELECT title 
          FROM articles 
          WHERE fid = ${fid} 
          ORDER BY citation DESC LIMIT 5
        `;
        const fieldarticles = await client.query(query);
        fieldarticles.rows.forEach(function (item) {
          articleQueryObject.fieldInfo.push(item.title);
        });
      }
    }

    client.release();
    res.send(articleQueryObject);
  } catch (err) {
    console.error(err);
    res.send('not found')
  }
})

//  POST /articles 
router.post('/', async (req, res) => {
  const frontArticle = req.body;
  const client = await pool.connect();

  try {
    const partialArticle = {
      title: null,
      authors: [],
      publishYear: null,
      url: null,
      citations: null,
      fieldID: null
    };

    const keys = Object.keys(frontArticle);
    keys.forEach(key => {
      partialArticle[key] = frontArticle[key];
    });
    await client.query('BEGIN');
    var query = `
      INSERT INTO articles (title,pub_year,url,citation,fid) values (
        '${partialArticle.title}',
        ${partialArticle.publishYear},
        '${partialArticle.url}',
        ${partialArticle.citations},
        '${partialArticle.fieldID}'
      ) RETURNING aid
    `;

    const rinsertid = await client.query(query);
    const insertaid = rinsertid.rows[0].aid;
    partialArticle.authors.forEach(async function (item) {
      query = `
        SELECT rid 
        FROM researchers 
        WHERE name = '${item}'
      `;

      const result = await client.query(query);
      if (result && result.rowCount > 0) {
        const researcher = result.rows[0].rid;
        query = `
          INSERT INTO authorizations (aid,rid) values(${insertaid},${researcher})
        `;
        await client.query(query);
      } else {
        query = `
          INSERT INTO researchers (name) values('${item}') 
          RETURNING rid
        `;
        const finsertid = await client.query(query);
        const finsertrid = finsertid.rows[0].rid;
        query = `
          INSERT INTO authorizations (aid,rid) values(${insertaid},${finsertrid})
        `;
        await client.query(query);
      }
    });

    await client.query('COMMIT');
    res.send('OK');
  } catch (e) {
    await client.query('ROLLBACK');
    res.send('Fail, try later');
  } finally {
    client.release();
  }
})

//  GET /articles/byArticleName/:articleName
router.get('/byArticleName/:articleName', async (req, res) => {
  const articleName = req.params.articleName

  const article = await ArticleModel
    .getArticleByArticleName(articleName, pool)
    .catch(e => {
      console.error(e)
      res.status(500).send("Internal server error.")
    })

  res.status(200).send(article)
})

//  PUT /articles/:articleId
router.put('/:articleId', async (req, res) => {
  const articleId = req.params.articleId
  const updateObj = req.body
  console.log(articleId, updateObj)

  await ArticleModel
    .updateArticleByArticleId(pool, articleId, updateObj)
    .catch(e => {
      console.log(e)
      res.status(500).send("Internal server error.")
    })

  res.status(200).send(`Updated article with articleId = ${articleId}`)
})

//  DELETE /articles/:articleId
router.delete('/:articleId', async (req, res) => {
  const articleId = req.params.articleId

  await ArticleModel
    .deleteArticleByArticleId(pool, articleId)
    .catch(e => {
      console.error(e)
      res.status(500).send("Internal server error.")
    })

  res.status(204).send()
})

module.exports = router
