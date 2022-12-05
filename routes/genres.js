var express = require('express');
var router = express.Router();

const genre_controller = require('../controllers/genre_controller')

/* GET genres listing. */
router.get('/', genre_controller.genre_list);

module.exports = router;
