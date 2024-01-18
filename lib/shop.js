// 201935302 은현수

var db = require("./db");
var getTime = require("./template");

function authIsOwner(req, res) {
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  home: (req, res) => {
    const category = req.params.category;
    const level = req.session.class;
    const isOwner = authIsOwner(req, res);
  
    if (isOwner) {
      let menu, vu;
      if (req.session.class === "01") {
        menu = "menuForManager.ejs";
        vu = "v";
      } else if (req.session.class === "02") {
        menu = "menuForCustomer.ejs";
        vu = "v";
      } else if (req.session.class === "00") {
        menu = "menuForMIS.ejs";
        vu = "v";
      }
  
      db.query("SELECT name, price, brand, image, mer_id, category FROM merchandise", (err, mer) => {
        if (err) {
          throw err;
        }
  
        db.query("SELECT * FROM boardtype", (err, bor) => {
          const context = {
            menu: menu,
            who: req.session.name,
            body: "merchandise.ejs",
            logined: "YES",
            boardtypes: bor,
            vu: vu,
            merdata: mer,
            category: category,
          };
  
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      });
    } else {
      db.query("SELECT name, price, brand, image, mer_id, category FROM merchandise", (err, mer) => {
        if (err) {
          throw err;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
          const context = {
            menu: "menuForCustomer.ejs",
            who: req.session.name,
            body: "merchandise.ejs",
            logined: "NO",
            boardtypes: bor,
            vu: "v",
            merdata: mer,
            category: category,
          };
  
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      });
    }
  },
  
  search: (req, res) => {
    var category = "all";
    var post = req.body;
    var isOwner = authIsOwner(req, res);
    var level = req.session.class;
    sql2 = `SELECT * from merchandise
        WHERE name like '%${post.search}%' or brand like '%${post.search}%' or supplier like '%${post.search}%'`;
    db.query(sql2, (err, mer) => {
      if (err) {
        throw err;
      }
      db.query("SELECT * FROM boardtype", (err, bor) => {
        var context = {
          menu:
            isOwner && req.session.class === "01"
              ? "menuForManager.ejs"
              : "menuForCustomer.ejs",
          who: req.session.name,
          body: "merchandise.ejs",
          logined: req.session.is_logined ? "YES" : "NO",
          boardtypes: bor,
          vu: "v",
          merdata: mer,
          category: category,
          level: level,
        };

        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },
  detail: (req, res) => {
    const time = getTime.dateOfEightDigit();
    var loginid = req.session.loginid;
    var merId = req.params.merId;
    var isOwner = authIsOwner(req, res);
    var level = req.session.class;
    db.query(
      "SELECT name, price, brand, image, mer_id, category FROM merchandise WHERE mer_id = ?",
      [merId],
      (err, mer) => {
        if (err) {
          throw err;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
          var context = {
            menu:
              isOwner && req.session.class === "01"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            body: "merchandisedetail.ejs",
            logined: req.session.is_logined ? "YES" : "NO",
            boardtypes: bor,
            merdata: mer,
            level: level,
            time: time,
            loginid: loginid,
          };
          console.log(context);
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      }
    );
  },
  purchase: (req, res) => {
    var merId = req.params.merId;
    var level = req.session.class;
    const loginid = req.session.loginid;
    const time = getTime.dateOfEightDigit();
    db.query(
      "SELECT name, price, brand, image, mer_id, category FROM merchandise WHERE mer_id = ?",
      [merId],
      (err, mer) => {
        if (err) {
          throw err;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
          var context = {
            menu:
              req.session.class === "01"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            body: "merchandisepurchase.ejs",
            logined: req.session.is_logined ? "YES" : "NO",
            boardtypes: bor,
            merdata: mer,
            level: level,
            loginid: loginid,
            time: time,
          };
          console.log(context);
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      }
    );
  },

  purchase_process: (req, res) => {
    var post = req.body;
    db.query(
      `INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total)
  VALUES(?,?,?,?,?,?,?)`,
      [
        post.loginid,
        post.mer_id,
        post.time,
        post.price,
        post.point,
        post.quantity,
        post.total,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/shop/purchase_list` });
        res.end();
      }
    );
  },
  purchase_list: (req, res) => {
    var loginid = req.session.loginid;
    db.query(
      "SELECT p.purchase_id, p.date, p.price, p.point, p.qty, p.total, p.cancel, m.name AS merchandise_name, m.image AS merchandise_image " +
        "FROM purchase AS p " +
        "INNER JOIN merchandise AS m ON p.mer_id = m.mer_id " +
        "WHERE p.loginid = ?" +
        "ORDER BY p.date DESC",
      [loginid],
      (err, pur) => {
        if (err) {
          throw err;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
          var context = {
            menu:
              req.session.class === "01"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            body: "purchaselist.ejs",
            logined: req.session.is_logined ? "YES" : "NO",
            boardtypes: bor,
            purchase: pur,
          };
          console.log(context);
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      }
    );
  },

  purchase_cancel: (req, res) => {
    var purchaseId = req.params.purchaseId;
    db.query(
      "UPDATE purchase SET cancel = 'Y' WHERE purchase_id = ?",
      [purchaseId],
      (err, pur) => {
        if (err) {
          throw err;
        }
        res.writeHead(302, { Location: `/purchase` });
        res.end();
      }
    );
  },
  cart_process: (req, res) => {
    var post = req.body;
    db.query(
      `INSERT INTO cart (loginid, mer_id, date)
  VALUES(?,?,?)`,
      [post.loginid, post.merid, post.time],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/purchase/cart` });
        res.end();
      }
    );
  },
  cart: (req, res) => {
    var loginid = req.session.loginid;
    db.query(
      `SELECT cart.*, merchandise.image, merchandise.name, merchandise.price FROM cart
        INNER JOIN merchandise ON cart.mer_id = merchandise.mer_id
        WHERE cart.loginid = ?`,
      [loginid],
      (error, cart) => {
        if (error) {
          throw error;
        }
        db.query("SELECT * FROM boardtype", (err, bor) => {
          var context = {
            menu:
              req.session.class === "01"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            body: "merchandisecart.ejs",
            logined: req.session.is_logined ? "YES" : "NO",
            boardtypes: bor,
            cart: cart,
          };

          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      }
    );
  },
  // cart_purchase_process 함수
  cart_purchase_process: async (req, res) => {
    var posts = req.body;
    console.log(posts);

    let shouldRedirect = true; // 초기값을 true로 설정

    for (let i = 0; i < posts.quantity.length; i++) {
      const quantity = posts.quantity[i];

      // quantity가 0이 아닌 경우에만 insert 및 delete 수행
      if (quantity !== "0") {
        console.log(quantity);

        // INSERT 수행
        try {
          await new Promise((resolve, reject) => {
            db.query(
              `INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                posts.loginid[i],
                posts.merid[i],
                posts.date[i],
                posts.price_hidden[i],
                posts.point[i],
                quantity,
                posts.total[i],
              ],
              (error, result) => {
                if (error) {
                  shouldRedirect = false; // 하나라도 insert 실패하면 false로 설정
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });

          // INSERT 성공한 경우에만 DELETE 수행
          await new Promise((resolve, reject) => {
            db.query(
              `DELETE FROM cart WHERE mer_id = ?`,
              [posts.merid[i]],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });
        } catch (error) {
          console.error(error);
          // 에러 처리 로직 추가
        }
      }
    }

    // shouldRedirect가 true일 때만 리다이렉션 실행
    if (shouldRedirect) {
      res.writeHead(302, { Location: `/purchase/cart` });
      res.end();
    }
  },

  cartview: (req, res) => {
    const level = req.session.class;
    db.query("SELECT * FROM cart", (err, cart) => {
      if (err) {
        throw error;
      }
      db.query("SELECT * FROM boardtype", (err, bor) => {
        const vu = req.params.vu;
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "cart.ejs",
          logined: "YES",
          cart: cart,
          vu: vu,
          boardtypes: bor,
          level: level,
        };

        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },
  cart_create: (req, res) => {
    const time = getTime.dateOfEightDigit();
    const level = req.session.class;

    db.query("SELECT * FROM boardtype", (err, bor) => {
      db.query("SELECT loginid FROM person", (err, persons) => {
        db.query("SELECT mer_id FROM merchandise", (err, merchandise) => {
          var context = {
            menu: "menuForManager.ejs",
            who: req.session.name,
            body: "cartCU.ejs",
            logined: "YES",
            check: "create",
            boardtypes: bor,
            level: level,
            time: time,
            persons: persons,
            merchandise: merchandise,
          };

          req.app.render("home", context, (err, html) => {
            if (err) {
              throw err;
            }
            res.end(html);
          });
        });
      });
    });
  },
  cart_create_process: (req, res) => {
    var post = req.body;
    db.query(
      `INSERT INTO cart (loginid, mer_id, date)
VALUES(?, ?, ?)`,
      [post.login_id, post.mer_id, post.date],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/shop/cart/view` });
        res.end();
      }
    );
  },

  cart_update: (req, res) => {
    const time = getTime.dateOfEightDigit();
    const level = req.session.class;
    db.query(
      "SELECT * FROM cart WHERE cart_id = ?",
      [req.params.cartId],
      (err, cart) => {
        db.query("SELECT * FROM boardtype", (err, bor) => {
          db.query("SELECT loginid FROM person", (err, persons) => {
            db.query("SELECT mer_id FROM merchandise", (err, merchandise) => {
              var context = {
                menu: "menuForManager.ejs",
                who: req.session.name,
                body: "cartCU.ejs",
                logined: "YES",
                check: "update",
                boardtypes: bor,
                level: level,
                time: time,
                persons: persons,
                merchandise: merchandise,
                cart: cart,
                cartid: req.params.cartId,
              };

              req.app.render("home", context, (err, html) => {
                if (err) {
                  throw err;
                }
                res.end(html);
              });
            });
          });
        });
      }
    );
  },
  cart_update_process: (req, res) => {
    var post = req.body;
    db.query(
      `UPDATE cart SET loginid = ?, mer_id = ? , date = ? WHERE cart_id = ?`,
      [post.login_id, post.mer_id, post.date, post.cart_id],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/shop/cart/view` });
        res.end();
      }
    );
  },
  cart_delete_process: (req, res) => {
    const id = req.params.merId;
    db.query("DELETE FROM cart WHERE cart_id = ?", [id], (error, cart) => {
      if (error) {
        throw error;
      }
      res.writeHead(302, { Location: `/shop/cart/view` });
      res.end();
    });
  },

  purchasehistoryview: (req, res) => {
    const level = req.session.class;
    db.query("SELECT * FROM purchase", (err, ph) => {
      if (err) {
        throw err;
      }
      db.query("SELECT * FROM boardtype", (err, bor) => {
        const vu = req.params.vu;
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "purchasehistory.ejs",
          logined: "YES",
          purchaseHistory: ph,
          boardtypes: bor,
          level: level,
        };

        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },
  purchasehistory_create: (req, res) => {
    const time = getTime.dateOfEightDigit();
    const level = req.session.class;
    db.query("SELECT * FROM boardtype", (err, bor) => {
      db.query("SELECT loginid FROM person", (err, persons) => {
        db.query("SELECT mer_id FROM merchandise", (err, merchandise) => {
          var context = {
            menu: "menuForManager.ejs",
            who: req.session.name,
            body: "purchasehistoryCU.ejs",
            logined: "YES",
            check: "create",
            boardtypes: bor,
            level: level,
            time: time,
            persons: persons,
            merchandise: merchandise,
          };

          req.app.render("home", context, (err, html) => {
            if (err) {
              throw err;
            }
            res.end(html);
          });
        });
      });
    });
  },
  purchasehistory_create_process: (req, res) => {
    var post = req.body;
    console.log(post);
    db.query(
      `INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.login_id,
        post.mer_id,
        post.date,
        post.price,
        post.point,
        post.qty,
        post.total,
        post.payYN,
        post.cancel,
        post.refund,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/shop/purchasehistory/view` });
        res.end();
      }
    );
  },
  purchasehistory_delete_process: (req, res) => {
    const id = req.params.merId;
    db.query(
      "DELETE FROM purchase WHERE purchase_id = ?",
      [id],
      (error, cart) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/shop/purchasehistory/view` });
        res.end();
      }
    );
  },
  purchasehistory_update: (req, res) => {
    const time = getTime.dateOfEightDigit();
    const level = req.session.class;
    db.query(
      "SELECT * FROM purchase WHERE purchase_id = ?",
      [req.params.purchaseId],
      (err, pur) => {
        db.query("SELECT * FROM boardtype", (err, bor) => {
          db.query("SELECT loginid FROM person", (err, persons) => {
            db.query("SELECT mer_id FROM merchandise", (err, merchandise) => {
              var context = {
                menu: "menuForManager.ejs",
                who: req.session.name,
                body: "purchasehistoryCU.ejs",
                logined: "YES",
                check: "update",
                boardtypes: bor,
                level: level,
                time: time,
                persons: persons,
                merchandise: merchandise,
                purchaseHistory: pur,
                purchaseid: req.params.purchaseId,
              };
              console.log(context);
              req.app.render("home", context, (err, html) => {
                if (err) {
                  throw err;
                }
                res.end(html);
              });
            });
          });
        });
      }
    );
  },

  purchasehistory_update_process: (req, res) => {
    var post = req.body;
    db.query(
      `UPDATE purchase SET loginid = ?, mer_id = ? , date = ?, price = ?, point = ?, qty = ?, total = ?, payYN = ?, cancel = ?, refund = ? WHERE purchase_id = ?`,
      [
        post.login_id,
        post.mer_id,
        post.date,
        post.price,
        post.point,
        post.qty,
        post.total,
        post.payYN,
        post.cancel,
        post.refund,
        post.purchase_id,
      ],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.writeHead(302, { Location: `/shop/purchasehistory/view` });
        res.end();
      }
    );
  },

  customeranal: (req, res) => {
    var isOwner = authIsOwner(req, res);
    if (isOwner) {
      if (req.session.class === "00") {
        var sql1 = `select * from boardtype;`;
        var sql2 = `select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate
  from person group by address;`;
        db.query(sql1 + sql2, (error, results) => {
          var context = {
            /*********** home.ejs에 필요한 변수 ***********/
            menu: "menuForMIS.ejs",
            body: "customerAnal.ejs",
            /*********** menuForMIS.ejs에 필요한 변수 ***********/
            who: req.session.name,
            logined: "YES",
            boardtypes: results[0],
            /*********** customerAnal.ejs에 필요한 변수 ***********/
            percentage: results[1],
          };
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      }
    }
  },

  merchandiseanal: (req, res) => {
    var isOwner = authIsOwner(req, res);
    if (isOwner) {
      if (req.session.class === "00") {
        var sql1 = `select * from boardtype;`;
        var sql2 = `select 
                        CASE
                            WHEN price BETWEEN 1000 AND 2000 THEN '1000-2000'
                            WHEN price BETWEEN 2000 AND 5000 THEN '2000-5000'
                            WHEN price BETWEEN 5000 AND 10000 THEN '5000-10000'
                            ELSE '기타'
                        END as price_range,
                        ROUND(( count(*) / ( select count(*) from merchandise )) * 100, 2) as rate
                    from merchandise 
                    group by price_range;`;
        db.query(sql1 + sql2, (error, results) => {
          var context = {
            /*********** home.ejs에 필요한 변수 ***********/
            menu: "menuForMIS.ejs",
            body: "merchandiseAnal.ejs",
            /*********** menuForMIS.ejs에 필요한 변수 ***********/
            who: req.session.name,
            logined: "YES",
            boardtypes: results[0],
            /*********** customerAnal.ejs에 필요한 변수 ***********/
            percentage: results[1],
            
          };
          console.log(context);
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        });
      }
    }
  },
};
