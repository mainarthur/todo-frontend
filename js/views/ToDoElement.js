class ToDoElement extends HTMLLIElement {

    static DONE_CHECKBOX_CLASSNAME = "todo__checkbox"
    static DELETE_BUTTON_CLASSNAME = "todo__btn-delete"
    static TEXT_SPAN_CLASSNAME = "todo__text"
    static DONE_TEXT_SPAN_CLASSNAME = "todo__text_done"
    static TODO_CLASSNAME = "todo"
    static DIVIDER_CLASSNAME = "todo__divider"
    static CENTERED_SPAN_CLASSNAME = "todo_centered-horizontally"


    _toDo
    _textSpan
    _doneCheckbox
    _deleteButton
    _hrDivider
    _deleteSpan

    static get observedAttributes() {
        return ["id"];
    }

    constructor() {
        super()

        this.draggable = true
        this.className = ToDoElement.TODO_CLASSNAME

        this._toDo = todos.get(this.getId())

        this._textSpan = document.createElement("span")

        this._textSpan.className = ToDoElement.TEXT_SPAN_CLASSNAME

        this._doneCheckbox = document.createElement("input")

        this._doneCheckbox.className = ToDoElement.DONE_CHECKBOX_CLASSNAME
        this._doneCheckbox.type = "checkbox"

        this._deleteSpan = document.createElement("span")

        this._deleteSpan.className = ToDoElement.CENTERED_SPAN_CLASSNAME

        this._deleteButton = document.createElement("div")

        this._deleteButton.className = ToDoElement.DELETE_BUTTON_CLASSNAME
        this._deleteButton.classList.add("btn")
        this._deleteButton.innerText = "X"

        this._hrDivider = document.createElement("hr")
        this._hrDivider.className = ToDoElement.DIVIDER_CLASSNAME

        this._deleteSpan.appendChild(this._deleteButton)

        this.addEventListener("dragstart", (ev) => {
            return false
        })

    }

    getId() {
        return this.getAttribute("id")
    }

    connectedCallback() {
        this.appendChild(this._doneCheckbox)
        this.appendChild(this._textSpan)
        this.appendChild(this._deleteSpan)
        this.appendChild(this._hrDivider)
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "id") {
            this._doneCheckbox.dataset.id = this.getId()
            this._toDo = todos.get(this.getId())
            this._deleteButton.dataset.id = this.getId()
            this.render()
        }
    }

    render() {
        this._textSpan.innerText = this._toDo?.text ?? "<i>Empty</i>"

        this._doneCheckbox.checked = this._toDo?.done

        if (this._toDo?.done) {
            this._textSpan.className = ToDoElement.DONE_TEXT_SPAN_CLASSNAME
        } else {
            this._textSpan.className = ToDoElement.TEXT_SPAN_CLASSNAME
        }

    }
}

customElements.define("todo-element", ToDoElement, { extends: "li" })