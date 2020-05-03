//  GET /researchers
exports.getresearchers = function (researcherId, pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject();
      });

      var query = `
        SELECT *
        FROM researchers 
        WHERE upper(title) = upper('${researcherName}')
      `;

      const result = await client.query(query).catch((e) => console.log(e));

      let researcherQueryObject = {
        authorInfo: [],
        fieldInfo: [],
      };

      if (result && result.rowCount > 0) {
        const aid = result.rows[0].aid;
        resolve(aid);
        const fid = result.rows[0].fid;
        resolve(fid);

        query = `
          SELECT name, title 
          FROM (
            SELECT rid, title 
            FROM (
              SELECT rid, researchers.title as title, DENSE_RANK() OVER(PARTITION BY rid ORDER BY researchers.citation DESC) as rank 
              FROM (
                SELECT rid,aid 
                FROM authorizations 
                WHERE rid in (
                  SELECT rid 
                  FROM authorizations 
                  WHERE aid = ${aid}
                )
              ) as a NATURAL JOIN researchers
            ) as b
            WHERE rank <= 3
          ) as c NATURAL JOIN researchers
          ORDER BY name
        `;

        const authorInfoObject = await client
          .query(query)
          .catch((e) => console.log(e));

        if (authorInfoObject && authorInfoObject.rowCount > 0) {
          let curauthorName = authorInfoObject.rows[0].name;
          let curauthor = {
            name: curauthorName,
            otherHighlyCitedresearchers: [],
          };

          authorInfoObject.rows.forEach(function (item) {
            if (item.name == curauthorName) {
              curauthor.otherHighlyCitedresearchers.push(item.title);
            } else {
              researcherQueryObject.authorInfo.push(curauthor);
              curauthorName = item.name;
              curauthor = {
                name: item.name,
                otherHighlyCitedresearchers: [item.title],
              };
            }
          });
          researcherQueryObject.authorInfo.push(curauthor);
        }
        if (fid) {
          query = `
            SELECT title 
            FROM researchers 
            WHERE fid = ${fid} 
            ORDER BY citation DESC LIMIT 5
          `;
          const fieldresearchers = await client.query(query);
          fieldresearchers.rows.forEach(function (item) {
            researcherQueryObject.fieldInfo.push(item.title);
          });
        }
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
      await client.query("BEGIN");
      let query = `
          INSERT INTO researchers (institute,name,url,picture_url) values (
            '${partialResearcher.institute}',
            ${partialResearcher.name},
            '${partialResearcher.picture_url}'
          ) RETURNING rid
        `;
      client.release();
      resolve();
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
          WHERE name = ${researcherName}
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
          WHERE rid = ${researcherId}
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
          WHERE rid = ${researchId}
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
