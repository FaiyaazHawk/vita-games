var express = require('express');
var router = express.Router();

const game_controller = require("../controllers/game_controller")

/* GET games listing. */
router.get('/', game_controller.games_list);

module.exports = router;
