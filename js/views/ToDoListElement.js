class ToDoListElements extends HTMLUListElement {
    constructor() {
        super()

        const onDrag = (ev) => {
            ev.preventDefault();
            console.log(ev)
            const data = ev.dataTransfer.getData("id");
            const element = document.getElementById(data)
            if(element != null) {
                let target = ev.target
                let i = 0
                while (target.tagName.toUpperCase() != "LI" && i != 3) {
                    if (target.parentNode == null)
                        return
    
                    target = target.parentNode
                    i++
                }

                
    
                if (target.tagName.toUpperCase() == "LI") {
                    target.before(element)
                    const toDo = todos.get(data)
    
                    const nextToDoPosition = todos.get(target.id).position
                    let prevToDoPosition
    
                    if(element.previousElementSibling) {
                        const prevToDo = todos.get(element.previousElementSibling.id)
    
                        prevToDoPosition = prevToDo.position
                    } else {
                        prevToDoPosition = 0
                    }
    
                    toDo.position = (prevToDoPosition+nextToDoPosition)/2
    
                }  
            }
            
        }

        this.addEventListener("click", this.onClick)
        this.addEventListener("change", this.onChange)
        this.addEventListener("dragover", onDrag)
        this.addEventListener("drop", onDrag)
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