const express = require('express');
const router = express.Router();
const mq = require('../controllers/MessageQueue')

/* GET home page. */
router.post('/:id', (req, res) => {
    queueId = req.params.id;
    message = req.body;
    console.log('POST /message/' + queueId + ' just happened');

    mq.enqueue(message, req.params.id)

    responseObject = { acknowledged: true, queueId: queueId};
    res.send(JSON.stringify(responseObject));
});

router.get('/:id', (req, res) => {
    queueId = req.params.id;
    console.log("GET /message/" + queueId + " just happened");

    message = mq.dequeue(req.params.id);
    res.send(message);
});

module.exports = router;
