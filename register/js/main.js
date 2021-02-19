const registerForm = document.querySelector(".register-form__form")
const emailTextField = document.querySelector(".register-form__email")
const nameTextField = document.querySelector(".register-form__name")
const passwordTextField = document.querySelector(".register-form__password")
const registerButton = document.querySelector(".register-form__btn-register")

async function onSubmit(ev) {
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

        return
    }

    if(!isValidEmail(email)) {
        emailTextField.errorText = "Email format is invalid!"
        emailTextField.invalid = true


        return
    }

    if(name === "") {
        nameTextField.errorText = "Name is required!"
        nameTextField.invalid = true

        return
    }

    if(!isValidName(name)) {
        nameTextField.errorText = "Please, enter correct name!"
        nameTextField.invalid = true

        return
    }

    if(password == "") {
        passwordTextField.errorText = "Password is required!"
        passwordTextField.invalid = true
        return
    }

    if(!isValidPassword(password)) {
        passwordTextField.errorText = "Use 8 or more characters with a mix of lowercase and uppercase letters, numbers & symbols"
        passwordTextField.invalid = true
        return
    }

  try { 
        const result = await fetch("http://api.todolist.local/auth/register", {
            method: "POST",
            mode: "cors",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email, password, name
            })
        })
    
        if(result.ok) {
            const response = await result.json()

            localStorage.setItem("token", response.access_token)
            localStorage.setItem("refresh_token", response.refresh_token)

        }
  } catch (err) {
      console.log(err)
  }
}

registerButton.addEventListener("click", onSubmit)
registerForm.addEventListener("submit", onSubmit)