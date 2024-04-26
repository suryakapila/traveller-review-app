const router = require('express').Router();
const Pin = require('../models/pin');
//create a pin
router.post('/', async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        console.log('\x1b[42m%s\x1b[0m','[Success] Pin added to DB');
        res.status(200).json(savedPin);
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m','[Failed] Pin not added to DB');
        res.status(500).json(error);
    }
});
//get all pins and filter friends' pins
router.get('/', async (req, res) => {
    try {
        const pins = await Pin.find();
        console.log('\x1b[42m%s\x1b[0m','[Success] Pins fetched from DB');
        res.status(200).json(pins);
    } catch (error) {
                console.log('\x1b[41m%s\x1b[0m','[Failed] Pins not fetched from DB');
        res.status(500).json(error);
    }
});
//update a pin
router.put('/:id', async (req, res) => {
    try {
        const updatedPin = await Pin.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        res.status(200).json(updatedPin);
    } catch (error) {
        res.status(500).json(error.message);
    }
});
//delete a pin
router.delete('/:id', async (req, res) => {
    try {
        await Pin.findByIdAndDelete(req.params.id);
        res.status(200).json('Pin has been deleted');
    } catch (error) {
        res.status(500).json(error.message);
    }
});
module.exports = router;