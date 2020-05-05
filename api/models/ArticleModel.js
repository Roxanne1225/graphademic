//  GET /articles
exports.getArticles = function (articleName, pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject();
      });

      var query = `
      SELECT aid,fid,citation 
      FROM articles 
      WHERE upper(title) = upper('${articleName}')
    `;

      const result = await client.query(query).catch((e) => console.log(e));

      let articleQueryObject = {
        authorInfo: [],
        fieldInfo: [],
      };

      if (result && result.rowCount > 0) {
        const aid = result.rows[0].aid;
        const fid = result.rows[0].fid;

        query = `
        SELECT name, title 
        FROM (
          SELECT rid, title 
          FROM (
            SELECT 
              rid, 
              articles.title as title, 
              DENSE_RANK() OVER(PARTITION BY rid ORDER BY articles.citation DESC) as rank 
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

        const authorInfoObject = await client
          .query(query)
          .catch((e) => console.log(e));

        console.log('hi', authorInfoObject)

        if (authorInfoObject && authorInfoObject.rowCount > 0) {
          let curauthorName = authorInfoObject.rows[0].name;
          let curauthor = { name: curauthorName, otherHighlyCitedArticles: [] };

          authorInfoObject.rows.forEach(function (item) {
            if (item.name == curauthorName) {
              curauthor.otherHighlyCitedArticles.push(item.title);
            } else {
              articleQueryObject.authorInfo.push(curauthor);
              curauthorName = item.name;
              curauthor = {
                name: item.name,
                otherHighlyCitedArticles: [item.title],
              };
            }
          });
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
      resolve(articleQueryObject);
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//  POST /articles
exports.updateArticles = function (pool, frontArticle) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject();
      });

      const partialArticle = {
        title: null,
        authors: [],
        publishYear: null,
        url: null,
        citations: null,
        fieldID: null,
      };

      const keys = Object.keys(frontArticle);
      keys.forEach((key) => {
        partialArticle[key] = frontArticle[key];
      });
      await client.query("BEGIN");
      let query = `
        INSERT INTO articles (title,pub_year,url,citation,fid) values (
          '${partialArticle.title}',
          '${partialArticle.publishYear}',
          '${partialArticle.url}',
          '${partialArticle.citations}',
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

      client.release();
      resolve();
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//  GET /articles/byArticleName/:articleName
exports.getArticleByArticleName = function (articleName, pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject();
      });

      const articleNameQuery = `
        SELECT * 
        FROM articles 
        WHERE upper(title) = upper('${articleName}')
      `;

      const result = await client
        .query(articleNameQuery)
        .catch((e) => console.log(e));
      let articleObject = {
        articleId: null,
        title: null,
        authors: [],
        publishYear: null,
        url: null,
        citations: null,
        fieldID: null,
      };

      if (result && result.rowCount > 0) {
        const curarticle = result.rows[0];
        resolve(curarticle);

        articleObject = {
          ...articleObject,
          articleId: curarticle.aid,
          title: curarticle.title,
          publishYear: curarticle.pub_year,
          url: curarticle.url,
          citations: curarticle.citation,
          fieldID: curarticle.fid,
        };

        const authorNameQuery = `
          SELECT name 
          FROM authorizations NATURAL JOIN researchers 
          WHERE aid = ${curarticle.aid}
        `;

        const authorlist = await client
          .query(authorNameQuery)
          .catch((e) => console.log(e));
        if (authorlist) {
          authorlist.rows.forEach(function (item) {
            articleObject.authors.push(item.name);
          });
        }
      }

      client.release();
      resolve(articleObject);
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//  PUT /articles/:articleId
exports.updateArticleByArticleId = function (pool, articleId, updateObj) {
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

      const updateArticleQuery = `
        UPDATE articles 
        SET ${attributeUpdateList}
        WHERE aid = '${articleId}'
      `;

      await client.query(updateArticleQuery).catch((e) => {
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

//  DELETE /articles/:articleId
exports.deleteArticleByArticleId = function (pool, articleId) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch((e) => {
        console.log(e);
        reject(e);
      });

      const deleteArticleQuery = `
        DELETE FROM articles
        WHERE aid = '${articleId}'
      `;

      await client.query(deleteArticleQuery).catch((e) => {
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
