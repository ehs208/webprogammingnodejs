//201935302 은현수

var db = require("./db");

module.exports = {
  view: (req, res) => {
   
    // 데이터베이스에서 merchandise 테이블의 데이터 가져오기
    db.query(
      "SELECT name, price, brand, image, mer_id FROM merchandise",
      (err, mer) => {
        if (err) {
          throw error;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
        const vu = req.params.vu;
        const level = req.session.class;
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "merchandise.ejs",
          logined: "YES",
          merdata: mer,
          vu: vu,
          boardtypes: bor,
          level: level,
          category: "all"
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    )});
  },

  update: (req, res) => {
    const level = req.session.class;
    const merId = req.params.merId;
    db.query(
      "SELECT * FROM merchandise WHERE mer_id = ?",
      [merId],
      (err, mer) => {
        if (err) {
          throw error;
        }
        db.query("SELECT * FROM code_tbl", (err, code) => {
          db.query("SELECT * FROM boardtype", (err, bor) => {
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "merchandiseCU.ejs",
          logined: "YES",
          merdata: mer,
          codedata: code,
          check: "update",
          boardtypes: bor,
          level: level
        };

        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      })})}
    );
  },
  create: (req, res) => {
    const level = req.session.class;
    // 데이터베이스에서 merchandise 테이블의 데이터 가져오기
    db.query("SELECT * FROM merchandise", (err, mer) => {
      if (err) {
        throw err;
      }
      db.query("SELECT * FROM code_tbl", (err, code) => {
        db.query("SELECT * FROM boardtype", (err, bor) => {
      var context = {
        menu: "menuForManager.ejs",
        who: req.session.name,
        body: "merchandiseCU.ejs",
        logined: "YES",
        check: "create",
        merdata: mer,
        codedata: code,
        boardtypes: bor,
        level: level
      };
    
      req.app.render("home", context, (err, html) => {
        if (err) {
          throw err;
        }
        res.end(html);
      });
    })})});
  },
  create_process: (req, res) => {
    var post = req.body;
    var file = '/images/' + req.file.filename
    db.query(
      `INSERT INTO merchandise (category,name, price, stock, brand, supplier, sale_yn, sale_price, image)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.category,
        post.name,
        post.price,
        post.stock,
        post.brand,
        post.supplier,
        post.sale_yn,
        post.sale_price,
        file
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/merchandise/view/u` });
        res.end();
      }
    );
  },
  update_process: (req, res) => {
    var post = req.body;
    var file = '/images/' + req.file.filename
    db.query(
      `UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, sale_yn=?, sale_price=?, image=? WHERE mer_id=?`,
      [
        post.category,
        post.name,
        post.price,
        post.stock,
        post.brand,
        post.supplier,
        post.sale_yn,
        post.sale_price,
        file,
        post.mer_id,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/merchandise/view/u` });
        res.end();
      }
    );
  },
  delete_process: (req, res) => {
    const id = req.params.merId;
    db.query("DELETE FROM merchandise WHERE mer_id = ?", [id], (error, mer) => {
      if (error) {
        throw error;
      }
      res.writeHead(302, { Location: `/merchandise/view/u` });
      res.end();
    });
  },
};
