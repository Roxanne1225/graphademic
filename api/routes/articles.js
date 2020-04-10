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
  await ArticleModel.updateArticles(pool, frontArticle).catch((e) => {
    console.error(e);
    res.status(500).send("Internal server error.");
  });

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

  res.status(204).send();
});

module.exports = router;
