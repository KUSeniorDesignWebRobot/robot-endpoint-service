mq = {}

instance = undefined;

class MessageQueue {
    constructor() {
        this.queues = {}
    }

    enqueue(item, key = null) {
        if (this.queues[key] === undefined) {
            this.queues[key] = []
        }
        this.queues[key].push(item);
    }

    dequeue(key = null) {
        if (this.queues[key] === undefined) {
            return undefined;
        } else {
            return this.queues[key].shift();
        }
    }
}

function getMessageQueue() {
    if (instance === undefined) {
        instance = new MessageQueue();
    }
    return instance;
}

module.exports = mq;