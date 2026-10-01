//Booking step 5 and what happens after: review, send, confirm, start over
//
//Uses from booking-state.js:  booking, stepEl, progressEl, actionsEl, currentStep,
//                             showError(), lookupService(), lookupBundle(), bookingTotals()
//Uses from helpers.js:        formatTime(), minutesToTime(), timeToMinutes(), formatLongDate(), escapeHTML()
//Uses from services-data.js:  bundleSavings(), formatDuration()
//Uses from the other step files: validateStepSelect(), validateStepDateTime(), getSlots(),
//                             validateDetail(), detailFields
//Uses from booking.js:        showStep()   (only called later, never while loading, so load order is fine)


//Two flags that remember what is happening right now.
//isSubmitting -> true while the booking is being sent (stops a double click sending it twice)
//isConfirmed  -> true once the confirmation screen is showing (booking.js checks this too)
let isSubmitting = false;
let isConfirmed = false;



//---------- STEP 5: review ----------

//Draws the "Take a last look" summary: the visit, the date and time, and the details.
//Each block has an Edit button that jumps back to the matching step.

function renderStepReview() {

    const totals = bookingTotals();

    //when the visit finishes = start time + length of the visit
    const endTime = minutesToTime(timeToMinutes(booking.time) + totals.duration);

    //PART 1: the "Your visit" block looks different for a bundle and for separate services
    let visitHTML = "";
    if (booking.type === "bundle") {
        const bundle = lookupBundle(booking.bundleId);
        visitHTML = `<p class="review-strong">${bundle.name}<span>$${bundle.price}</span></p><ul class="review-list">`;

        for (const id of bundle.includes) {
            visitHTML += `<li>${lookupService(id).name}</li>`;
        }

        visitHTML += `</ul><p class="review-muted">You save $${bundleSavings(bundle)}</p>`;
    } else {
        visitHTML = `<ul class="review-list review-priced">`;
        for (const id of booking.serviceIds) {
            const service = lookupService(id);
            visitHTML += `<li><span>${service.name}</span><span>$${service.price}</span></li>`;
        }

        visitHTML += `</ul>`;
    }

    //PART 2: put the whole page together.
    //escapeHTML() is used on everything the USER typed (name, email, notes...). Without it, someone
    //could type HTML or a script into a field and it would run on the page. Text from our own
    //data files doesn't need it.
    stepEl.innerHTML = `
    <h3>Take a last look</h3>
    
    <section class="review-block">
        <div class="review-head">
            <h4>Your visit</h4>
            <button type="button" class="review-edit" data-step="1">Edit</button>
        </div>
        
        ${visitHTML}
    </section>
    
    
    <section class="review-block">
        <div class="review-head">
            <h4>Date &amp; time</h4>
            <button type="button" class="review-edit" data-step="2">Edit</button>
        </div>
        
        <p class="review-strong">${formatLongDate(booking.date)}</p>
        <p>${formatTime(booking.time)}, finishing around ${formatTime(endTime)} (${formatDuration(totals.duration)})</p>
    </section>
    
    <section class="review-block">
        <div class="review-head">
            <h4>Your details</h4>
            <button type="button" class="review-edit" data-step="3">Edit</button>
        </div>
        
        <p>${escapeHTML(booking.name)}</p>
        <p>${escapeHTML(booking.email)}</p>
        <p>${escapeHTML(booking.phone)}</p>

        ${booking.allergies ? `<p class="review-note"><strong>Allergies or sensitivities:</strong> ${escapeHTML(booking.allergies)}</p>` : ""}
        
        ${booking.notes ? `<p class="review-note"><strong>Notes:</strong> ${escapeHTML(booking.notes)}</p>` : ""}
    </section>
    
    
    <div class="review-total">
        <span>Total</span><span>$${totals.price}</span>
    </div>

    <p class="review-muted">Nothing is charged online. You pay at your appointment.</p>
    `;


    //PART 3: each Edit button sets the bookmark to its step (data-step) and redraws.
    //Because everything is still saved in `booking`, the earlier answers are already filled in.
    stepEl.querySelectorAll(".review-edit").forEach(function(btn) {
        btn.addEventListener("click", function() {
            currentStep = Number(btn.dataset.step);
            showStep();
            scrollToWizard();
        });
    });
}



//---------- Final check before sending ----------

//Runs every earlier check again, from the beginning, right before sending.
//Why again? Each step was checked as the user passed it, but things can change in
//between (for example, a time that was free a few minutes ago has now passed).
//Returns "" if all is fine, or a message about the first problem found.

