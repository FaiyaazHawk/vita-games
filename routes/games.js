var express = require('express');
var router = express.Router();

const game_controller = require("../controllers/game_controller")

/* GET games listing. */
router.get('/', game_controller.games_list);

//GET game creation page
router.get('/create', game_controller.game_create_get);

//POST genre for a dev
router.post('/create', game_controller.game_create_post);

//Get games detail for single game

router.get('/:id', game_controller.game_detail);

module.exports = router;
