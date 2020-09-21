const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const sauceCtrl = require('../controllers/controllerSauce');

router.post('/',auth, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.search);
router.get('/:id', auth, sauceCtrl.searchOne);
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;