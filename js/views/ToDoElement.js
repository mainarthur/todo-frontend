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

        this.draggable = false
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

        let currentDropable = null
        const self = this

        this.addEventListener("mousedown", (ev) => {
            const rect = this.getBoundingClientRect()
            const shiftX = ev.clientX - rect.left
            const shiftY = ev.clientY - rect.top

            const ghostDiv = document.createElement("div")
            
            ghostDiv.style.width = `${rect.right - rect.left}px`
            ghostDiv.style.height = `${rect.bottom - rect.top}px`
            ghostDiv.style.border = "1px dotted rgba(66,66,66,0.3)"

            this.style.width = `${rect.right - rect.left}px`
            this.style.position = "absolute"
            this.style.backgroundColor = "white"
            this.style.zIndex = 666

            moveAt(ev.pageX, ev.pageY);

            function moveAt(pageX, pageY) {
                self.style.left = pageX - shiftX + 'px';
                self.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(ev) {
                moveAt(ev.pageX, ev.pageY);

                self.hidden = true
                const elementBelow = document.elementFromPoint(ev.clientX, ev.clientY)
                self.hidden = false

                if (!elementBelow) {
                    return
                }

                currentDropable = elementBelow

                if(currentDropable.tagName.toUpperCase() == "LI") {
                    currentDropable.before(ghostDiv)
                } else if(currentDropable.classList.contains("bottom-drag")) {
                    self.parentElement.append(ghostDiv)
                }
            }

            document.addEventListener("mousemove", onMouseMove)

            self.onmouseup = () => {
                document.removeEventListener("mousemove", onMouseMove)
                self.onmouseup = null

                if (currentDropable) {
                    let target = currentDropable, i = 0;
                    while (target != null && target != ghostDiv && (target?.tagName?.toUpperCase() != "LI" && !target?.classList?.contains("bottom-drag")) && i != 10) {
                        i++
                        target = target.parentElement
                    }

                    if (target) {
                        if (target.tagName.toUpperCase() == "LI") {
                            console.log("LI")
                            target.before(self)
                            ghostDiv?.remove()
                            const toDo = todos.get(self.getId())

                            const nextToDoPosition = todos.get(target.id).position
                            let prevToDoPosition

                            if (self.previousElementSibling) {
                                const prevToDo = todos.get(self.previousElementSibling.id)

                                prevToDoPosition = prevToDo.position
                            } else {
                                prevToDoPosition = 0
                            }

                            toDo.position = (prevToDoPosition + nextToDoPosition) / 2

                        } else if (target.classList.contains("bottom-drag")) {
                            self?.parentElement?.append(self)

                            const toDo = todos.get(self.getId())
                            ghostDiv?.remove()

                            if (self.previousElementSibling) {
                                const prevToDo = todos.get(self.previousElementSibling.id)

                                toDo.position = (prevToDo.position + todos.size() + 1) / 2
                            }
                        } else if(target == ghostDiv) {
                            console.log("GHOST DIV")
                            target.before(self)
                            ghostDiv?.remove()
                            const toDo = todos.get(self.getId())

                            const nextToDoPosition = todos.get(self.nextElementSibling.id).position

                            if(!nextToDoPosition) {
                                if (self.previousElementSibling) {
                                    const prevToDo = todos.get(self.previousElementSibling.id)
    
                                    toDo.position = (prevToDo.position + todos.size() + 1) / 2
                                }
                            } else {
                                let prevToDoPosition

                                if (self.previousElementSibling) {
                                    const prevToDo = todos.get(self.previousElementSibling.id)
    
                                    prevToDoPosition = prevToDo.position
                                } else {
                                    prevToDoPosition = 0
                                }
    
                                toDo.position = (prevToDoPosition + nextToDoPosition) / 2
                            }
                        }

                    }
                    self.removeAttribute("style")
                    ghostDiv?.remove()
                }
            }

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