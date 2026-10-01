//Booking wizard: the conductor
//
//Everything else lives in the other booking files. This one holds only the pieces that
//tie the steps together: the list of steps, drawing the current one, and the Next/Back buttons.
//
//LOAD THIS LAST among the booking files. The `steps` list below grabs the render and
//validate functions the moment this file runs, so they must already exist:
//  booking-state.js, step-choose.js, step-datetime.js, step-details.js, booking-submit.js



//Used by the Review step, which has nothing to check.
//An empty message "" means "everything is fine".

function validateNothing() {
    return "";
}



//THE TABLE OF CONTENTS.
//Each entry is one step, with three things:
//  label     the name shown in the progress bar
//  render    the function that draws it
//  validate  the function that decides if the user may move on ("" = yes, text = no)
//
//Notice there are no brackets after the function names: renderStepType, not renderStepType().
//Brackets would RUN the function right now. Without them we store the function itself,
//to run later with steps[currentStep].render().
//
//Position in this list = the number in `currentStep` (0 is Choose, 4 is Review).

const steps = [
    {
        label: "Choose",
        render: renderStepType,
        validate: validateStepType
    },

    {
        label: "Select",
        render: renderStepSelect,
        validate: validateStepSelect
    },

    {
        label: "Date & Time",
        render: renderStepDateTime,
        validate: validateStepDateTime
    },

    {
        label: "Your details",
        render: renderStepDetails,
        validate: validateStepDetails
    },

    {
        label: "Review",
        render: renderStepReview,
        validate: validateNothing
    }
];



//---------- Navigation ----------

//Draws the progress bar at the top: one item per step.
//Steps before the current one get "done", the current one gets "current" (the CSS styles both).

function renderProgress() {
    progressEl.innerHTML = "";

    steps.forEach(function(step, index) {
        const li = document.createElement("li");
        li.textContent = step.label;
        li.setAttribute("data-step", index + 1);
        li.classList.toggle("done", index < currentStep);
        li.classList.toggle("current", index === currentStep);

        //tells screen readers which step they are on
        if (index === currentStep)
            li.setAttribute("aria-current", "step");

        progressEl.appendChild(li);
    });
}


//Shows whichever step the bookmark (currentStep) points at.
//Called every time the step changes.

function showStep() {
    showError("");                      //clear any old message
    steps[currentStep].render();        //draw the step, found by its position in the list
    renderProgress();                   //update the progress bar

    backBtn.hidden = currentStep === 0;     //nowhere to go back to on the first step

    //on the last step, Next becomes the final confirm button
    nextBtn.textContent = currentStep === (steps.length - 1) ? "Confirm booking" : "Next";
}


//After a step change, bring the top of the wizard back into view if it has scrolled out of sight.
//The page gets shorter when a tall step is replaced by a short one, which is what causes the jump.

function scrollToWizard() {
    const wizard = document.getElementById("booking-wizard");

    //less than ~80px from the top means it is hidden under (or above) the navbar
    if (wizard.getBoundingClientRect().top < 80) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        wizard.scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block: "start"});
    }
}


//Next button: check the current step first.
//  the step has a problem -> show it and stay here
//  not the last step      -> move the bookmark forward and redraw
//  the last step          -> send the booking

nextBtn.addEventListener("click", function() {
    const message = steps[currentStep].validate();

    if (message !== "") {
        showError(message);
        return;
    }

    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep();
        scrollToWizard();
    } else {
        submitBooking();
    }
});


//Back button: no checks needed going backwards, just move the bookmark.

backBtn.addEventListener("click", function() {
    if (currentStep > 0) {
        currentStep--;
        showStep();
        scrollToWizard();
    }
});


//draw the very first step as soon as the page loads
showStep();



//---------- "Book this" on a bundle tile ----------

//The bundle tiles are created by bundles.js AFTER the page loads. Putting one click listener
//on the whole document, and then asking "was the click on a .bundle-book link?", works for
//every tile, including ones created later. This technique is called event delegation.
//
//What it does: skip to step 2 of the wizard with that bundle already chosen.
//(The link's href="#booking" also scrolls down to the wizard by itself.)

document.addEventListener("click", function(event) {
    const link = event.target.closest(".bundle-book");      //closest: this element or its nearest parent that matches
    if (!link) return;                                      //the click was somewhere else, ignore it

    if (isSubmitting) return;                               //don't interrupt a booking being sent
    if (isConfirmed) startOver();                           //after a finished booking, begin fresh

    booking.type = "bundle";
    booking.bundleId = link.dataset.bundle;                 //data-bundle="the-reset" on the link
    booking.serviceIds = [];
    currentStep = 1;
    showStep();
});