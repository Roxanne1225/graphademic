exports.getArticleByArticleName = function (articleName, pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch(e => {
        console.log(e)
        reject()
      });

      const articleNameQuery = `
        SELECT * 
        FROM articles 
        WHERE upper(title) = upper('${articleName}')
      `;

      const result = await client.query(articleNameQuery).catch(e => console.log(e));
      let articleObject = {
        articleId: null,
        title: null,
        authors: [],
        publishYear: null,
        url: null,
        citations: null,
        fieldID: null
      };

      if (result && result.rowCount > 0) {
        const curarticle = result.rows[0];
        resolve(curarticle)

        articleObject = {
          ...articleObject,
          articleId: curarticle.aid,
          title: curarticle.title,
          publishYear: curarticle.pub_year,
          url: curarticle.url,
          citations: curarticle.citation,
          fieldID: curarticle.fid,
        }

        const authorNameQuery = `
          SELECT name 
          FROM authorizations NATURAL JOIN researchers 
          WHERE aid = ${curarticle.aid}
        `;

        const authorlist = await client.query(authorNameQuery).catch(e => console.log(e));
        if (authorlist) {
          authorlist.rows.forEach(function (item) {
            articleObject.authors.push(item.name);
          });
        }
      }

      client.release();
      resolve(articleObject)
    } catch (e) {
      console.log(e)
      reject()
    }

  })
}

exports.deleteArticleByArticleId = function (pool, articleId) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch(e => {
        console.log(e)
        reject(e)
      })

      const deleteArticleQuery = `
        DELETE FROM articles
        WHERE aid = ${articleId}
      `

      await client.query(deleteArticleQuery).catch(e => {
        console.log(e)
        reject(e)
      })

      resolve()
      client.release()
    } catch (e) {
      console.log(e)
      reject()
    }
  })
}

function getSQLEscapedString(value) {
  if (typeof (value) === 'number') {
    return value
  } else {
    return `'${value}'`
  }
}

exports.updateArticleByArticleId = function (pool, articleId, updateObj) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect().catch(e => {
        console.log(e)
        reject(e)
      })

      const attributeUpdateList = Object.keys(updateObj)
        .map(attribute =>
          `${attribute} = ${getSQLEscapedString(updateObj[attribute])}`
        )
        .join(',')

      const updateArticleQuery = `
        UPDATE articles 
        SET ${attributeUpdateList}
        WHERE aid = ${articleId}
      `;

      await client.query(updateArticleQuery).catch(e => {
        console.log(e)
        reject(e)
      })

      client.release()
      resolve()
    } catch (e) {
      console.log(e)
      reject()
    }
  })
}