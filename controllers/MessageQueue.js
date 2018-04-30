class MessageQueue {
  constructor() {
    this._queues = {};
    this._subscriptions = {};
  }

  enqueue(item, key, quiet = false) {
    if (this._queues[key] === undefined) {
      this._queues[key] = [];
    }
    this._queues[key].push(item);
    if (this._subscriptions[key] !== undefined && !quiet) {
      this._emit(key);
    }
  }

  enqueueToFront(item, key, quiet = false) {
    if (this._queues[key] === undefined) {
      this._queues[key] = [];
    }
    this._queues[key].unshift(item);
    if (this._subscriptions[key] !== undefined && !quiet) {
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

  filter(filterFunction, key){
    var valuesRemoved = 0;
    if(key != null && this._queue !== undefined){
      var updatedQueue = this._queues[key].filter(filterFunction);
      if(updatedQueue == this._queues[key]){
        valuesRemoved = updatedQueue.length - this._queue[key].length;
        this._queues[key] = updatedQueue;
      }
    }
    return valuesRemoved;
  }
}

instance = new MessageQueue();

module.exports = instance;
