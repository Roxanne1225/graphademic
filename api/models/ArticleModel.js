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
      reject()
      console.log(e)
    }

  })
}