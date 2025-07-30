/*
 * Memat Digi Inc
 * Contact at copper digital dot com
 */

const express = require('express');
const router = express.Router();
const notificationRoute = require('./notification.route');
const customerRoute = require('./customer.route');

const defaultRoutes = [
  {
    path: '/notification',
    route: notificationRoute
  },
  {
    path: '/customer',
    route: customerRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
