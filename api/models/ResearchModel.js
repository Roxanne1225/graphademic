//  GET /researchers
exports.getresearchers = function (researcherName, pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject();
      });

      var query = `
        SELECT *
        FROM researchers 
        WHERE name = '${researcherName}'
      `;

      const result = await client.query(query).catch((e) => console.log(e));

      let researcherQueryObject = {
        basicInfo: null,
        paperInfo: [],
        partnerInfo: [],
      };

      if (result && result.rowCount > 0) {
        const curResearcher = result.rows[0];
        resolve(curResearcher);

        query = `
            SELECT b.fid 
            FROM (SELECT * FROM authorizations WHERE fid = (
                SELECT fid FROM researchers WHERE name = '${curResearcher.researcherName}')) AS a
                INNER JOIN authorizations AS b ON a.aid = b.aid AND a.fid  <> b.fid
            GROUP BY b.fid
            ORDER BY COUNT(a.aid) DESC
            LIMIT 5;
        `;

        const partnerInfo = await client
          .query(query)
          .catch((e) => console.log(e));

        query = `
            SELECT title
            FROM articles natural join authorizations natural join researchers
            WHERE name = researcherName AND citation in 
            (SELECT citation FROM articles natural join authorizations natural join researchers 
                WHERE name = researcherName ORDER BY citation DESC LIMIT 5)          
          `;

        const paperInfo = await client
          .query(query)
          .catch((e) => console.log(e));

        researcherQueryObject = {
          ...researcherQueryObject,
          basicInfo: curResearcher,
          paperInfo: paperInfo,
          partnerInfo: partnerInfo,
        };
      }
      client.release();
      resolve(researcherQueryObject);
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//  POST /researchers
exports.updateresearchers = function (pool, frontResearcher) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject();
      });

      const partialResearcher = {
        institute: null,
        name: null,
        picture_url: null,
      };

      const keys = Object.keys(frontResearcher);
      keys.forEach((key) => {
        partialResearcher[key] = frontResearcher[key];
      });
      let query = `
          INSERT INTO researchers (institute,name,picture_url) values (
            '${partialResearcher.institute}',
            '${partialResearcher.name}',
            '${partialResearcher.picture_url}'
          ) RETURNING rid
        `;
      const result = await client.query(query)
      const researcher = result.rows[0]
      client.release();
      resolve(researcher);
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//  GET /researchers/:resercherName
exports.getResearcherByResearcherName = function (researcherName, pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject();
      });

      const researcherIdQuery = `
        SELECT * 
        FROM researchers 
        WHERE name = '${researcherName}'
    `;

      const result = await client
        .query(researcherIdQuery)
        .catch((e) => console.log(e));

      let researcherObject = {
        institute: null,
        picture_url: null,
        rid: null,
      };

      if (result && result.rowCount > 0) {
        const curResearcher = result.rows[0];
        resolve(curResearcher);

        researcherObject = {
          ...researcherObject,
          institute: curResearcher.institute,
          picture_url: curResearcher.picture_url,
          rid: curResearcher.rid,
        };
      }

      client.release();
      resolve(researcherObject);
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//  PUT /researchers/:researcherId
exports.updateResearcherByResearcherId = function (
  pool,
  researcherId,
  updateObj
) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject(e);
      });

      const attributeUpdateList = Object.keys(updateObj)
        .map(
          (attribute) =>
            `${attribute} = ${getSQLEscapedString(updateObj[attribute])}`
        )
        .join(",");

      const updateResearcherQuery = `
          UPDATE researchers 
          SET ${attributeUpdateList}
          WHERE rid = '${researcherId}'
        `;

      await client.query(updateResearcherQuery).catch((e) => {
        console.log(e);
        reject(e);
      });

      client.release();
      resolve();
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//  DELETE /researchers/:researcherId
exports.deleteResearcherByResearcherId = function (pool, researchId) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject(e);
      });

      const deleteResearcherQuery = `
          DELETE FROM researches
          WHERE rid = '${researchId}'
        `;

      await client.query(deleteResearcherQuery).catch((e) => {
        console.log(e);
        reject(e);
      });

      resolve();
      client.release();
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

function getSQLEscapedString(value) {
  if (typeof value === "number") {
    return value;
  } else {
    return `'${value}'`;
  }
}
