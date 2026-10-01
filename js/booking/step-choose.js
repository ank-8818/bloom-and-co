//Booking steps 1 and 2: HOW to book, then WHAT to book
//
//Uses from booking-state.js:  stepEl, booking, showError(), lookupService(), bookingTotals()
//Uses from services-data.js:  services, bundles, bundleDuration(), bundleSavings(), formatDuration()
//
//Every step has two functions:
//  render...()    draws the step inside stepEl, using what is already in `booking`
//  validate...()  returns "" if the step is complete, or a message to show if it isn't



//---------- STEP 1: how would you like to book? ----------

//The three choices. `value` is what gets saved in booking.type.
const bookingTypes = [
    {
        value: "bundle",
        title: "A ready-made bundle",
        text: "One of our bundled experiences, gently priced."
    },

    {
        value: "custom",
        title: "Build your own visit",
        text: "Combine two or more services into one appointment."
    },

    {
        value: "single",
        title: "One service",
        text: "Just the one thing you came for."
    }
];


//Draws the three radio-button cards.
//If the user comes back to this step (Back button), their earlier choice is
//pre-selected, because we mark it "checked" from booking.type.

function renderStepType() {
    let html = `
    <h3>How would you like to book?</h3>
    <div class="booking-options">
    `;

    for (const option of bookingTypes) {
        const checked = booking.type === option.value ? "checked" : "";
        html += `
        <label class="booking-option">
            <input type="radio" name="booking-type" value="${option.value}" ${checked}>
            <span class="booking-option-title">${option.title}</span>
            <span class="booking-option-text">${option.text}</span>
        </label>
        `;
    }

    html += `</div>`;

    stepEl.innerHTML = html;

    //the cards only exist AFTER stepEl.innerHTML runs, so listeners are attached after it
    stepEl.querySelectorAll("input[name='booking-type']").forEach(function(radio) {
        radio.addEventListener("change", function() {

            //Switching to a DIFFERENT type wipes the old choice, so a bundle pick
            //can't leak into a custom visit (or the other way round).
            if (booking.type !== radio.value) {
                booking.bundleId = null;
                booking.serviceIds = [];
            }

            booking.type = radio.value;
            showError("");      //they fixed the problem, so clear the red message
        });
    });
}


//Step 1 is complete once a type has been chosen.
function validateStepType() {
    if (booking.type === null) {
        return "Please choose how you'd like to book.";
    }

    return "";
}



//---------- STEP 2: choose the bundle or services ----------

//Step 2 looks different depending on the type chosen in step 1.
function renderStepSelect() {
    if (booking.type === "bundle") {
        renderBundleChoices();
    } else {
        renderServiceChoices();
    }
}


//If type is "bundle": a list of radio cards, one per bundle (pick exactly one).

function renderBundleChoices() {
    let html = `
    <h3>Choose your bundle</h3>
    <div class="booking-options">
    `;

    for (const bundle of bundles) {
        const checked = booking.bundleId === bundle.id ? "checked" : "";

        //["deep-tissue", "manicure"] -> "Deep Tissue Massage, Manicure"
        const includedNames = bundle.includes.map(function(id) {
            return lookupService(id).name;
        }).join(", ");

        html += `
        <label class="booking-option">
            <input type="radio" name="booking-bundle" value="${bundle.id}" ${checked}>
            <span class="booking-option-title">${bundle.name}</span>
            <span class="booking-option-text">${bundle.brief}</span>
            <span class="booking-option-includes">${includedNames}</span>
            <span class="booking-option-meta">$${bundle.price} · ${formatDuration(bundleDuration(bundle))} · Save $${bundleSavings(bundle)}</span>
        </label>
        `;
    }
    html += `</div>`;
    stepEl.innerHTML = html;

    stepEl.querySelectorAll("input[name='booking-bundle']").forEach(function(radio) {
        radio.addEventListener("change", function() {
            booking.bundleId = radio.value;
            showError("");
        });
    });
}


//If type is "custom": checkboxes (pick several).
//If type is "single": radio buttons (pick one).
//Both use the same list, grouped by category (Hair, Skin, Massage, Nails).

