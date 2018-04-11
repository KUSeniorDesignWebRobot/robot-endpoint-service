class MessageQueue {
  constructor() {
    this._queues = {};
    this._subscriptions = {};
  }

  enqueue(item, key = null) {
    console.log(key + ', ' + item);
    if (this._queues[key] === undefined) {
      this._queues[key] = [];
    }
    this._queues[key].push(item);
    console.log(this._subscriptions);
    if (this._subscriptions[key] != undefined) {
      this._emit(key);
    }
  }

  dequeue(key = null) {
    if (this._queues[key] === undefined) {
      return undefined;
    } else {
      return this._queues[key].shift();
    }
  }

  /**
   * Subscribes a callback to be called when a message is enqueued into queue 'key'
   * @param {String} key
   * @param {Function} callback - Should accept one argument
   */
  subscribe(key, callback) {
    this._subscriptions[key] = callback;
  }

  /**
   * Unsubscribes from new items
   * Note: only one callback may be subscribed at a time, so this will wipe whatever callback is set
   * @param {String} key
   */
  unsubscribe(key) {
      this._subscriptions[key] = undefined;
  }

  size(key=null) {
    return this._queues[key].length;
  }

  _emit(key) {
    if (this._queues[key] !== undefined && this._queues[key].length > 0) {
      if (this._subscriptions[key] !== undefined) {
        var message = this.dequeue(key);
        this._subscriptions[key](message);
      }
    }
  }
}

instance = new MessageQueue();

module.exports = instance;