const todos = new ToDoList()

const toDoTextInput = document.getElementById("todo-text")
const addToDoButton = document.getElementById("add-todo")
const toDosUl = document.createElement("ul", { is: "todo-list" })
const clearAllButton = document.querySelector(".todos__btn-clear")
const logoutButton = document.querySelector(".todos__btn-logout")
const toDosCard = document.querySelector("#todos-card")
const bottomDraggingElement = document.createElement("div")

const mainForm = addToDoButton.parentElement

const dbName = "tododb" + localStorage.getItem("id")
const storeName = "todos"

const refreshDelay = 9 * 60 * 1000 + 1000

toDosUl.className = "todo-list"

bottomDraggingElement.className = "bottom-drag"




async function addToDoHandler(ev) {
    ev.preventDefault()

    if (ev.submitter == addToDoButton) {
        return
    }

    const { value: text } = toDoTextInput
    if (text.trim() === "") {
        return alert("Todo can't be empty")
    }

    toDoTextInput.value = ""

    try {
        const toDoResponse = await makeRequest("todo", {
            method: "POST",
            body: JSON.stringify({
                text
            })
        })

        if (!!toDoResponse) {
            const toDo = ToDo.fromJSON(toDoResponse.result)



            connectDb((err, db) => {
                if (err)
                    return console.log(err)

                const transaction = db.transaction([storeName], "readwrite")
                const objectStore = transaction.objectStore(storeName)
                const request = objectStore.add(toDo.toJSON())

                request.onsuccess = function () {

                    todos.add(toDo)
                    localStorage.setItem("lastupdate", toDo.lastUpdate)

                }

            })
        }
    } catch (err) {
        console.log(err)
    }
}



toDosCard.append(toDosUl)
toDosCard.append(bottomDraggingElement)

function toDoUpdatedHandler(toDo) {
    const toDoElement = document.getElementById(toDo.id)
    toDoElement?.render()
    updateToDo(toDo)
}

function toDoDeletedHandler(toDo) {
    const toDoElement = document.getElementById(toDo.id)
    if (toDoElement) {
        toDosUl.removeChild(toDoElement)
    }

    connectDb(async (err, db) => {
        if (err)
            return console.log(err)

        const transaction = db.transaction([storeName], "readwrite")
        const objectStore = transaction.objectStore(storeName)

        objectStore.delete(toDo.id)

        try {
            const response = await makeRequest(`todo/${toDo.id}`, {
                method: "DELETE"
            })

            if(response) {
                localStorage.setItem("lastupdate", response.result.lastUpdate)
            }
        } catch (e) {
            console.log(e)

        }
    })
}

todos.on("todo", (toDo) => {
    const toDoElement = document.createElement("li", { is: "todo-element" })
    toDoElement.id = toDo.id


    toDo.on("status-updated", toDoUpdatedHandler)
    toDo.on("text-updated", toDoUpdatedHandler)
    toDo.on("deleted", toDoDeletedHandler)
    toDo.on("position-changed", toDoUpdatedHandler)

    toDoElement.render()
    toDosUl.append(toDoElement)

    connectDb((err, db) => {
        if (err)
            return console.log(err)

        const transaction = db.transaction([storeName], "readwrite")
        const objectStore = transaction.objectStore(storeName)
        objectStore.put(toDo.toJSON())
    })
})

function updateToDo(toDo) {
    connectDb(async (err, db) => {
        if (err)
            return console.log(err)

        const transaction = db.transaction([storeName], "readwrite")
        const objectStore = transaction.objectStore(storeName)
        objectStore.put(toDo.toJSON())

        try {
            const response = await makeRequest("todo", {
                method: "PATCH",
                body: JSON.stringify(toDo)
            })

            if(response) {
                localStorage.setItem("lastupdate", response.result.lastUpdate)
            }
        } catch (e) {
            console.log(e)
        }
    })
}



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


async function refresh() {
    await refreshTokens()
    setTimeout(refresh, refreshDelay)
}

async function main() {

    addToDoButton.addEventListener("click", addToDoHandler)
    mainForm.addEventListener("submit", addToDoHandler)


    clearAllButton.addEventListener("click", () => {
        todos.clear()
    })

    logoutButton.addEventListener("click", () => {
        localStorage.clear()
        indexedDB.deleteDatabase(dbName)
        location.href = "/login/"
    })

    setTimeout(refresh, refreshDelay)

    try {
        let endpoint = "todo"
        if (localStorage.getItem("lastupdate")) {
            endpoint += `?from=${localStorage.getItem("lastupdate")}`
        } else {
            localStorage.setItem("lastupdate", Date.now())
        }
        const response = await makeRequest(endpoint)

        if (response) {
            console.log(response.results)
            todos.load(response.results)

            if(response.results.length > 0) {
                localStorage.setItem("lastupdate", Math.max(...response.results.map(e=> e.lastUpdate)))
            }
        }
    } catch (err) {
        console.log(err)
    }
}

connectDb(async (err, db) => {
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

main()