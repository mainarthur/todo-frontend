class TextField extends HTMLDivElement {
    static TEXTFIELD_CLASSNAME = "textfield"
    static FLOATING_LABEL_CLASSNAME = "textfield__floating"
    static INPUT_CLASSNAME = "textfield__input"
    static LABEL_CLASSNAME = "textfield__label"
    static ERROR_LABEL_CLASSNAME = "textfield__label_error"
    static VISIBLE_ERROR_LABEL_CLASSNAME = "textfield__label_error-visible"
    static BOTTOM_LINE_CLASSNAME = "textfield__border"
    static BOTTOM_LINE_ANIMETED_CLASSNAME = "textfield__border_animated"
    static BOTTOM_LINE_MAXIMIZING_CLASSNAME = "textfield__border_maximizing"
    static BOTTOM_LINE_MINIMIZING_CLASSNAME = "textfield__border_minimizing"

    static _counter = 0

    static get observedAttributes() {
        return ["type", "name", "error-text", "placeholder", "value", "required", "invalid"]
    }

    _inputId
    _floatingLabelDiv
    _input
    _inputLabel
    _borderDiv
    _animatedBorderDiv
    _errorLabel

    constructor() {
        super()

        this.classList.add(TextField.TEXTFIELD_CLASSNAME)

        this._inputId = TextField._generateInputId()

        this._floatingLabelDiv = document.createElement("div")

        this._floatingLabelDiv.className = TextField.FLOATING_LABEL_CLASSNAME
        
        this._input = document.createElement("input")

        this._input.addEventListener("focusin", () => {
            if(this._animatedBorderDiv.classList.contains(TextField.BOTTOM_LINE_MINIMIZING_CLASSNAME)) {
                this._animatedBorderDiv.classList.remove(TextField.BOTTOM_LINE_MINIMIZING_CLASSNAME)
            }
            
            this._animatedBorderDiv.classList.add(TextField.BOTTOM_LINE_MAXIMIZING_CLASSNAME)
        })
        this._input.addEventListener("focusout", () => {
            if(this._input.value === "") {
                if(this._animatedBorderDiv.classList.contains(TextField.BOTTOM_LINE_MAXIMIZING_CLASSNAME))
                    this._animatedBorderDiv.classList.remove(TextField.BOTTOM_LINE_MAXIMIZING_CLASSNAME)
    
                this._animatedBorderDiv.classList.add(TextField.BOTTOM_LINE_MINIMIZING_CLASSNAME)
            }
        })
        this._input.addEventListener("keypress", () => {
            if(this._input.value.length > 0) {
                this._input.dispatchEvent(new Event("focusin"))
            }
        })
        this._input.className = TextField.INPUT_CLASSNAME
        this._input.id = this._inputId
        this._floatingLabelDiv.append(this._input)

        this._inputLabel = document.createElement("label")

        this._inputLabel.className = TextField.LABEL_CLASSNAME
        this._inputLabel.setAttribute("for", this._inputId)
        this._floatingLabelDiv.append(this._inputLabel)

        this._borderDiv = document.createElement("div")

        this._borderDiv.className = TextField.BOTTOM_LINE_CLASSNAME

        this._animatedBorderDiv = document.createElement("div")
        
        this._animatedBorderDiv.className = TextField.BOTTOM_LINE_ANIMETED_CLASSNAME

        this._borderDiv.append(this._animatedBorderDiv)
        this._floatingLabelDiv.append(this._borderDiv)

        this._errorLabel = document.createElement("label")

        this._errorLabel.className = TextField.ERROR_LABEL_CLASSNAME

    }

    static _generateInputId() {
        return `textfield__input_${++TextField._counter}`
    }
    

    connectedCallback() {
        this.append(this._floatingLabelDiv)
        this.append(this._errorLabel)
        this.render()
    }


    get type() {
        return this.getAttribute("type")
    }

    set type(val) {
        if(val == "" || val == null) {
            this.removeAttribute("type")
        } else {
            this.setAttribute("type", val)
        }
    }

    get name() {
        return this.getAttribute("name") || ""
    }

    set name(val) {
        if(val == "" || val == null) {
            this.removeAttribute("name")
        } else {
            this.setAttribute("name", val)
        }
    }

    get errorText() {
        return this.getAttribute("error-text")
    }

    set errorText(val) {
        if(val == "" || val == null) {
            this.removeAttribute("error-text")
        } else {
            this.setAttribute("error-text", val)
        }
    }

    get label() {
        return this.getAttribute("label")
    }

    set label(val) {
        if(val == "" || val == null) {
            this.removeAttribute("label")
        } else {
            this.setAttribute("label", val)
        }
    }


    get placeholder() {
        return this.getAttribute("placeholder") || ""
    }

    set placeholder(val) {
        if(val == "" || val == null) {
            this.removeAttribute("placeholder")
        } else {
            this.setAttribute("placeholder", val)
        }
    }


    get value() {
        return this._input.value
    }

    set value(val) {
        this._input.value = val
        if(val == "") {
            this._input.dispatchEvent(new Event("focusout"))
        }
    }

    get invalid() {
        return this.hasAttribute("invalid")
    }

    set invalid(val) {
        if(val) {
            this.setAttribute("invalid", "")
        } else {
            this.removeAttribute("invalid")
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case "type":
            case "name":
            case "value":
            case "required":
                this.renderInput()
                break
            case "invalid":
            case "error-text":
                this.renderErrorLabel()
                break
            case "placeholder":
                this.renderPlaceholder()
                break
        }
    }



    render() {
        this.renderInput()
        this.renderPlaceholder()
        this.renderErrorLabel()
    }

    renderErrorLabel() {
        if (this.errorText) {
            this._errorLabel.innerText = this.errorText
            if (this._errorLabel.hidden) {
                this._errorLabel.hidden = false
            }
        } else {
            this._errorLabel.hidden = true
        }

        if (this.invalid) {
            if (!this._errorLabel.classList.contains(TextField.VISIBLE_ERROR_LABEL_CLASSNAME)) {
                this._errorLabel.classList.add(TextField.VISIBLE_ERROR_LABEL_CLASSNAME)
            }
        } else {
            if (this._errorLabel.classList.contains(TextField.VISIBLE_ERROR_LABEL_CLASSNAME)) {
                this._errorLabel.classList.remove(TextField.VISIBLE_ERROR_LABEL_CLASSNAME)
            }
        }
    }

    renderPlaceholder() {
        if (this.placeholder) {
            this._inputLabel.innerText = this.placeholder
            if (this._inputLabel.hidden) {
                this._inputLabel.hidden = false
            }
        } else {
            this._inputLabel.hidden = true
        }
    }

    renderInput() {
        this._input.type = this.type
        this._input.placeholder = this.placeholder
        this._input.value = this.value || this.getAttribute("value") 
        this._input.name = this.name
    }
}

customElements.define("text-field", TextField, { extends: "div" })

    