const express = require('express');
const router = express.Router();
const Container = require('../models/Container');

router.get('/', async (req, res) => {
    const containers = await Container.find();
    res.json(containers);
});

module.exports = router;
