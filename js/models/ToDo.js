class ToDo extends EventEmitter {
    _id
    _done
    _text
    _createdAt
    _position
    _lastUpdate

    constructor(toDoText = "", id, done = false, date, position = -1) {
        super()
        this.text = toDoText
        this._id = id || uuidv4()
        this.done = done
        this._createdAt = date || Date.now()
        this._position = position
    }

    get text() {
        return this._text
    }

    set text(val) {
        this._text = val

        this.emit("text-updated", val)

        return val
    }

    get id() {
        return this._id
    }

    get createdAt() {
        return this._createdAt
    }

    get done() {
        return this._done
    }

    get lastUpdate() {
        return this._lastUpdate
    }

    set done(val) {
        this._done = val
        
        this.emit("status-updated", val)

        return val
    }


    get position() {
        return this._position
    }

    set position(val) {
        this._position = val
        
        this.emit("position-changed", val)

        return val
    }

    toJSON() {
        return { 
            id: this.id,
            done: this.done,
            text:this.text,
            createdAt: this._createdAt,
            position:this.position,
            lastUpdate: this._lastUpdate
        }
    }

    static fromJSON(obj) {
        const { text, id, done, createdAt, position, lastUpdate } = obj 

        return new ToDo(text, id, done, createdAt, position, lastUpdate)
    }
}