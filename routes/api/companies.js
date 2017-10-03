const express = require('express');
const router = express.Router();
const Company = require('../../models/User');

/* GET Companies */
router.get('/', (req, res, next) => {
    Company.find({ role: { "$in": ["Company"] } }, (err, companies) => {
        console.log(res)
        if (err) { return res.json(err).status(500); }

        return res.json(companies);
    });
});

router.get('/:id', (req, res, next) => {
    Company.findById(req.params.id, (err, company) => {
        if (err) { return res.status(500).json(err); }
        if (!company) { return res.status(404).json(new Error("404")) }

        return res.json(company);
    });
});


/* POST new Company. */
router.post('/newcompany', (req, res, next) => {
    const company = new Company({
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        image: req.body.image || ''
    });

    company.save((err) => {
        if (err) {
            res.json(err);
            return;
        }

        return res.json({
            message: 'New company created!',
            company: company
        });
    });
});


/* UPDATE Company */
router.put('/update/:id', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    const updates = {
        name: req.body.name,
        desc: req.body.desc,
        specs: req.body.specs,
        image: req.body.image
    };

    Company.findByIdAndUpdate(req.params.id, updates, (err) => {
        if (err) {
            res.json(err);
            return;
        }

        res.json({
            message: 'Company updated successfully'
        });
    });
});

/* DELETE a Company. */
router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;

    Company.findByIdAndRemove(id, (err, product) => {
        if (err) {
            res.json(err);
            return;
        }
        return res.json({
            message: 'Company has been removed!'
        });
    });
});





module.exports = router;