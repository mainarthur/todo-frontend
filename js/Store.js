class Store {

    _reducers
    _reducersNames
    _state
    _listener
    _combined = false
    constructor(reducer = function (state, action) { return state }, preloadedState) {
        if (typeof reducer == "object") {
            this._combined = true
            this._reducers = reducer
            this._reducersNames = Object.keys(this._reducers)

            if (preloadedState != undefined) {
                if(!this._isValidPreloadedState(preloadedState, this._reducersNames)) {
                    throw new Error("Ivalid preloaded state")
                }

                this._state = preloadedState
            } else {
                this._state = {}
                this._reducersNames.forEach((reducerName) => {
                    this._state[reducerName] = this._reducers[reducerName](undefined, {})
                })
            }

        } else if (typeof reducer == "function") {
            this._reducers = reducer
            this._state = preloadedState
        } else {
            throw new Error("Ivalid reducers passed")
        }
    }

    _isValidPreloadedState(preloadedState, reducers) {
        for (let i = 0; i < reducers.length; i++) {
            if (!preloadedState[reducers[i]])
                return false
        }
        return true
    }

    getState() {
        return this._state
    }

    dispatch(action = {}) {
        if (!this._combined) {
            this._state = this._reducers(this._state, action)
        } else {
            this._reducersNames.forEach((reducerName) => {
                this._state[reducerName] = this._reducers[reducerName](this._state[reducerName], action)
            })
        }
        if (this._listener) {
            this._listener(this._state)
        }
    }

    subscribe(listener) {
        this._listener = listener
    }

    unsubscribe() {
        this._listener = null;
    }

}


class ToDoStore extends Store {
    static ACTION_ADD_TODO = "ADD_TODO"

    constructor() {
        super(ToDoStore.reducer, [])
    }

    static reducer(state = [], action) {
        const { type, toDo } = action

        if (type == ToDoStore.ACTION_ADD_TODO) {
            return state.concat([ toDo ])
        }

        return state
    }

    addToDo(toDo) {
        this.dispatch({
            type: ToDoStore.ACTION_ADD_TODO,
            toDo
        })
    }
}