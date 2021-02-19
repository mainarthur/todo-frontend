const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegexp = /^([a-z]{2,}|[а-яё]{2,})$/
const lowercaseRegexp = /[a-z]/
const upperCaseRegexp = /[A-Z]/
const numbersRegexp = /[0-9]/
const specialSymbolsRegexp = /[\-\:\;\]\!\?\,\#\\\>\[\+\^\}\&\'\)\=\(\~\*\_\@\$\.\%\<\{\"\/\\]/ // 



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