class MessageQueue {
  constructor() {
    this.queues = {};
    this.subscriptions = {};
  }

  enqueue(item, key = null) {
    if (this.queues[key] === undefined) {
      this.queues[key] = [];
    }
    this.queues[key].push(item);
    if (this.subscriptions[key] !== undefined) {
      this._emit(key);
    }
  }

  dequeue(key = null) {
    if (this.queues[key] === undefined) {
      return undefined;
    } else {
      return this.queues[key].shift();
    }
  }

  /**
   * Subscribes a callback to be called when a message is enqueued into queue 'key'
   * @param {String} key
   * @param {Function} callback - Should accept one argument
   */
  subscribe(key, callback) {
    this.subscriptions[key] = callback;
  }

  /**
   * Unsubscribes from new items
   * Note: only one callback may be subscribed at a time, so this will wipe whatever callback is set
   * @param {String} key
   */
  unsubscribe(key) {
      this.subscriptions[key] = undefined;
  }

  _emit(key) {
    if (this.queues[key] !== undefined && this.queues[key].length > 0) {
      let message = this.dequeue(key);
    }
    if (this.subscriptions[key] !== undefined) {
      this.subscriptions[key](message);
    }
  }
}

instance = new MessageQueue();

module.exports = instance;