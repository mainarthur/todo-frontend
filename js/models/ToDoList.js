class ToDoList extends EventEmitter {
    _todos
    constructor(todos = []) {
        super()
        this._todos = todos
    }

    add(toDo) {
        if (toDo.position == -1) {
            if (this._todos.length > 0) {
                toDo.position = this._todos[this._todos.length - 1].position + 3
            } else {
                toDo.position = 0
            }
        }
        const oldToDo = this.get(toDo.id)
        if (oldToDo) {
            if (toDo.deleted) {
                this.delete(toDo.id)
            } else {
                const keys = ["done", "text", "position"]

                keys.forEach(key => {
                    if (oldToDo[key] != toDo[key]) {
                        oldToDo[key] = toDo[key]
                    }
                })
            }

        } else if(!toDo.deleted) {
            this._todos.push(toDo)
            this.emit("todo", toDo)
        }
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
            if (todo.id === id)
                todo.emit("deleted", todo)
            return todo.id !== id
        })
    }

    clear() {
        this._todos.forEach((todo) => {
            todo.emit("deleted", todo)
        })

        this._todos = []
    }

    size() {
        return this._todos.length
    }

}