function validateBookingData() {
    if (booking.type === null)
        return "Please choose how you'd like to book.";

    const selectMessage = validateStepSelect();
    if (selectMessage !== "")
        return selectMessage;

    const dateMessage = validateStepDateTime();
    if (dateMessage !== "")
        return dateMessage;

    //is the chosen time STILL in the list of available times?
    if (!getSlots(booking.date).includes(booking.time)) {
        return "That time is no longer available. Please choose another.";
    }

    for (const field of detailFields) {
        if (validateDetail(field.key, booking[field.key]) !== "") {
            return "Something in your details needs fixing. Please go back and check.";
        }
    }

    return "";
}



//---------- Sending ----------

//Builds the data to send to a server: plain values only, nothing about the screen.
//When a real backend exists, this object is what it would receive.

function buildPayload() {
    const totals = bookingTotals();
    return {
        type: booking.type,
        bundleId: booking.bundleId,
        serviceIds: booking.serviceIds,
        date: booking.date,
        time: booking.time,
        durationMinutes: totals.duration,
        totalPrice: totals.price,
        customer: {
            name: booking.name.trim(),
            email: booking.email.trim(),
            phone: booking.phone.trim(),
            allergies: booking.allergies.trim(),
            notes: booking.notes.trim()
        }
    };
}


//Makes a reference like "BC-AHHVJN".
//The letters leave out look-alikes (0/O, 1/I), so it is easy to read out over the phone.

function generateReference() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }

    return "BC-" + code;
}


//The ONLY function that talks to a server. For now it pretends: it waits 1.8 seconds, then
//says yes. When you build a real backend, this is the only function you change.
//
//It returns a PROMISE: a placeholder for an answer that has not arrived yet. `resolve(...)` is
//the moment the answer arrives. Whoever called sendBooking() can wait for it with `await`.

function sendBooking(payload) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve({reference: generateReference()});
        }, 1800);
    });
}



//---------- Submitting ----------

//Runs when Next is pressed on the last step ("Confirm booking").
//
//`async` marks a function that is allowed to use `await`. `await` means "pause THIS function
//until the answer arrives", but the rest of the page keeps working while it waits.
//
//The order of events:
//  1. ignore the click if we are already sending
//  2. run the final check; if it fails, show the problem and stop
//  3. show the "Sending..." screen
//  4. wait for sendBooking to answer
//  5. success -> confirmation screen. Failure -> put the review back with an error message
//  6. either way, `finally` unlocks the button for next time

async function submitBooking() {
    if (isSubmitting) return;

    const problem = validateBookingData();
    if (problem !== "") {
        showError(problem);
        return;
    }

    isSubmitting = true;
    showSubmitting();
    scrollToWizard();

    try {
        const result = await sendBooking(buildPayload());

        showConfirmation(result.reference);
    } catch (error) {
        //if sending fails, bring the review back with a message

        progressEl.style.display = "";
        actionsEl.style.display = "";
        showStep();
        showError("Something went wrong while sending your booking. Please try again.");
    } finally {
        isSubmitting = false;
    }
}


//The "Sending your booking..." screen. Hides the progress bar and the Back/Next buttons
//so nothing can be clicked while waiting.

function showSubmitting() {
    progressEl.style.display = "none";
    actionsEl.style.display = "none";
    showError("");


    stepEl.innerHTML = `
    <div class="booking-status" role="status">
        <div class="booking-spinner" aria-hidden="true"></div>
        <h3>Sending your booking...</h3>
        <p>Just a moment</p>
    </div>
    `;
}


//The "You're booked." screen. Takes the reference that sendBooking returned.

function showConfirmation(reference) {

    isConfirmed = true;

    stepEl.innerHTML = `
    <div class="booking-status">
        <div class="booking-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="5 13 10 18 19 7"/>
            </svg>
        </div>
        <h3 id="booking-confirm-heading" tabindex="-1">You're booked.</h3>
        <p>${formatLongDate(booking.date)} at ${formatTime(booking.time)}</p>
        <p class="booking-reference"> Reference: <strong>${reference}</strong></p>
        <p>We'll send a confirmation to <strong>${escapeHTML(booking.email)}</strong>. Take your time getting here. We'll be ready.</p>
        <button type="button" id="booking-restart" class="btn-secondary">Make another booking</button>
    </div>
    `;

    //moving the keyboard focus to the heading makes screen readers announce it
    document.getElementById("booking-confirm-heading").focus();

    document.getElementById("booking-restart").addEventListener("click", startOver);
}


//Wipes the form back to its starting state ("Make another booking") and shows step 1 again.
//Object.assign(target, values) overwrites many fields of an object in one go.
//We reset the fields one by one instead of replacing `booking` itself, because every other file
//already holds a reference to that same object.

function startOver() {
    Object.assign(booking, {
        type: null,
        bundleId: null,
        serviceIds: [],
        date: "",
        time: "",
        name:"",
        email: "",
        phone: "",
        allergies: "",
        notes: ""
    });

    currentStep = 0;
    isConfirmed = false;
    progressEl.style.display = "";
    actionsEl.style.display = "";
    showStep();
}