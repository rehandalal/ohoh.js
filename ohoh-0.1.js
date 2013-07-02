/**
 * ohoh.js
 * =======
 *
 * Version: 0.1
 * Author: Rehan Dalal
 * GitHub: https://github.com/rehandalal/ohoh.js
 * License: MIT License
 *
 * ohoh.js is a simple utility library to assist with event-driven,
 * object-oriented JavaScript.
 *
 * This based on ideas from John Resig's simple JavaScript inheritance
 * (http://ejohn.org/blog/simple-javascript-inheritance/), Oliver Caldwell's
 * EventEmitter (https://github.com/Wolfy87/EventEmitter), and the Node.js
 * Events API (http://nodejs.org/api/events.html).
 */
;(function(exports) {
    // Place the script in strict mode
    'use strict';

    // Indicates whether a base class is being extended.
    var extending = false,
        fnTest,
        prototype;

    // Test for function decompilation and if available provide the
    // appropriate regex to check whether function mentions "_super".
    fnTest = /return/.test(function() { return 'ok'; }) ? /\b_super\b/ : /.*/;

    /**
     * A class for an event object.
     *
     * @constructor
     * @param type The name of the event.
     * @param target The target object.
     */
    function Event(type, target) {
        this.type = type;
        this.target = target;
        this.timeStamp = new Date().getTime();
    }

    /**
     * A base class that supports inheritance and event emission.
     *
     * @constructor
     */
    function BaseClass() {}
    prototype = BaseClass.prototype;

    /**
     * Finds the index of the last occurrence of the object if it exists in
     * the array.
     *
     * @param needle Object to look for.
     * @param haystack Array to search through.
     * @return {number} Index of the object, -1 if not found.
     */
    function lastIndexOf(needle, haystack) {
        // Return the index via the native method if possible
        if (Array.prototype.lastIndexOf) {
            return haystack.lastIndexOf(needle);
        }

        // There is no native method
        // Use a manual loop to find the index
        for (var i = haystack.length - 1; i >= 0; i--) {
            if (haystack[i] === needle) {
                return i;
            }
        }

        // Default to returning -1
        return -1;
    }

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @private
     */
    prototype._getEvents = function () {
        return this._events || (this._events = {});
    };

    /**
     * Adds a listener to the end of the listeners array for the specified
     * event.
     *
     * @param {string} event Name (type) of the event.
     * @param {function} listener Callback function to bind to the event.
     * @returns {Object} Current instance of the class for chaining.
     */
    prototype.addListener = function(event, listener) {
        var listeners = this.listeners(event),
            max = this._maxListeners;

        // Add the listener
        listeners.push(listener);

        // Emit a newListener event
        this.emit('newListener', listener);

        // Warn if there are more listeners than the maximum.
        if (max > 0 && listeners.length > max) {
            console.warn("More than " + this._maxListeners +
                " listeners assigned to '" + event + "' event.");
        }

        // Return the instance of the class for chaining.
        return this;
    };

    /**
     * Alias for addListener
     *
     * @type {function}
     */
    prototype.on = prototype.addListener;

    /**
     * Adds a one time listener to the specified event. The listener is
     * invoked only the next time the even is fired, after which it is
     * removed.
     *
     * @param {string} event Name (type) of the event.
     * @param {function} listener Callback function to bind to the event.
     * @returns {Object} Current instance of the class for chaining.
     */
    prototype.once = function(event, listener) {
        // Wrap the listener in a new function that will remove itself as
        // a listener.
        function listenOnce() {
            listener.apply(this, arguments);
            this.removeListener(event, listenOnce);
        }

        this.addListener(event, listenOnce);

        // Return the instance of the class for chaining.
        return this;
    };

    /**
     * Remove a listener from the listener array for the specified event.
     *
     * Caution: changes array indices in the listener array behind the
     * listener.
     *
     * @param {string} event Name (type) of the event.
     * @param {function} listener Function to be unbound from the event.
     * @returns {Object} Current instance of the class for chaining.
     */
    prototype.removeListener = function(event, listener) {
        var listeners = this.listeners(event),
            index = lastIndexOf(listener, listeners);

        // Remove the listener and emit a removeListener event
        if (index !== -1) {
            this.emit('removeListener', listeners.splice(index, 1));
        }

        // Return the instance of the class for chaining.
        return this;
    };

    /**
     * Alias  for removeListener
     *
     * @type {function}
     */
    prototype.off = prototype.removeListener;

    /**
     * Removes all listeners for of the specified event. If no event is
     * specified all listeners for all events will be removed.
     *
     * @param {string} event Name (type) of the event.
     * @returns {Object} Current instance of the class for chaining.
     */
    prototype.removeAllListeners = function(event) {
        if (typeof event === 'undefined') {
            this._events = {};
        } else {
            var listeners = this.listeners(event);
            listeners = [];
        }

        // Return the instance of the class for chaining.
        return this;
    };

    /**
     * By default EventEmitters will print a warning if more than 10
     * listeners are added for a particular event. This is a useful default
     * which helps finding memory leaks. Obviously not all Emitters should
     * be limited to 10. This function allows that to be increased. Set to
     * zero for unlimited.
     *
     * @param {integer} n Maximum number of listeners.
     * @returns {Object} Current instance of the class for chaining.
     */
    prototype.setMaxListeners = function(n) {
        this._maxListeners = n;

        // Return the instance of the class for chaining.
        return this;
    };

    /**
     * Returns an array of listeners for the specified event.
     *
     * @param {string} event Name (type) of the event.
     * @returns {Array} An array of listeners for the event.
     */
    prototype.listeners = function(event) {
        if (typeof event === 'undefined') {
            throw 'An event type must be provided.';
        }
        var events = this._getEvents();
        return events[event] || (events[event] = []);
    };

    /**
     * Execute each of the listeners in order with the supplied arguments.
     *
     * @param {string} event Name (type) of the event.
     * @returns {boolean} Returns true if event had listeners, else false.
     */
    prototype.emit = function(event) {
        var listeners = this.listeners(event),
            count = listeners.length,
            args = Array.prototype.slice.call(arguments, 1);

        // Prepend a new event object to the arguments
        args.unshift(new Event(event, this));

        // Apply each of the listeners for the event
        for (var i = count - 1; i >= 0; i--) {
            if (typeof listeners[i] === 'function') {
                listeners[i].apply(this, args);
            }
        }

        return count > 0;
    };

    /**
     * Alias for emit
     *
     * @type {function}
     */
    prototype.trigger = prototype.emit;

    /**
     * Create's a new subclass of the base class.
     *
     * @param properties Properties and methods of the sub-class
     * @returns {function}
     */
    BaseClass.extend = function(properties) {
        var _super = this.prototype,
            prototype;

        // Instantiate the base class for extension.
        extending = true;
        prototype = new this();
        extending = false;

        // Wraps any function that is being overwritten to provide access to
        // _super;
        function wrap (name, fn){
            return function() {
                var tmp = this._super;
                this._super = _super[name];

                var value = fn.apply(this, arguments);
                this._super = tmp;

                return value;
            };
        }

        // Copy the properties to the new prototype.
        for (var name in properties) {
            // Check if an existing function is being overwritten
            if (typeof properties[name] === 'function' &&
                typeof _super[name] === 'function' &&
                fnTest.test(properties[name])) {
                prototype[name] = wrap(name, properties[name]);
            } else {
                prototype[name] = properties[name];
            }
        }

        // Dummy class constructor
        function Class() {
            if (!extending && this.initialize) {
                this._maxListeners = 10;
                this.initialize.apply(this, arguments);
            }
        }

        // Populate the new classes prototype
        Class.prototype = prototype;

        // Ensure that the constructor is what we expect
        Class.prototype.constructor = Class;

        // Make the new class extensible
        Class.extend = BaseClass.extend;

        return Class;
    };

    // Expose the class either via AMD or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return BaseClass;
        });
    } else {
        exports.BaseClass = BaseClass;
    }
})(this);
