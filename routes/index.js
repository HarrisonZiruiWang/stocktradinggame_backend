var express = require('express');
var router = express.Router();
let dataController = require('../controllers/dataController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('../public/index.html');
});
router.post('/login', dataController.login);
router.post('/postSavedData', dataController.postSavedData);
router.post('/postSavedDataCh', dataController.postSavedDataCh);

router.get('/getServerID', dataController.getserverUIDcount);
router.get('/getData', dataController.getExcelSheet);
module.exports = router;
