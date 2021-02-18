class EventEmitter {
    _observers
    constructor() {
        this._observers = {}
    }

    on(eventName, listener) {
        if(!this._observers[eventName]) {
            this._observers[eventName] = []
        }

        this._observers[eventName].push({callback: listener, once: false})
    }

    once(eventName, listener) {
        if(!this._observers[eventName]) {
            this._observers[eventName] = []
        }

        this._observers[eventName].push({callback: listener, once: true})
    }

    emit(eventName, ...args) {
        if(!this._observers[eventName]) {
            this._observers[eventName] = []
        }

        this._observers[eventName] = this._observers[eventName].filter((listener) => {
            const { callback, once } = listener

            callback(...args)

            return !once
        })
    }

    off(eventName, callback) {
        if(!this._observers[eventName]) {
            this._observers[eventName] = []
        }

        this._observers[eventName] = this._observers[eventName].filter((listener) => listener.callback !== callback)
    }
}