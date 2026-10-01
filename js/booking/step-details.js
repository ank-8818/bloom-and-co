//Booking step 4: the customer's details
//
//Uses from booking-state.js:  stepEl, booking
//
//Instead of writing five separate <input> blocks by hand, the form is described as DATA
//(detailFields below) and the code loops over that list to draw every field, wire its
//events, and validate it. Adding a new field means adding one entry to the list.



//Describes each field in the form.
//  key           the name used in the `booking` object (booking.name, booking.email, ...)
//  label         the text shown above the field
//  type          "text", "email", "tel" or "textarea" (the big multi-line box)
//  autocomplete  lets the browser offer to fill the field in
//  maxlength     the longest text allowed (only used by the textareas)
//  hint          optional small helper text under the label
//
//Note: `required` is written on three of the fields but nothing reads it.
//What decides whether a field is required is validateDetail() below.

const detailFields = [

    {
        key: "name",
        label: "Full Name",
        type: "text",
        autocomplete: "name",
        required: "true"
    },

    {
        key: "email",
        label: "Email",
        type: "email",
        autocomplete: "email",
        required: "true"
    },

    {
        key: "phone",
        label: "Phone number",
        type: "tel",
        autocomplete: "tel",
        required: "true"
    },

    {
        key: "allergies",
        label: "Allergies or sensitivities (optional)",
        type: "textarea",
        maxlength: 500,
        hint: "Anything we should know about your skin, hair or health. We'll make sure everything we use is right for you."
    },

    {
        key: "notes",
        label: "Anything else? (optional)",
        type: "textarea",
        maxlength: 500
    }

];



//Checks ONE field.
//Takes the field's key and what the user typed. Returns "" if it is fine,
//or the message to show under the field if it is not.
//The optional fields (allergies, notes) have no checks, so they always return "".

function validateDetail(key, rawValue) {
    const value = rawValue.trim();      //trim removes spaces at the start and end

    if (key === "name") {
        if (value === "")
            return "Please enter your name.";

        //\p{L} means "any letter in any language", so names like "Zoë" or "李" pass
        if (!/\p{L}/u.test(value))
            return "Your name needs to contain at least one letter.";

        if (value.length < 2)
            return "Your name looks a little short.";
    }


    if (key === "email") {
        if (value === "")
            return "Please enter your email address.";

        //Rough shape check: something, an @, something, a dot, something (no spaces).
        //It can't tell if the address really exists, only that it looks like an email.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return "Please enter a valid email, like name@example.com.";
    }


    if (key === "phone") {
        if (value === "")
            return "Please enter your phone number.";

        //only digits, spaces, + - and brackets are allowed
        if (!/^\+?[0-9\s\-()]+$/.test(value))
            return "Phone numbers can only contain digits, spaces, + - and brackets.";

        //then count just the digits: between 7 and 15 covers phone numbers worldwide
        const digits = value.replace(/\D/g, "");        //\D = "anything that isn't a digit"
        if (digits.length < 7 || digits.length > 15)
            return "Please enter a phone number with 7 to 15 digits.";
    }

    return "";
}



//Shows (or clears) the error text under ONE field, and marks the field as invalid
//for screen readers (aria-invalid). Passing "" clears both.

function showFieldError(key, message) {
    const input = document.getElementById("field-" + key);
    const errorP = document.getElementById("error-" + key);

    errorP.textContent = message;
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}



//Draws the form, then connects each field to the `booking` object.

function renderStepDetails() {
    let html = `<h3>Your details</h3>`;

    //PART 1: build the HTML for every field from the detailFields list
    for (const field of detailFields) {
        //tells screen readers which hint and error text belong to this field
        const describedBy = field.hint ? `hint-${field.key} error-${field.key}` : `error-${field.key}`;
        const maxLength = field.maxlength ? `maxlength=${field.maxlength}` : "";

        //a textarea for the big boxes, an <input> for everything else
        const control = field.type === "textarea" ?
        `<textarea id="field-${field.key}" rows="3" ${maxLength} aria-describedby="${describedBy}"></textarea>` :
        `<input id="field-${field.key}" type="${field.type}" autocomplete="${field.autocomplete}" aria-describedby="${describedBy}">`;

        html += `
        <div class="detail-field">
            <label for="field-${field.key}">${field.label}</label>
            ${field.hint ? `<p class="detail-hint" id="hint-${field.key}">${field.hint}</p>` : ""}
            ${control}
            <p class="detail-error" id="error-${field.key}"></p>
        </div>`;
    }

    stepEl.innerHTML = html;

    //PART 2: now that the fields exist on the page, connect each one
    for (const field of detailFields) {
        const input = document.getElementById("field-" + field.key);

        //fill in what they typed before (when coming back with Back)
        input.value = booking[field.key];

        //every keystroke saves into `booking`. And once a field is showing an error,
        //re-check it as they type, so the message disappears the moment they fix it.
        input.addEventListener("input", function() {
            booking[field.key] = input.value;
            if (input.getAttribute("aria-invalid") === "true") {
                showFieldError(field.key, validateDetail(field.key, input.value));
            }
        });

        //leaving the field ("blur"): tidy the spaces and check it for the first time
        input.addEventListener("blur", function() {
            input.value = input.value.trim();
            booking[field.key] = input.value;
            showFieldError(field.key, validateDetail(field.key, input.value));
        });
    }
}



//Step 4 is complete when every field passes its check.
//Unlike the other steps, this one shows each message UNDER its own field. It
//returns one general message for the red error line at the bottom, and moves the cursor
//to the first field that has a problem.

function validateStepDetails() {
    let firstInvalid = null;

    for (const field of detailFields) {
        const input = document.getElementById("field-" + field.key);
        const message = validateDetail(field.key, input.value);

        showFieldError(field.key, message);

        //remember only the FIRST bad field
        if (message !== "" && firstInvalid === null) {
            firstInvalid = input;
        }
    }

    if (firstInvalid !== null) {
        firstInvalid.focus();
        return "Please check the highlighted fields.";
    }

    return "";
}