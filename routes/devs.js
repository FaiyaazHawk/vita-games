var express = require('express');
var router = express.Router();

const dev_controller = require("../controllers/dev_controller")

/* GET devs listing. */
router.get('/', dev_controller.dev_list);

//GET dev creation page
router.get('/create', dev_controller.dev_create_get);

//POST genre for a dev
router.post('/create', dev_controller.dev_create_post);

//GET genre update page
router.get('/:id/update', dev_controller.dev_update_get);

//POST genre update page
router.post('/:id/update', dev_controller.dev_update_post);

//GET dev details
router.get('/:id', dev_controller.dev_details)

module.exports = router;