function renderServiceChoices() {
    const isCustom = booking.type === "custom";
    const inputType = isCustom ? "checkbox" : "radio";
    const heading = isCustom ? "Build your own visit" : "Choose a service";
    const hint = isCustom ? "Pick at least two services." : "Pick the one you'd like.";

    let html = `
    <h3>${heading}</h3>
    <p class="booking-hint">${hint}</p>
    `;

    for (const key in services) {
        html += `<fieldset class="booking-group"><legend>${services[key].label}</legend>`;

        for (const item of services[key].items) {
            //add-ons (like the gel finish) only make sense when building a custom visit
            if (item.addon && !isCustom) continue;

            //pre-tick anything already chosen, for when they come back with Back
            const checked = booking.serviceIds.includes(item.id) ? "checked" : "";

            //data-... attributes store extra info on the input, read later via input.dataset
            html += `
            <label class="booking-service">
                <input type="${inputType}" name="booking-service" value="${item.id}" data-category="${key}" data-addon="${item.addon ? "true" : "false"}" ${checked}>
                <span class="booking-service-name">${item.name}</span>
                <span class="booking-service-meta">${formatDuration(item.duration)} · $${item.price}</span>
            </label>
            `;
        }
        html += `</fieldset>`;
    }

    //live line like "2 selected · 1 hr 15 min · $130" (filled in by updateSummary)
    html += `<p id="booking-summary" aria-live="polite"></p>`;
    stepEl.innerHTML = html;

    stepEl.querySelectorAll("input[name='booking-service']").forEach(function(input) {
        input.addEventListener("change", function() {
            if (isCustom) {
                toggleService(input.value, input.checked);      //add to / remove from the list
            } else {
                booking.serviceIds = [input.value];             //single: the list is just this one
            }
            syncServiceChoices();       //re-apply the add-on rule and refresh the summary
            showError("");
        });
    });

    //run once on draw too, so add-ons start in the right enabled/disabled state
    syncServiceChoices();
}


//Adds a service id to booking.serviceIds when ticked, removes it when unticked.
//The checks stop the same id being added twice, or removing one that isn't there.

function toggleService(id, isChecked) {
    const index = booking.serviceIds.indexOf(id);       //-1 means "not in the list"
    if (isChecked && index === -1) {
        booking.serviceIds.push(id);
    } else if (!isChecked && index !== -1) {
        booking.serviceIds.splice(index, 1);            //remove one item at that position
    }
}


//THE ADD-ON RULE:
//An add-on (like the gel finish) can only be ticked when a regular service from the
//SAME category is also ticked. Without a manicure or pedicure, there's nothing to add the gel to.
//
//This runs after every change and does two things:
//  1. works out which categories currently have a regular service chosen
//  2. enables the add-ons in those categories, disables the rest, and un-ticks any
//     add-on whose base service was just removed

function syncServiceChoices() {
    const inputs = stepEl.querySelectorAll("input[name='booking-service']");

    //1. which categories have a regular (non add-on) service chosen?
    const categoriesWithBase = [];
    for (const id of booking.serviceIds) {
        const service = lookupService(id);
        if (!service.addon) categoriesWithBase.push(service.category);
    }

    //2. apply the rule to each add-on checkbox
    inputs.forEach(function(input) {
        if (input.dataset.addon === "true") {
            const allowed = categoriesWithBase.includes(input.dataset.category);
            input.disabled = !allowed;

            //if the add-on was ticked but its base service was removed, un-tick it
            if (!allowed && input.checked) {
                input.checked = false;
                toggleService(input.value, false);
            }
        }
    });

    updateSummary();
}


//Refreshes the "2 selected · 1 hr 15 min · $130" line.
function updateSummary() {
    const summaryEl = document.getElementById("booking-summary");
    if (!summaryEl) return;     //the line doesn't exist on the bundle screen

    const totals = bookingTotals();
    if (totals.count === 0) {
        summaryEl.textContent = "Nothing selected yet.";
    } else {
        summaryEl.textContent = `${totals.count} selected · ${formatDuration(totals.duration)} · $${totals.price}`;
    }
}


//Step 2 is complete when:
//  bundle  -> a bundle is chosen
//  single  -> one service is chosen
//  custom  -> at least TWO regular services are chosen (add-ons don't count)

function validateStepSelect() {
    if (booking.type === "bundle") {
        return booking.bundleId ? "" : "Please choose a bundle.";
    }

    if (booking.type === "single") {
        return booking.serviceIds.length > 0 ? "" : "Please choose a service.";
    }

    //keep only the regular (non add-on) services
    const regular = booking.serviceIds.filter(function(id) {
        return !lookupService(id).addon;
    });

    return regular.length >= 2 ? "" : "Please choose at least two services to build your own visit.";
}