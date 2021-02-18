class ToDoList extends EventEmitter {
    _todos
    constructor(todos = []) {
        super()
        this._todos = todos
    }

    add(toDo) {
        if(this.get(toDo.id)) {
            throw new Error("To-Do list already contains that To-Do")
        }

        this._todos.push(toDo)

        if(toDo.position == -1) {
            toDo.position = this._todos.length
        }
        this.emit("todo", toDo)
    }

    load(todos) {
        todos.forEach(todo => {
            this.add(ToDo.fromJSON(todo))
        })
    }

    get(id) {
        return this._todos.find((todo) => todo.id === id)
    }

    getAll() {
        return this._todos
    }

    delete(id) {
        this._todos = this._todos.filter((todo) => {
            if(todo.id === id)
                todo.emit("deleted", todo)
            return todo.id !== id
        })
    }

    clear() {
        this._todos.forEach((todo) => {
            todo.emit("deleted")
        })

        this._todos = []
    }

    size() {
        return this._todos.length
    }

}