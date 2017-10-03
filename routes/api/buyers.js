const express = require('express');
const router = express.Router();
const Buyer = require('../../models/User');
const upload = require('../../config/multer');

/* GET Buyers */
router.get('/', (req, res, next) => {
  
  Buyer.find({role: { "$in" : ["Buyer"]}}, (err, buyers) => {
    console.log(res)
    if (err) { return res.json(err).status(500); }

    return res.json(buyers);
  });
});

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
  

/* UPDATE Buyer */
router.put('/update/:id', (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    const updates = {
      name: req.body.name,
      desc: req.body.desc,
      specs: req.body.specs,
      image: req.body.image
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
  

/* DELETE Buyer */
router.delete('/delete/:id', (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    
    Buyer.remove({ _id: req.params.id }, (err) => {
      if (err) {
        res.json(err);
        return;
      }
  
      return res.json({
        message: 'Buyer has been removed!'
      });
    })
  });

module.exports = router;
