const express = require('express');
const router = express.Router();
const controller = require("../controllers/controller");

// ROUTES
router.get('/', controller.home);
router.get('/signup', controller.nav_signup);
router.get("/dashboard", controller.dashboard);
router.get("/getMessages", controller.getMessages);

router.post('/signup', controller.post_signup);
router.post('/login', controller.post_login);
router.post('/upgradeStatus', controller.upgrade_status);
router.post('/logout', controller.logout);
router.post('/postMessage', controller.postMessage);

module.exports = router;
