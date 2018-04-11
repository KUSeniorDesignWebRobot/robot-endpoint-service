var instance = undefined;

(function() {
  /**
   * A singleton class for centrally storing application and session level data
   */
  var __vars = {};
  var __sessionVars = {};

  class StateManager {
    constructor() {
      
    }

    debug() {
      console.log(__vars);
      console.log(__sessionVars);
    }

    /**
     * Set a global application variable
     * @param {String} key
     * @param {*} value
     * @param {Boolean} overwrite = true
     * @return {Boolean} true if successfully set, false if unsuccesful (if overwrite === false and that key already has a value)
     */
    setGlobalValue(key, value, overwrite = false) {
      if (__vars[key] === undefined || overwrite) {
        __vars[key] = value;
        return true;
      } else {
        return false;
      }
    }

    /**
     * Unsets a value (sets to undefined with overwrite)
     * @param {String} key
     */
    unsetGlobalValue(key) {
      this.setGlobalValue(key, undefined, true);
    }

    /**
     * Get a global application level variable
     * @param {String} key
     */
    getGlobalValue(key) {
      return __vars[key];
    }

    /**
     * Sets a session scoped variable
     * @param {String} sessionId
     * @param {String} key
     * @param {*} value
     * @param {Boolean} overwrite = true
     * @return {Boolean} true if successfully set, false if unsuccesful (if overwrite === false and that key already has a value)
     */
    setSessionValue(sessionId, key, value, overwrite = true) {
      if (!this.sessionExists(sessionId)) {
        __sessionVars[sessionId] = {};
      }

      if (__sessionVars[sessionId][key] === undefined || overwrite) {
        __sessionVars[sessionId][key] = value;
        return true;
      } else {
        return false;
      }
    }

    /**
     * Clears a session level variable
     * @param {String} sessionId
     * @param {String} key
     */
    clearSessionValue(sessionId, key) {
      this.setSessionValue(sessionId, key, undefined, true);
    }

    /**
     * Returns a session value or undefined if no such session exists
     * @param {String} sessionId 
     * @param {String} key 
     * @return {*}
     */
    getSessionValue(sessionId, key) {
      if (!this.sessionExists(sessionId)) {
        return undefined;
      } else {
        return __sessionVars[sessionId][key];
      }
    }

    /**
     * Returns true if a session exists as sessionId, else false
     * @param {String} sessionId 
     * @return {Boolean}
     */
    sessionExists(sessionId) {
      return __sessionVars[sessionId] !== undefined;
    }
  }

  instance = new StateManager();
})();

module.exports = instance;
