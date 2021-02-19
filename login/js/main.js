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

    let { value: email } = emailTextField, { value: password } = passwordTextField

    email = email.trim()

    password = password.trim()

    if(emailTextField.invalid) {
        emailTextField.invalid = false
    }
    if(passwordTextField.invalid) {
        passwordTextField.invalid = false
    }

    if(email === "") {
        emailTextField.errorText = "Email is required!"
        emailTextField.invalid = true
    }

    if(!isValidEmail(email)) {
        emailTextField.errorText = "Email format is invalid!"
        emailTextField.invalid = true
    }

    if(password === "") {
        passwordTextField.errorText = "Password is required!"
        passwordTextField.invalid = true
    }

    if(!isValidPassword(password)) {
        passwordTextField.errorText = "Use 8 or more characters with a mix of lowercase and uppercase letters, numbers & symbols"
        passwordTextField.invalid = true
    }

    
}


loginButton.addEventListener("click", onSubmit)
loginForm.addEventListener("submit", onSubmit)