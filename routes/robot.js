const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    console.log('GET /robot just happened')
    res.send('{"name":"robot-endpoint-service"}');
});

module.exports = router;
