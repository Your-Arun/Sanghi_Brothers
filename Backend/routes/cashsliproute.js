const express = require('express');
const router = express.Router();
const CashSlip = require('../models/cashslipmodal');


router.post('/Cashslip', async (req, res) => {
    try {
        const datasheet = new CashSlip(req.body);
        await datasheet.save();
        res.status(201).send(datasheet);
    } catch (error) {
        console.error(error);
        res.status(400).send('Error saving data.');
    }
});

router.get('/Cashslip', async (req, res) => {
    try {
        const datasheet = await CashSlip.find();
        res.send(datasheet);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data.');
    }
});

