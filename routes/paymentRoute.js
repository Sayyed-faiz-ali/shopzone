const express = require('express');
const payment_route = express();

const paymentController = require('../controllers/paymentController');

payment_route.get('/', paymentController.renderBuyPage);
// payment_route.post('/pay', paymentController.payProduct);
payment_route.post('/pay/:_id', paymentController.payProduct);

payment_route.get('/success', paymentController.successPage);

payment_route.get('/cancel', paymentController.cancelPage);
module.exports = payment_route;