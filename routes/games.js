var express = require('express');
var router = express.Router();

const game_controller = require("../controllers/game_controller")

/* GET games listing. */
router.get('/', game_controller.games_list);

//GET game creation page
router.get('/create', game_controller.game_create_get);

//POST game creation page
router.post('/create', game_controller.game_create_post);

//GET game update page
router.get('/:id/update', game_controller.game_update_get);

//POST game update page
router.post('/:id/update', game_controller.game_update_post);

//GET game delete page
router.get('/:id/delete', game_controller.game_delete_get);

//POST game delete page
router.post('/:id/delete', game_controller.game_delete_post);

//Get games detail for single game

router.get('/:id', game_controller.game_detail);

module.exports = router;
