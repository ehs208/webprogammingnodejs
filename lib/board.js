var db = require("./db");
var getTime = require("./template");

module.exports = {
  typeview: (req, res) => {
    const level = req.session.class;
    db.query(
      "SELECT * FROM boardtype",
      db.query("SELECT * FROM boardtype", (err, bor) => {
        var context = {
          menu: level === "01" ? "menuForManager.ejs" : "menuForCustomer.ejs",
          who: req.session.name,
          body: "boardtype.ejs",
          logined: "YES",
          boardtypes: bor,
          level: level,
        };

        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      })
    );
  },
  typecreate: (req, res) => {
    const level = req.session.class;
    db.query("SELECT * FROM boardtype", (err, bor) => {
      var context = {
        menu: level === "01" ? "menuForManager.ejs" : "menuForCustomer.ejs",
        who: req.session.name,
        body: "boardtypeCU.ejs",
        logined: "YES",
        cu: "C",
        boardtypes: bor,
        level: level,
      };

      req.app.render("home", context, (err, html) => {
        if (err) {
          throw err;
        }
        res.end(html);
      });
    });
  },
  typecreate_process: (req, res) => {
    var post = req.body;
    db.query(
      `INSERT INTO boardtype (title ,description, numPerPage, write_YN, re_YN)
        VALUES(?, ?, ?, ?, ?)`,
      [
        post.title,
        post.description,
        post.numPerPage,
        post.write_YN,
        post.re_YN,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/board/type/view` });
        res.end();
      }
    );
  },
  typeupdate: (req, res) => {
    
    const level = req.session.class;
    const id = req.params.PageId;
    db.query("SELECT * FROM boardtype WHERE type_id = ?", [id], (err, bor) => {
      var context = {
        menu: level === "01" ? "menuForManager.ejs" : "menuForCustomer.ejs",
        who: req.session.name,
        body: "boardtypeCU.ejs",
        logined: "YES",
        cu: "U",
        boardtypes: bor,
        level: level,
      };

      req.app.render("home", context, (err, html) => {
        if (err) {
          throw err;
        }
        res.end(html);
      });
    });
  },

  typeupdate_process: (req, res) => {
    var post = req.body;
    db.query(
      `UPDATE boardtype SET title=?, description=?, write_YN=?, re_YN=?, numPerPage=? WHERE type_id=?`,
      [
        post.title,
        post.description,
        post.write_YN,
        post.re_YN,
        post.numPerPage,
        post.type_id,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/board/type/view` });
        res.end();
      }
    );
  },
  typedelete_process: (req, res) => {
    const id = req.params.PageId;
    db.query("DELETE FROM boardtype WHERE type_id = ?", [id], (error, mer) => {
      if (error) {
        throw error;
      }
      res.writeHead(302, { Location: `/board/type/view` });
      res.end();
    });
  },
  view: (req, res) => {
    const typeId = req.params.typeId;
    const pNum = req.params.pNum;
    const level = req.session.class;
    const name = req.session.name;
  
    db.query("SELECT * FROM boardtype", (err, bor) => {
      db.query("SELECT numPerPage FROM boardtype WHERE type_id = ?", [typeId], (err, result) => {
        if (err) {
          throw err;
        }
  
        const numPerPage = result[0].numPerPage;
        const offset = (pNum - 1) * numPerPage;
  
        db.query("SELECT COUNT(*) as total FROM board WHERE type_id = ?", [typeId], (err, totalResult) => {
          if (err) {
            throw err;
          }
  
          const totalRows = totalResult[0].total;
          const totalPages = Math.ceil(totalRows / numPerPage);
  
          db.query(
            "SELECT b.*, p.name as authorName " +
            "FROM board b INNER JOIN person p ON b.loginid = p.loginid " +
            "WHERE b.type_id = ? " +
            "ORDER BY b.date DESC, b.board_id DESC " +
            "LIMIT ? OFFSET ?",
            [typeId, numPerPage, offset],
            (err, bor2) => {
              if (err) {
                throw err;
              }
              db.query("SELECT name, loginid FROM person", (err, per) => {
                if (err) {
                  throw err;
                }
                // 전체 페이지 수 및 현재 페이지를 context에 추가합니다.
                var context = {
                  menu: level === "01" ? "menuForManager.ejs" : "menuForCustomer.ejs",
                  who: req.session.name,
                  body: "board.ejs",
                  logined: "YES",
                  boardtypes: bor,
                  board: bor2,
                  typeId: typeId,
                  pNum: pNum,
                  person: per,
                  level: level,
                  name: name,
                  totalPages: totalPages,
                  currentPage: pNum,
                };
  
  
  
                req.app.render("home", context, (err, html) => {
                  res.end(html);
                });
              });
            }
          );
        });
      });
    });
  },
  
  
  

  detail: (req, res) => {
    const boardId = req.params.boardId;
    const pNum = req.params.pNum;
    const level = req.session.class;
    const name = req.session.name;
    const loginid = req.session.loginid;
    db.query("SELECT * FROM boardtype", (err, bor) => {
      db.query(
        "SELECT * FROM board WHERE board_Id = ?",
        [boardId],
        (err, bor2) => {
          db.query("SELECT name, loginid FROM person", (err, per) => {
            var context = {
              menu: level === "01" ? "menuForManager.ejs" : "menuForCustomer.ejs",
              who: req.session.name,
              body: "boardCRU.ejs",
              logined: "YES",
              boardtypes: bor,
              board: bor2,
              pNum: pNum,
              cru: "R",
              person: per,
              level: level,
              name: name,
              loginid: loginid,
            };
      
            req.app.render("home", context, (err, html) => {
              res.end(html);
            });
          });
        }
      );
    });
  },

  create: (req, res) => {
    const boardId = req.params.boardId;
    const level = req.session.class;
    const name = req.session.name;
    const loginid = req.session.loginid;
    const password = req.session.loginid;
    const time = getTime.dateOfEightDigit();
    const type_id = req.params.typeId;
    db.query("SELECT * FROM boardtype", (err, bor) => {
      db.query(
        "SELECT * FROM board WHERE board_Id = ?",
        [boardId],
        (err, bor2) => {
          db.query("SELECT name, loginid FROM person", (err, per) => {
            var context = {
              menu: level === "01" ? "menuForManager.ejs" : "menuForCustomer.ejs",
              who: req.session.name,
              body: "boardCRU.ejs",
              logined: "YES",
              boardtypes: bor,
              board: bor2,
              cru: "C",
              person: per,
              level: level,
              name: name,
              loginid: loginid,
              password: password,
              time: time,
              type_id: type_id
            };
        
            req.app.render("home", context, (err, html) => {
              res.end(html);
            });
          });
        }
      );
    });
  },

  create_process: (req, res) => {
    var post = req.body;
    db.query(
      `INSERT INTO board (type_id , loginid, password, title, date, content)
        VALUES(?, ?, ?, ?, ?, ?)`,
      [
        post.typeId,
        post.loginId,
        post.password,
        post.title,
        post.created_at,
        post.content
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/board/type/view` });
        res.end();
      }
    );
  },
  delete_process: (req, res) => {
    const id = req.params.boardId;
    db.query("DELETE FROM board WHERE board_id = ?", [id], (error, bor) => {
      if (error) {
        throw error;
      }
      res.writeHead(302, { Location: `/board/type/view` });
      res.end();
    });
  },

  update: (req, res) => {
    const boardId = req.params.boardId;
    const type_id = req.params.typeId;
    const pNum = req.params.pNum;
    const level = req.session.class;
    const name = req.session.name;
    const loginid = req.session.loginid;
    const password = req.session.loginid;
    
    db.query("SELECT * FROM boardtype", (err, bor) => {
      db.query(
        "SELECT * FROM board WHERE board_Id = ?",
        [boardId],
        (err, bor2) => {
          db.query("SELECT name, loginid FROM person", (err, per) => {
            var context = {
              menu: level === "01" ? "menuForManager.ejs" : "menuForCustomer.ejs",
              who: req.session.name,
              body: "boardCRU.ejs",
              logined: "YES",
              boardtypes: bor,
              board: bor2,
              pNum: pNum,
              cru: "U",
              person: per,
              level: level,
              name: name,
              loginid: loginid,
              password: password,
              type_id: type_id
            };
           
            req.app.render("home", context, (err, html) => {
              res.end(html);
            });
          });
        }
      );
    });
  },


update_process: (req, res) => {
  var post = req.body;
  db.query(
    `UPDATE board SET title=?, content=? WHERE board_id=?`,
    [
      post.title,
      post.content,
      post.boardid
    ],
    (error, result) => {
      if (error) {
        throw error;
        
      }
      res.writeHead(302, { Location: `/board/type/view` });
      res.end();
    }
  );
}
};
