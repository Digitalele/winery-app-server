const express = require('express');
const router = express.Router();
const Buyer = require('../../models/User');
const Product = require('../../models/Product');
const upload = require('../../config/multer');

/* GET Buyers */
router.get('/', (req, res, next) => {
  Buyer.find({role: { "$in" : ["Buyer"]}}, (err, buyers) => {
    if (err) { return res.json(err).status(500); }

    return res.json(buyers);
  });
});

/* GET Specific Buyers */
router.get('/:id', (req, res, next) => {
  Buyer.findById(req.params.id, (err, buyer) => {
    if (err) { return res.status(500).json(err); }
    if (!buyer) { return res.status(404).json(new Error("404")) }

    return res.json(buyer);
  });
});


/* CREATE a new Buyer. */
router.post('/newbuyer', upload.single('file'), function(req, res) {
  const buyer = new Buyer({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    image: `/uploads/${req.file.filename}` || ''
    
  });

  buyer.save((err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'New Buyer created!',
      buyer: buyer
    });
  });
});
  

/* PUT update buyer */
router.put('/update/:id', (req, res) => {
  
    const updates = {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role
    };
    
    Buyer.findByIdAndUpdate(req.params.id, updates, (err) => {
      if (err) {
        res.json(err);
        return;
      }
  
      res.json({
        message: 'Buyer updated successfully'
      });
    });
  })
  

/* DELETE a Buyer. */
router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;

    Buyer.findByIdAndRemove(id, (err, buyer) => {
        if (err) {
            res.json(err);
            return;
        }
        return res.json({
            message: 'Buyer has been removed!'
        });
    });
});

/* CART */

// /* GET cart product details. */
router.get('/cart/:id', (req, res) => {
  Buyer
      .findById(req.params.id)
      .select('amount cartItems')
      .exec((err, product) => {
        if (err) {
          res.json(err);
        return;
        }
        console.log(product)
      res.json(product);
  });
});


/*Add new intem in cart*/
router.put('/add/:id', (req, res) => {

    let userId = req.params.id;
    let itemId = req.body._id;
    
   const item = {   
      price: req.body.price,
      type: req.body.type,
      name: req.body.name,
      productId: req.body._id,
    };

  Buyer.findByIdAndUpdate(userId,  
    { $inc: { amount: 1 }, $push: { cartItems: item }},  
    (err) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json({
        message: 'Cart updated successfully'
        });
      });
  });
//
//


/* PUT remove item from Cart */
router.put('/cart/delete/', (req, res) => { 

  let userId = req.body.userId;
  let itemId = req.body.item;
  
  Buyer.findByIdAndUpdate(userId, 
    { $inc: { amount: -1 }, $pull: { cartItems: { _id: itemId } } }, (err) => {
     if (err) {
      res.json(err);
      return;
    }
    res.json({
      message: 'Item in cart deleted successfully'
      });
    });
  });



module.exports = router;
