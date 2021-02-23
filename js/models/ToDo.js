class ToDo extends EventEmitter {
    _id
    _done
    _text
    _createdAt
    _position
    _lastUpdate
    _deleted

    constructor(toDoText = "", id, done = false, date, position = -1, lastUpdate = Date.now(), deleted = false) {
        super()
        this.text = toDoText
        this._id = id || uuidv4()
        this.done = done
        this._createdAt = date || Date.now()
        this._position = position
        this._lastUpdate = lastUpdate
        this._deleted = deleted
    }

    get text() {
        return this._text
    }

    set text(val) {
        this._text = val

        this.emit("text-updated", this)

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
        
        this.emit("status-updated", this)

        return val
    }


    get position() {
        return this._position
    }

    set position(val) {
        this._position = val
        
        this.emit("position-changed", this)

        return val
    }


    get deleted() {
        return this._deleted
    }
    
    toJSON() {
        return { 
            id: this.id,
            done: this.done,
            text:this.text,
            createdAt: this._createdAt,
            position:this.position,
            lastUpdate: this._lastUpdate,
            deleted: this._deleted
        }
    }

    static fromJSON(obj) {
        const { text, id, done, createdAt, position, lastUpdate, deleted } = obj 

        return new ToDo(text, id, done, createdAt, position, lastUpdate, deleted)
    }
}