//201935302 은현수

var db = require("./db");

module.exports = {
  view: (req, res) => {
    const level = req.session.class;
    db.query(
      "SELECT main_id, sub_id, main_name, sub_name, start, end FROM code_tbl",
      (err, code) => {
        if (err) {
          throw error;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
        const vu = req.params.vu;
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "code.ejs",
          logined: "YES",
          code: code,
          vu: vu,
          boardtypes: bor,
          level: level
        };
  
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    )});
  },
  create: (req, res) => {
    db.query("SELECT * FROM boardtype", (err, bor) => {
    var context = {
      menu: "menuForManager.ejs",
      who: req.session.name,
      body: "codeCU.ejs",
      logined: "YES",
      check: "create",
      boardtypes: bor
    };
    req.app.render("home", context, (err, html) => {
      if (err) {
        throw err;
      }
      res.end(html);
    })});
  },
  create_process: (req, res) => {
    var post = req.body;
    db.query(
      `INSERT INTO code_tbl (main_id, main_name, sub_id, sub_name, start, end)
  VALUES(?, ?, ?, ?, ?, ?)`,
      [
        post.main_id,
        post.main_name,
        post.sub_id,
        post.sub_name,
        post.start,
        post.end,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/code/view/u` });
        res.end();
      }
    );
  },

  update: (req, res) => {
    const level = req.session.class;
    const main = req.params.main;
    const sub = req.params.sub;
    // 데이터베이스에서 merchandise 테이블의 데이터 가져오기
    db.query(
      "SELECT * FROM code_tbl WHERE main_id = ? && sub_id = ?",
      [main, sub],
      (err, code) => {
        if (err) {
          throw error;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "codeCU.ejs",
          logined: "YES",
          codedata: code,
          check: "update",
          boardtypes: bor,
          level: level
        };

        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    )});
  },
  update_process: (req, res) => {
    var post = req.body;
    db.query(
      `UPDATE code_tbl SET main_name = ?, sub_name = ? , start = ?, end = ? WHERE main_id = ? && sub_id = ?`,
      [
        post.main_name,
        post.sub_name,
        post.start,
        post.end,
        post.hidden_main_id,
        post.hidden_sub_id,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/code/view/u` });
        res.end();
      }
    );
  },
  delete_process: (req, res) => {
    const main = req.params.main;
    const sub = req.params.sub;
    db.query(
      "DELETE FROM code_tbl WHERE main_id = ? && sub_id = ?",
      [main, sub],
      (error, mer) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/code/view/u` });
        res.end();
      }
    );
  },
};
