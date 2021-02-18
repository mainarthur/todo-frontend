class ToDo extends EventEmitter {
    _id
    _done
    _text
    _date
    _position
    constructor(toDoText = "", id, done = false, date, position = -1) {
        super()
        this.text = toDoText
        this._id = id || uuidv4()
        this.done = done
        this._date = date || Date.now()
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

    get date() {
        return this._date
    }

    get done() {
        return this._done
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
            date: this._date,
            position:this.position
        }
    }

    static fromJSON(obj) {
        const { text, id, done, date, position } = obj 

        return new ToDo(text, id, done, date, position)
    }
}