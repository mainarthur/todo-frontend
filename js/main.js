if (localStorage.getItem("logined") != "1") {
    location.href = "/login/"
}

const todos = new ToDoList()

const toDoTextInput = document.getElementById("todo-text")
const addToDoButton = document.getElementById("add-todo")
const toDosUl = document.createElement("ul", { is: "todo-list" })
const clearAllButton = document.querySelector(".todos__btn-clear")
const toDosCard = document.querySelector("#todos-card")
const bottomDraggingElement =  document.createElement("div")

const mainForm = addToDoButton.parentElement

const dbName = "tododb" + localStorage.getItem("id")
const storeName = "todos"

toDosUl.className = "todo-list"

bottomDraggingElement.className = "bottom-drag"

toDosUl.addEventListener("orderupdated", () => {
    [...toDosUl.children].map((ch, i) => {
        const toDo = todos.get(ch.id)
        toDo.position = i
        connectDb((err, db) => {
            if (err)
                return console.log(err)

            const transaction = db.transaction([storeName], "readwrite")
            const objectStore = transaction.objectStore(storeName)

            objectStore.put(toDo.toJSON())
        })
    })
})

addToDoButton.addEventListener("click", addToDoHandler)
mainForm.addEventListener("submit", addToDoHandler)
bottomDraggingElement.addEventListener("dragover", ToDoListElements.onDragOver)
bottomDraggingElement.addEventListener("drop", (ev) => {
    const { target} = ev
    ev.preventDefault()
    const data = ev.dataTransfer.getData("id");
    const element = document.getElementById(data)

    if(target.classList.contains("bottom-drag")) {
        toDosUl.append(element)
        

        const toDo = todos.get(data)

        if(element.previousElementSibling) {
            const prevToDo = todos.get(element.previousElementSibling.id)

            toDo.position = (prevToDo.position + todos.size() + 1)/2
        }
    }

})

function addToDoHandler(ev) {
    ev.preventDefault()

    if (ev.submitter == addToDoButton) {
        return
    }

    const { value: toDoText } = toDoTextInput
    if (toDoText.trim() === "") {
        return alert("Todo can't be empty")
    }

    toDoTextInput.value = ""

    const toDo = new ToDo(toDoText)


    todos.add(toDo)



    connectDb((err, db) => {
        if (err)
            return console.log(err)

        const transaction = db.transaction([storeName], "readwrite")
        const objectStore = transaction.objectStore(storeName)
        const request = objectStore.add(toDo.toJSON())

        request.onsuccess = function () {
            console.log(toDo)
        }

        request.onerror = function () {
            console.log(request)
        }
    })

}

clearAllButton.addEventListener("click", function (ev) {
    todos.clear()
})


toDosCard.append(toDosUl)
toDosCard.append(bottomDraggingElement)




todos.on("todo", (toDo) => {
    const toDoElement = document.createElement("li", { is: "todo-element" })
    toDoElement.id = toDo.id

    toDo.on("status-updated", (status) => {
        toDoElement.render()
        updateToDo(toDo)
    })
    toDo.on("text-updated", (text) => {
        toDoElement.render()
        updateToDo(toDo)
    })
    toDo.on("deleted", () => {
        toDosUl.removeChild(toDoElement)
        connectDb((err, db) => {
            if (err)
                return console.log(err)

            const transaction = db.transaction([storeName], "readwrite")
            const objectStore = transaction.objectStore(storeName)

            objectStore.delete(toDo.id)
        })
    })

    toDo.on("position-changed", () => {
        console.log("New position")
        console.log(toDo.position)
        updateToDo(toDo)
    })

    toDoElement.render()
    toDosUl.append(toDoElement)

})

function updateToDo(toDo) {
    connectDb((err, db) => {
        if (err)
            return console.log(err)

        const transaction = db.transaction([storeName], "readwrite")
        const objectStore = transaction.objectStore(storeName)
        objectStore.put(toDo.toJSON())

    })
}

connectDb((err, db) => {
    if (err)
        return console.error(err)

    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const index = objectStore.index("position")
    const request = index.getAll()

    request.onsuccess = function () {
        todos.load(request.result)
    }
})

function connectDb(done = function (err, db) { },) {

    const openRequest = indexedDB.open(dbName, 14)

    openRequest.onerror = function (ev) {
        done(openRequest.error)
    }
    openRequest.onupgradeneeded = function (ev) {
        const db = openRequest.result
        let store

        if (!db.objectStoreNames.contains(storeName)) {
            store = db.createObjectStore(storeName, {
                keyPath: "id"
            })
        } else {
            store = openRequest.transaction.objectStore(storeName)
        }

        if (store) {

            if (!store.indexNames.contains("id")) {
                store.createIndex("id", "id")
            }
            if (!store.indexNames.contains("date")) {
                store.createIndex("date", "date")
            }
            if (!store.indexNames.contains("text")) {
                store.createIndex("text", "text")
            }
            if (!store.indexNames.contains("done")) {
                store.createIndex("done", "done")
            }
            if (!store.indexNames.contains("position")) {
                store.createIndex("position", "position")
            }
        }

    }

    openRequest.onsuccess = function () {
        const db = openRequest.result

        db.onversionchange = function () {
            db.close()
            location.reload()
        }
        done(null, db)
    }
}