const express = require('express');
const router = express.Router();

const genre_controller = require('../controllers/genre_controller')

/* GET genres listing. */
router.get('/', genre_controller.genre_list);

//GET genre details for one Genre
router.get('/genre/:id', genre_controller.genre_details);

module.exports = router;
