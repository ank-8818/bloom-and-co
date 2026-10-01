//Booking wizard: shared elements, memory and small helpers
//
//Load this FIRST among the booking files. Every other booking file reads from it.
//Uses: services, bundles, bundleDuration() (from services-data.js)
//
//How the wizard fits together:
//  booking      -> the form's memory: everything the user has chosen so far
//  currentStep  -> a bookmark: which step (0 to 4) is showing
//  steps        -> (in booking.js) the table of contents: one entry per step
//  showStep()   -> (in booking.js) opens the page at the bookmark



//Page elements used by the wizard.
//Shared here because every step draws into stepEl, and several touch the others.

const progressEl = document.getElementById("booking-progress");     //the 1-2-3-4-5 bar at the top
const stepEl = document.getElementById("booking-step");             //where each step is drawn
const errorEl = document.getElementById("booking-error");           //the red message under the step
const backBtn = document.getElementById("booking-back");
const nextBtn = document.getElementById("booking-next");
const actionsEl = document.getElementById("booking-actions");       //the box holding Back and Next



//The form's memory.
//Every input the user touches writes its value in here, and every render and
//validate function reads from here. To see it live, type  booking  in the Console.

const booking = {
    type: null,         // how they chose to book: "bundle" | "custom" | "single"  (null = not chosen yet)
    bundleId: null,     // the id of the chosen bundle, if type is "bundle"
    serviceIds: [],     // the ids of chosen services, if type is "custom" or "single"
    date: "",           // "2026-10-09"
    time: "",           // "14:00"
    name: "",
    email: "",
    phone: "",
    allergies: "",
    notes: ""
};


//The bookmark: 0 = Choose, 1 = Select, 2 = Date & Time, 3 = Your details, 4 = Review
let currentStep = 0;



//Shows (or clears) the red message under the step.
//Takes a text. Passing "" empties it, which is how errors are cleared.

function showError(message) {
    errorEl.textContent = message;
}



//Finds one service by its id, whichever category it is in.
//Returns a COPY of the service with an extra "category" field added (e.g. "hair"),
//or null if the id doesn't exist.
//
//Note: findService() in services-data.js does almost the same job without the
//category. They could be merged into one later.

function lookupService(id) {
    for (const key in services) {
        for (const item of services[key].items) {
            if (item.id === id) {
                return {...item, category: key};    // "..." copies all of item's fields, then adds category
            }
        }
    }
    return null;
}



//Finds one bundle by its id. Returns the bundle, or undefined if there is no match.

function lookupBundle(id) {
    return bundles.find(function(bundle) {
        return bundle.id === id;
    });
}



//Works out the price, total duration and number of items for whatever is
//currently chosen. Returns {price, duration, count}.
//
//  - A bundle uses the bundle's own (discounted) price, not the sum of its services.
//  - A custom/single visit adds up the chosen services.
//  - Before anything is chosen, everything is 0.

function bookingTotals() {
    if (booking.type === "bundle") {
        const bundle = lookupBundle(booking.bundleId);
        if (!bundle) return {price: 0, duration: 0, count: 0};
        return {price: bundle.price, duration: bundleDuration(bundle), count: bundle.includes.length};
    }

    let price = 0;
    let duration = 0;
    for (const id of booking.serviceIds) {
        const service = lookupService(id);
        price += service.price;
        duration += service.duration;
    }
    return {price: price, duration: duration, count: booking.serviceIds.length};
}