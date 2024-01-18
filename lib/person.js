//201935302 은현수

var db = require("./db");

module.exports = {
  view: (req, res) => {
    const level = req.session.class;
    db.query(
      "SELECT * FROM person",
      (err, per) => {
        if (err) {
          throw error;
        }
         db.query("SELECT * FROM boardtype", (err, bor) => {
        const vu = req.params.vu;
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "person.ejs",
          logined: "YES",
          perdata: per,
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

  update: (req, res) => {
    const level = req.session.class;
    const PerId = req.params.PerId;
    db.query(
      "SELECT * FROM person WHERE loginid = ?",
      [PerId],
      (err, per) => {
        if (err) {
          throw error;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "personCU.ejs",
          logined: "YES",
          perdata: per,
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
  create: (req, res) => {
    const level = req.session.class;
    db.query("SELECT * FROM person", (err, per) => {
      if (err) {
        throw err;
      }
      db.query("SELECT * FROM boardtype", (err, bor) => {
      var context = {
        menu: "menuForManager.ejs",
        who: req.session.name,
        body: "personCU.ejs",
        logined: "YES",
        check: "create",
        merdata: per,
        boardtypes: bor,
        level: level
      };

      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    })});
  },
  create_process: (req, res) => {
    var post = req.body;
    db.query(
      `INSERT INTO person (loginid , password , name , address, tel, birth, point, class)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.id,
        post.password,
        post.name,
        post.address,
        post.tel,
        post.birth,
        post.point,
        post.class,
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
  update_process: (req, res) => {
    var post = req.body;
    db.query(
      `UPDATE person SET password=?, name=?, address=?, tel=?, birth=?, class=?, point=? WHERE loginid=?`,
      [
        post.password,
        post.name,
        post.address,
        post.tel,
        post.birth,
        post.class,
        post.point,
        post.loginid,
        
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/person/view/u` });
        res.end();
      }
    );
  },
  delete_process: (req, res) => {
    const id = req.params.PerId;
    db.query("DELETE FROM person WHERE loginid = ?", [id], (error, per) => {
      if (error) {
        throw error;
      }
      res.writeHead(302, { Location: `/person/view/u` });
      res.end();
    });
  },
};
