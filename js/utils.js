const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegexp = /^([a-z]{2,}|[а-яё]{2,})$/
const lowercaseRegexp = /[a-z]/g
const upperCaseRegexp = /[A-Z]/g
const numbersRegexp = /[0-9]/g
const specialSymbolsRegexp = /[\-\:\;\]\!\?\,\#\\\>\[\+\^\}\&\'\)\=\(\~\*\_\@\$\.\%\<\{\"\/\\]/g



function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function isValidEmail(email) {
    return emailRegexp.test(String(email).toLowerCase())
}

function isValidName(name) {
    return nameRegexp.test(name.toLowerCase())
}

function isValidPassword(password) {
    return lowercaseRegexp.test(password) && password.length <= 255 && password.length >= 8 && upperCaseRegexp.test(password) && numbersRegexp.test(password) && specialSymbolsRegexp.test(password)
}


async function makeRequest(url, options = {}) {
    if(!options.headers) {
        options.headers = {}
    }

    options.headers["authorization"] = `Bearer ${localStorage.getItem("token")}`
    options.headers["content-type"] = options.headers["content-type"] ?? "application/json"
    options.mode = options.mode ?? "cors"
        
    let response = await fetch(url, options)

    if(response.status === 200) {
        return await response.json()
    } else if(response.status === 401) {
        if(await refreshTokens()) {
            return makeRequest(url, options)
        } else {
            location.href = "/login"
        }
    } else {
        if(response.headers.get("content-type") == "application/json") {
            return await response.json()
        } else {
            console.log(response)
            return null
        }
    }
}

async function refreshTokens() {
    const response = await fetch("http://api.todolist.local/auth/refresh-token", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify({
            refresh_token: localStorage.getItem("refresh_token")
        })
    })


    if(response.status === 200) {
        const result = await response.json()


        localStorage.setItem("token", result.access_token)
        localStorage.setItem("refresh_token", result.refresh_token)
        return true
    } else {
        localStorage.removeItem("token")
        localStorage.removeItem("refresh_token")
        return false
    }
}