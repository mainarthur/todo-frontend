class ToDoApi extends EventEmitter {
    _baseUrl = "http://api.todolist.local/"


    constructor() {
        super()
    }

    register(email, name, password) {

    }

    _link(endpoint) {
        return `${this._baseUrl}${endpoint}`
    }

    _makeRequest()
}