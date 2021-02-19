const registerForm = document.querySelector(".register-form__form")
const emailTextField = document.querySelector(".register-form__email")
const nameTextField = document.querySelector(".register-form__name")
const passwordTextField = document.querySelector(".register-form__password")
const registerButton = document.querySelector(".register-form__btn-register")

function onSubmit(ev) {
    ev.preventDefault()
    if(ev.submitter == registerButton) {
        return
    }

    let { value: email } = emailTextField, { value: name } = nameTextField, { value: password } = passwordTextField

    email = email.trim()
    name = name.trim()
    password = password.trim()

    if(emailTextField.invalid) {
        emailTextField.invalid = false
    }
    if(nameTextField.invalid) {
        nameTextField.invalid = false
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

    if(name === "") {
        nameTextField.errorText = "Name is required!"
        nameTextField.invalid = true
    }

    if(!isValidName(name)) {
        nameTextField.errorText = "Please, enter correct name!"
        nameTextField.invalid = true
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

registerButton.addEventListener("click", onSubmit)
registerForm.addEventListener("submit", onSubmit)