import uuid from 'uuid/v1';

class DataLayer {
    constructor(key = 'todo_items') {
        this._key = key;
    }

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

    find({sort = ['createdAt', -1]} = {}) {
        const map = this.getState();
        return Object.keys(map)
            .map(key => map[key])
            .sort((a, b) => (sort[1] < 0 ? ('' + a[sort[0]]).localeCompare('' + b[sort[0]]) : ('' + b[sort[0]]).localeCompare('' + a[sort[0]])));
    }

    create(text) {
        if (!text) {
            return false;
        }
        const map = this.getState();
        const id = uuid();
        const now = new Date();
        map[id] = {
            id,
            text,
            isDone: false,
            updatedAt: now,
            createdAt: now
        };
        return this.setState(map);
    }

    findOne(id) {
        const map = this.getState();
        return map[id];
    }

    updateOne(id, data) {
        const map = this.getState();
        if (!map[id]) {
            return false;
        }
        map[id] = {...map[id], ...data, updatedAt: new Date()};
        return this.setState(map);
    }

    deleteOne(id) {
        const map = this.getState();
        map[id] = undefined;
        return this.setState(map);
    }

    clear() {
        return this.setState({});
    }

    clearCompleted() {
        const map = this.getState();
        Object.keys(map).forEach(key => {
            if (map[key].isDone) {
                map[key] = undefined;
            }
        });
        return this.setState(map);
    }
}

export default DataLayer;