if(localStorage.getItem("logined") == "1") {
    location.href = "/"
}

const users = [
    {email: "test@test.com", id: 1, password: "123"},
    {email: "root@test.com", id: 2, password: "123"},
]


const loginButton = document.querySelector(".login-form__btn-login")
const loginForm = document.querySelector(".login-form__form")

const emailTextField = document.querySelector(".login-form__email")
const passwordTextField = document.querySelector(".login-form__password")

function onSubmit(ev) {
    if(ev.submitter == loginButton) {
        return
    }

    const user = users.find(u => u.email == emailTextField.value)

    if(!user) {
        emailTextField.invalid = true
        return
    } 
    if(emailTextField.invalid) {
        emailTextField.invalid = false
    }


    if(user.password !== passwordTextField.value) {
        passwordTextField.invalid = true
        return
    } 
    if(passwordTextField.invalid){
        passwordTextField.invalid = false
    }

    localStorage.setItem("logined", "1")
    localStorage.setItem("email", user.email)
    localStorage.setItem("id", user.id)
    location.href = "/"
}


loginButton.addEventListener("click", onSubmit)
loginForm.addEventListener("submit", onSubmit)