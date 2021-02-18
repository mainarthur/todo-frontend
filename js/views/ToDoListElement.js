class ToDoListElements extends HTMLUListElement {
    constructor() {
        super()

        

        this.addEventListener("click", this.onClick)
        this.addEventListener("change", this.onChange)
        
    }

    static onDragOver(ev) {
        ev.preventDefault()

        console.log(ev)
    }

    onClick(ev) {
        const {
            target: targetElement
        } = ev

        if (targetElement.classList.contains(ToDoElement.DELETE_BUTTON_CLASSNAME)) {
            todos.delete(targetElement.dataset.id)
        }
    }

    onChange(ev) {
        const {
            target: targetElement
        } = ev

        if (targetElement.classList.contains(ToDoElement.DONE_CHECKBOX_CLASSNAME)) {
            const todo = todos.get(targetElement.dataset.id)

            todo.done = targetElement.checked
        }
    }
}

customElements.define("todo-list", ToDoListElements, { extends: "ul" })