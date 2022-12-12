const express = require('express');
const router = express.Router();

const genre_controller = require('../controllers/genre_controller')

/* GET genres listing. */
router.get('/', genre_controller.genre_list);

//GET genre creation page
router.get('/create', genre_controller.genre_create_get);

//POST genre for a Genre
router.post('/create', genre_controller.genre_create_post);

//GET genre update page
router.get('/:id/update', genre_controller.genre_update_get);

//POST genre update page
router.post('/:id/update', genre_controller.genre_update_post);

//GET genre details for one Genre
router.get('/:id', genre_controller.genre_details);





module.exports = router;
