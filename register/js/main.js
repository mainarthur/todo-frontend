const registerForm = document.querySelector(".register-form__form")
const emailTextField = document.querySelector(".register-form__email")
const nameTextField = document.querySelector(".register-form__name")
const passwordTextField = document.querySelector(".register-form__password")
const registerButton = document.querySelector(".register-form__btn-register")
const requestErrorLabel = document.querySelector(".register-form__form-request-error")

const visibleRequestErrorLabelClassName = "register-form__form-request-error_visible"

async function onSubmit(ev) {
    ev.preventDefault()
    if(ev.submitter == registerButton) {
        return
    }

    if(requestErrorLabel.classList.contains(visibleRequestErrorLabelClassName)) {
        requestErrorLabel.classList.remove(visibleRequestErrorLabelClassName)
        requestErrorLabel.innerText = "1"
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
        console.log(password)
        passwordTextField.errorText = "Use 8 or more characters with a mix of lowercase and uppercase letters, numbers & symbols"
        passwordTextField.invalid = true
        return
    }

  try { 
        const registerResult = await fetch("http://api.todolist.local/auth/register", {
            method: "POST",
            mode: "cors",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email, password, name
            })
        })
    
        if(registerResult.ok) {
            const registerResponse = await registerResult.json()

            localStorage.setItem("token", registerResponse.access_token)
            localStorage.setItem("refresh_token", registerResponse.refresh_token)

            try {
                const response = await makeRequest("user")
                
                if(response?.status) {
                    const user = response.result
                    
                    localStorage.setItem("id", user.id)
                    localStorage.setItem("email", user.email)
                    localStorage.setItem("name", user.name)

                    location.href = "/"
                } else {
                    if(response) {
                        requestErrorLabel.classList.add(visibleRequestErrorLabelClassName)

                        requestErrorLabel.innerText = response.error
                    }
                }
            } catch (err) {
                console.log(err)   
            }

        } else {
            if(registerResult.headers.get("content-type") == "application/json") {
                const registerResponse = await registerResult.json()
                requestErrorLabel.classList.add(visibleRequestErrorLabelClassName)

                requestErrorLabel.innerText = registerResponse.error
            }
        }
  } catch (err) {
      console.log(err)
  }
}




registerButton.addEventListener("click", onSubmit)
registerForm.addEventListener("submit", onSubmit)