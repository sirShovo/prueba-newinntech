const router = require('express').Router();
const { validateToken } = require('../config/jwt.config');
const UsersController = require('../controllers/users.controller');

router.get('/login', [], UsersController.login);
router.get('/get_data', validateToken, UsersController.get_data);
router.post('/register', [], UsersController.register);
router.get('/confirm/:token', [], UsersController.confirm);
router.get('/forgot', [], UsersController.forgot);
router.post('/recovery', validateToken, UsersController.recovery);


module.exports = router;
