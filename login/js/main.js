const users = [
    {email: "test@test.com", id: 1, password: "123"},
    {email: "root@test.com", id: 2, password: "123"},
]


const loginButton = document.querySelector(".login-form__btn-login")
const loginForm = document.querySelector(".login-form__form")

const emailTextField = document.querySelector(".login-form__email")
const passwordTextField = document.querySelector(".login-form__password")


const requestErrorLabel = document.querySelector(".login-form__form-request-error")

const visibleRequestErrorLabelClassName = "login-form__form-request-error_visible"

async function onSubmit(ev) {
    if(ev.submitter == loginButton) {
        return
    }


    if(requestErrorLabel.classList.contains(visibleRequestErrorLabelClassName)) {
        requestErrorLabel.classList.remove(visibleRequestErrorLabelClassName)
        requestErrorLabel.innerText = "1"
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

    try {
        const loginResponse = await fetch("http://api.todolist.local/auth/login", {
            method: "POST",
            mode: "cors",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })
    
        if(loginResponse.ok) {
            const loginResult = await loginResponse.json()

            localStorage.setItem("token", loginResult.access_token)
            localStorage.setItem("refresh_token", loginResult.refresh_token)

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
            if(loginResponse.headers.get("content-type") == "application/json") {
                const registerResponse = await loginResponse.json()
                requestErrorLabel.classList.add(visibleRequestErrorLabelClassName)

                requestErrorLabel.innerText = registerResponse.error
            }
        }
    } catch(e) {
        console.log(e)
    }
    
}


loginButton.addEventListener("click", onSubmit)
loginForm.addEventListener("submit", onSubmit)