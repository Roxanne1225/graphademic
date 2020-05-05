const express = require("express");
const router = express.Router();
const url = require("url");
//connect to database
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const ArticleModel = require("../models/ArticleModel");


//NEO4J
var neo4j = require('neo4j-driver').v1;

var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;

var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser,graphenedbPass));

// AF search by subject, data visiualization
router.get("/byArticleSubject/:articleSubject", async (req, res) => {
  const articleSubject = req.params.articleSubject;
  const articlesandcites = await ArticleModel.getArticlesBySubject(articleSubject, driver).catch(
    (e) => {
      console.error(e);
      res.status(500).send("Internal server error.");
    }
  );

  res.status(200).send(articlesandcites);
});

//  GET /articles
router.get("/", async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const articleName = queryObject.articleName;
  const article = await ArticleModel.getArticles(articleName, pool).catch(
    (e) => {
      console.error(e);
      res.status(500).send("Internal server error.");
    }
  );

  res.status(200).send(article);
});

//  POST /articles
router.post("/", async (req, res) => {
  const frontArticle = req.body;
  const article = await ArticleModel.updateArticles(pool, frontArticle).catch(
    (e) => {
      console.error(e);
      res.status(500).send("Internal server error.");
    }
  );

  res.status(200).send(`Updated article with article = ${article}`);
});

//  GET /articles/byArticleName/:articleName
router.get("/byArticleName/:articleName", async (req, res) => {
  const articleName = req.params.articleName;

  const article = await ArticleModel.getArticleByArticleName(
    articleName,
    pool
  ).catch((e) => {
    console.error(e);
    res.status(500).send("Internal server error.");
  });

  res.status(200).send(article);
});

//  PUT /articles/:articleId
router.put("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  const updateObj = req.body;
  console.log(articleId, updateObj);

  await ArticleModel.updateArticleByArticleId(pool, articleId, updateObj).catch(
    (e) => {
      console.log(e);
      res.status(500).send("Internal server error.");
    }
  );

  res.status(200).send(`Updated article with articleId = ${articleId}`);
});

//  DELETE /articles/:articleId
router.delete("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;

  await ArticleModel.deleteArticleByArticleId(pool, articleId).catch((e) => {
    console.error(e);
    res.status(500).send("Internal server error.");
  });

  res.status(204).send(`Updated article with articleId = ${articleId}`);
});

module.exports = router;
