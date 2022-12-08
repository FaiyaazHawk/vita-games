var express = require('express');
var router = express.Router();

const dev_controller = require("../controllers/dev_controller")

/* GET devs listing. */
router.get('/', dev_controller.dev_list);

//GET dev details
router.get('/:id', dev_controller.dev_details)

module.exports = router;
