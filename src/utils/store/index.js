import { gbs } from 'config/'

class Store {
    constructor() {
        this.store = window.localStorage
        this._store = window.sessionStorage
        this.prefix = gbs.db_prefix
    }
    setStorage(key, value, type, fn) {
        var _value;
        try {
            _value = JSON.stringify(value)
        } catch (e) {
            _value = value
        }
        type === 1 ? this.store.setItem(this.prefix + key, _value) : this._store.setItem(this.prefix + key, _value)
        fn && fn()
    }
    getStorage(value) {
        var _value;
        if (value !== null) {
            try {
                _value = JSON.parse(value)
            } catch (e) {
                _value = value
            }
            return _value
        } else {
            return null
        }
    }
    set(key, value, fn) {
        this.setStorage(key, value, 1, fn)
    }
    _set(key, value, fn) {
        this.setStorage(key, value, 2, fn)
    }
    get(key) {
        var value = this.store.getItem(this.prefix + key)
        return this.getStorage(value)
    }
    _get(key) {
        var value = this._store.getItem(this.prefix + key)
        return this.getStorage(value)
    }
    remove(key) {
        this.store.removeItem(this.prefix + key)
    }
    _remove(key) {
        this._store.removeItem(this.prefix + key)
    }
    clear() {
        this.store.clear()
    }
    _clear() {
        this._store.clear()
    }
}

export default new Store()