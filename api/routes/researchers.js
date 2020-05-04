const express = require("express");
const router = express.Router();
const url = require("url");
//connect to database
const { Pool } = require("pg");

//  GET /researchers
router.get("/", async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const researcherName = queryObject.researcherName;
  const researcher = await researcherModel
    .getresearchers(researcherName, pool)
    .catch((e) => {
      console.error(e);
      res.status(500).send("Internal server error.");
    });

  res.status(200).send(researcher);
});

//  POST /researchers
router.post("/", async (req, res) => {
  const frontResearcher = req.body;
  const researcher = await researcherModel
    .updateresearchers(pool, frontResearcher)
    .catch((e) => {
      console.error(e);
      res.status(500).send("Internal server error.");
    });

  res.status(200).send(`Updated researcher with researcher = ${researcher}`);
});

//  GET /researchers/:resercherName
router.get("/:researcherName", async (req, res) => {
  const researcherName = req.params.researcherName;

  const researcher = await researcherModel
    .getresearcherByresearcherName(researcherName, pool)
    .catch((e) => {
      console.error(e);
      res.status(500).send("Internal server error.");
    });

  res.status(200).send(researcher);
});

//  PUT /researchers/:researcherId
router.put("/:researcherId", async (req, res) => {
  const researcherId = req.params.researcherId;
  const updateObj = req.body;
  console.log(researcherId, updateObj);

  await researcherModel
    .updateresearcherByresearcherId(pool, researcherId, updateObj)
    .catch((e) => {
      console.log(e);
      res.status(500).send("Internal server error.");
    });

  res
    .status(200)
    .send(`Updated researcher with researcherId = ${researcherId}`);
});

//  DELETE /researchers/:researcherId
router.delete("/:researcherId", async (req, res) => {
  const researcherId = req.params.researcherId;

  await researcherModel
    .deleteresearcherByresearcherId(pool, researcherId)
    .catch((e) => {
      console.error(e);
      res.status(500).send("Internal server error.");
    });

  res
    .status(204)
    .send(`Deleted researcher with researcherId = ${researcherId}`);
});

module.exports = router;
