const paypal = require('paypal-rest-sdk');
const productmodel=require("../models/productsmodel");
// const usermodel = require("../models/usermodel")



paypal.configure({
    mode: 'sandbox', // or 'live' for production
    client_id: 'AZeURQ4WiEthwIP6Kwsd6gwO3QfUuZXXewoo8wtxiaP-Qlpsm5ovfqf-P2DBKzKnrSvstbrLZ0SbyS19', // Replace with your actual PayPal Client ID
    client_secret: 'EG7tgSpA_bqrSJd5HGLBSunHsvQgACB_R9nz3RljrGc2Lm3CQ-QvofXCweNaq4A9KCFPCvBnlbOCJHEQ' // Replace with your actual PayPal Secret Key
});


const renderBuyPage = async (req, res) => {
    try {
        res.render('cart'); // Render the initial purchase page
    } catch (error) {
        console.error('Error rendering buy page:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

const payProduct = async (req, res) => {
    try {
        const productId = req.params._id;
     
        let product = await productmodel.findOne();
        

       
        

        if (!product) {
            return res.status(404).send('Product not found');
        }
        
        
        const items = [{
            name: product.name || 'Unnamed Product',  
            sku: product._id.toString(),
            price: product.price.toFixed(2),
            currency: "USD",
            quantity: 1
        }];
        
        
        const totalAmount = product.price.toFixed(2);  // Total amount is just the price of the single product
        
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:3000/payment/success?amount=${totalAmount}`,
                "cancel_url": "http://localhost:3000/payment/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": items
                },
                "amount": {
                    "currency": "USD",
                    "total": totalAmount
                },
                "description": "Purchase of a single product"
            }]
        };
        

        // Create payment with PayPal API
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                console.error('Error during payment creation:', error.response || error.message);
                return res.status(500).send('Error initiating payment');
            } else {
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
                if (approvalUrl) {
                    res.redirect(approvalUrl.href);  // Redirect to PayPal for approval
                } else {
                    res.status(400).send('No approval URL found');
                }
            }
        });

    } catch (error) {
        console.error('Error in payProduct:', error.message);
        res.status(500).send('Internal Server Error');
    }
};






const successPage = async (req, res) => {
    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        // If payerId or paymentId are missing, return an error
        if (!payerId || !paymentId) {
            return res.status(400).send('Payment details are missing.');
        }

        // Retrieve the totalAmount from the query string
        const totalAmount = req.query.amount;

        // Check if totalAmount is available
        if (!totalAmount) {
            return res.status(400).send('Total amount is missing from the query string.');
        }

        // Retrieve the payment details from PayPal API using the paymentId
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": totalAmount  // Use the amount from the query string
                }
            }]
        };

        // Execute the payment with PayPal API
        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                // Log error details and return a 500 server error
                console.error('Error executing payment:', error.response || error.message);
                return res.status(500).send('Error capturing payment');
            } else {
                // console.log('Payment executed:', JSON.stringify(payment));

                // Check if the payment was approved
                if (payment.state === 'approved') {
                    // Extract the SKU (productId) from the transaction (Assuming SKU corresponds to product _id)
                    const productIds = payment.transactions[0].item_list.items.map(item => item.sku);

                    // Fetch products info from the database using the productIds (assuming SKU corresponds to the product's _id)
                    const products = await productmodel.find({ '_id': { $in: productIds } });

                    // Ensure products exist
                    if (!products || products.length === 0) {
                        return res.status(404).send('Products not found');
                    }

                    // Render success page with the payment details and product details
                    res.render('success', {
                        payment,   // Pass the full payment object for details (status, ID, etc.)
                        products,  // Product details (e.g., title, description, etc.)
                        amountPaid: payment.transactions[0].amount.total // The actual amount paid
                    });
                } else {
                    res.status(400).send('Payment was not approved');
                }
            }
        });
    } catch (error) {
        // Log and handle unexpected errors
        console.error('Error in successPage:', error.message);
        res.status(500).send('Internal Server Error');
    }
};





const cancelPage = async (req, res) => {
    try {
        res.render("cancel"); // Render the cancel page
    } catch (error) {
        console.error('Error in cancelPage:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    renderBuyPage,
    payProduct,
    successPage,
    cancelPage
};
