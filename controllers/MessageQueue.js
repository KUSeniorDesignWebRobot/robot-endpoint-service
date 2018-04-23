class MessageQueue {
  constructor() {
    this._queues = {};
    this._subscriptions = {};
  }

  enqueue(item, key, quiet = false) {
    // console.log("Adding: " + item + " to the " + key + " queue");
    if (this._queues[key] === undefined) {
      console.log('creating queue with key ' + key);
      this._queues[key] = [];
    }
    // console.log('pushing ' + item + ' onto queue ' + key);
    this._queues[key].push(item);
    if (this._subscriptions[key] !== undefined && !quiet) {
      console.log('emitting on ' + key);
      this._emit(key);
    }
  }

  enqueueToFront(item, key, quiet = false) {
    // console.log("Adding: " + item + " to the front of " + key + " queue");
    if (this._queues[key] === undefined) {
      console.log('creating queue with key ' + key);
      this._queues[key] = [];
    }
    // console.log('pushing ' + item + ' to the front of queue ' + key);
    this._queues[key].unshift(item);
    if (this._subscriptions[key] !== undefined && !quiet) {
      // console.log('emitting on ' + key);
      this._emit(key);
    }
  }

  dequeue(key) {
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
    if(this._queues[key] !== undefined)
      return this._queues[key].length;
    else
      return 0;
  }

  _emit(key) {
    if (this._queues[key] !== undefined && this._queues[key].length > 0) {
      var message = this.dequeue(key);
      if (this._subscriptions[key] !== undefined) {
        this._subscriptions[key](message);
      }
    }
  }

  printQueue(key) {
    if (this._queues[key] !== undefined && this._queues[key].length > 0) {
      console.log( key + " Queue Contents: " + this._queues[key]);
    }
    else {
      console.log( key + " Queue Contents: Empty");
    }
  }
}

instance = new MessageQueue();

module.exports = instance;
