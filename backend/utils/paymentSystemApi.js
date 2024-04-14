// utils/paymentSystemApi.js
const axios = require('axios');

const PAYMENT_SYSTEM_API_BASE_URL = 'https://api.example.com'; 

async function makePaymentSystemRequest(endpoint, method, data) {
 try {
    const response = await axios({
      method,
      url: `${PAYMENT_SYSTEM_API_BASE_URL}${endpoint}`,
      data,
      // Include any necessary headers, such as API keys
    });
    return response.data;
 } catch (error) {
    throw new Error(`Payment system API request failed: ${error.message}`);
 }
}

module.exports = {
 makePaymentSystemRequest,
};
