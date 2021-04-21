const express = require('express');

const aboutUsController = require('../controllers/aboutUsController')
const router = express.Router();

router.get('/', aboutUsController.getAllMails)

router.get('/:mailId', aboutUsController.getContactMailInfo)

router.post('/', aboutUsController.sendContactMail)

router.delete('/:mailId', aboutUsController.sendContactMail)

module.exports = router;