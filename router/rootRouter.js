//201935302 은현수

const express = require('express');
var router = express.Router()
const multer = require("multer");
var shop = require('../lib/shop');
const storage = multer.memoryStorage(); // 파일을 메모리에 저장
const upload = multer({ storage: storage });

router.get('/',(req, res)=>{
    shop.home(req, res);
}); 

router.get('/shop/:category', (req, res)=>{

    shop.home(req, res);
}); 

router.post('/shop/search', (req, res)=>{
    shop.search(req, res);
}); 

router.get('/shop/detail/:merId', (req, res)=>{
    shop.detail(req, res);
}); 

router.get('/shop/purchase/:merId', (req, res)=>{    

    shop.purchase(req, res);
});

router.post('/shop/purchase_process', (req, res)=>{    
    shop.purchase_process(req, res);
});

router.get('/purchase', (req, res)=>{    
    shop.purchase_list(req, res);
});

router.post('/purchase/cancel/:purchaseId', (req, res)=>{
    shop.purchase_cancel(req, res);
});

router.post('/purchase/cart_process', (req, res)=>{
    shop.cart_process(req, res);
});

router.get('/purchase/cart', (req, res)=>{
    shop.cart(req, res);
});

router.post('/purchase/cart_purchase_process', (req, res) =>{
    shop.cart_purchase_process(req, res);
});

router.get('/shop/cart/view', (req, res)=>{
    shop.cartview(req, res);
});


router.get('/shop/cart/create', (req, res)=>{
    shop.cart_create(req, res);
});

router.post('/shop/cart/create_process', (req, res)=>{
    shop.cart_create_process(req, res);
});

router.get('/shop/cart/delete_process/:merId', (req, res)=>{
    shop.cart_delete_process(req, res);
});


router.get('/shop/cart/update/:cartId', (req, res)=>{
    shop.cart_update(req, res);
   
});

router.post('/shop/cart/cart_update_process', (req, res)=>{
    shop.cart_update_process(req, res);
   
});

router.get('/shop/purchasehistory/view', (req, res)=>{
    shop.purchasehistoryview(req, res);
});


router.get('/shop/purchasehistory/create', (req, res)=>{
    shop.purchasehistory_create(req, res);
});

router.post('/shop/purchasehistory/create_process', (req, res)=>{
    shop.purchasehistory_create_process(req, res);
});

router.get('/shop/purchasehistory/delete_process/:merId', (req, res)=>{
    shop.purchasehistory_delete_process(req, res);
});


router.get('/shop/purchasehistory/update/:purchaseId', (req, res)=>{
    shop.purchasehistory_update(req, res);
   
});

router.post('/shop/purchasehistory/update_process', (req, res)=>{
    shop.purchasehistory_update_process(req, res);
   
});

router.get('/shop/anal/customer', (req, res)=>{
    shop.customeranal(req, res);
});

router.get('/shop/anal/merchandise', (req, res)=>{
    shop.merchandiseanal(req, res);
});
module.exports = router;

