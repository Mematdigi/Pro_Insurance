/*
 * Memat Digi Inc
 * Copyright (c) 2023-Present Copper Digital
 * Contact at copper digital dot com
 */

const express = require('express');
const router = express.Router();
const notificationRoute = require('./notification.route');

const defaultRoutes = [
  {
    path: '/notification',
    route: notificationRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
