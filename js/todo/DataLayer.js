import uuid from 'uuid/v1';

/**
 * @typedef Todo
 * @param {string} text
 * @param {boolean} isDone
 * @param {string} createdAt
 * @param {string} updatedAt
 */

/**
 * DataLayer class to help manage CRUD operations for TODO objects
 * using LocalStorage as the persistence layer
 */
class DataLayer {
    /**
     * Constructor called when the data layer is initialised
     * @param {string} [key='todo_items'] the key to use in localStorage
     */
    constructor(key = 'todo_items') {
        // Initialise instance variables
        this._key = key;
    }

    /**
     * Helper to retrieve the current state from localstorage
     * @returns {Object} A map of id -> todo-item
     */
    getState() {
        try {
            const data = localStorage.getItem(this._key);
            if (!data) {
                localStorage.setItem(this._key, JSON.stringify({}));
                return {};
            }
            return JSON.parse(data);
        } catch (e) {
            localStorage.setItem(this._key, JSON.stringify({}));
            return {};
        }

    }

    /**
     * Helper to update the localstorage state with a new snapshot of the map
     * @param {Object} data A map of id -> todo-item
     * @returns {boolean} Indicates the success of the operation
     */
    setState(data) {
        const oldState = this.getState();
        try {
            localStorage.setItem(this._key, JSON.stringify(data));
            return true;
        } catch (e) {
            localStorage.setItem(this._key, JSON.stringify(oldState));
            return false;
        }
    }

    /**
     * Retrieve a list of todo items
     * @param {Array} [sort=['createdAt', -1]] - defines the sorting mechanism to use
     * @returns {Array<Todo>} A list of sorted todo items
     */
    find({sort = ['createdAt', -1]} = {}) {
        // Get current state
        const map = this.getState();
        // Return a sorted array from the map
        return Object.keys(map)
            .map(key => map[key])
            .sort((a, b) => (sort[1] < 0 ? ('' + a[sort[0]]).localeCompare('' + b[sort[0]]) : ('' + b[sort[0]]).localeCompare('' + a[sort[0]])));
    }

    /**
     * Create a new todo item and persist it
     * @param {string} text - The text of the new todo item
     * @returns {boolean} indicates the success of the operation
     */
    create(text) {
        if (!text) {
            // Is text is not provided or is falsy, return early
            return false;
        }
        // Get current state
        const map = this.getState();
        // Generate new unique ID
        const id = uuid();
        // Get current time
        const now = new Date();

        // Build object and add it to the map with it's id as key
        map[id] = {
            id,
            text,
            isDone: false,
            updatedAt: now,
            createdAt: now
        };

        // Persist changes
        return this.setState(map);
    }

    /**
     * Retrieve an todo by ID
     * @param {string} id The string identifier
     * @returns {Todo|undefined} Todo item of specified id if available or else, undefined
     */
    findOne(id) {
        // Get the current state
        const map = this.getState();
        // Return an object with the given ID if available
        return map[id];
    }

    /**
     * Update a todo item by ID
     * @param id
     * @param data
     * @returns {boolean}
     */
    updateOne(id, data) {
        // Get current state
        const map = this.getState();
        if (!map[id]) {
            // If a todo item with the specified ID does not exist, return early
            return false;
        }
        // Override any incoming keys from data, update the updatedAt timestamp
        map[id] = {...map[id], ...data, updatedAt: new Date()};

        // Persist changes
        return this.setState(map);
    }

    /**
     * Delete a todo item by ID
     * @param {string} id - todo ID
     * @returns {boolean} indicates success of the operation
     */
    deleteOne(id) {
        const map = this.getState();
        map[id] = undefined;
        // Persist changes
        return this.setState(map);
    }

    /**
     * Reset data layer and persiitence
     * @returns {boolean} indicates success of the operation
     */
    reset() {
        // Persist changes with an empty map
        return this.setState({});
    }

    /**
     * Helper to clear all completed items
     * @returns {boolean} indicates success of the operation
     */
    clearCompleted() {
        // Get current state
        const map = this.getState();
        // Delete all items where isDone is true
        Object.keys(map).forEach(key => {
            if (map[key].isDone) {
                this.deleteOne(key);
            }
        });
        // Persist changes
        return this.setState(map);
    }
}

export default DataLayer;