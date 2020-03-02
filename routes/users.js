var express = require('express');
var router = express.Router();
let userController = require('../controllers/userController');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', userController.postUserData);
router.post('/login', userController.logInUser);

module.exports = router;
