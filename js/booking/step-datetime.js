//Booking step 3: pick a date, then a start time
//
//Uses from booking-state.js:  stepEl, booking, showError(), bookingTotals()
//Uses from helpers.js:        dayNames, toDateString(), parseDate(), todayString(),
//                             timeToMinutes(), minutesToTime(), formatTime()
//Uses from services-data.js:  openingHours, formatDuration()



//A new start time every 30 minutes: 10:00, 10:30, 11:00 ...
const SLOT_STEP = 30;



//Works out which start times are available on one date.
//Takes a date string like "2026-10-09". Returns a list like ["10:00", "10:30", ...]
//(an empty list means nothing is available that day).
//
//The key idea is that a visit must END before closing time:
//  last possible start = closing time - length of the visit
//  e.g. close at 7:00 pm, visit is 55 min -> last start is 6:05 pm -> last slot shown is 6:00 pm

function getSlots(dateString) {
    //getDay() gives 0 (Sunday) to 6 (Saturday), which is exactly how openingHours is keyed
    const hours = openingHours[parseDate(dateString).getDay()];

    //null means closed that day
    if (!hours) return [];

    const duration = bookingTotals().duration;
    const firstStart = timeToMinutes(hours.open);
    const lastStart = timeToMinutes(hours.close) - duration;

    //count up from opening to the last possible start, in 30-minute steps
    const slots = [];
    for (let t = firstStart; t <= lastStart; t += SLOT_STEP) {
        slots.push(minutesToTime(t));
    }

    //For today, also hide times that have passed, and anything less than an hour away
    if (dateString === todayString()) {
        const now = new Date();
        const earliest = now.getHours() * 60 + now.getMinutes() + 60;

        return slots.filter(function(slot) {
            return timeToMinutes(slot) >= earliest;
        });
    }

    return slots;
}



//Draws the date picker and an (initially empty) area for the time buttons.
//The time buttons themselves are drawn by renderSlots(), which re-runs whenever the date changes.

function renderStepDateTime() {
    const totals = bookingTotals();

    //the latest date you can book: three months from today
    const limit = new Date();
    limit.setMonth(limit.getMonth() + 3);

    //min/max stop the picker offering past dates or dates too far ahead
    //value="${booking.date}" restores the earlier choice if they come back with Back
    stepEl.innerHTML = `
    <h3>When would you like to come?</h3>
    <p class="booking-hint">Your visit takes ${formatDuration(totals.duration)}. We only show start times that fit before we close.</p>
    
    <label class="booking-field">
        <span>Date</span>
        <input type="date" id="booking-date" min="${todayString()}" max="${toDateString(limit)}" value="${booking.date}">
    </label>
    
    
    <p id="booking-slots-note" class="booking-note" aria-live="polite"></p>
    <div id="booking-slots" role="radiogroup" aria-label="Available start times"></div>
    `;


    document.getElementById("booking-date").addEventListener("change", function(event) {
        //a different date means the old time may no longer exist, so forget it
        if (event.target.value !== booking.date) {
            booking.time = "";
        }

        booking.date = event.target.value;
        showError("");
        renderSlots();      //redraw the time buttons for the new date
    });

    //also draw once now, in case a date is already chosen (coming back with Back)
    renderSlots();
}



//Draws the start-time buttons for the chosen date, or a message explaining why there are none.
//There are four possible outcomes:
//  1. no date chosen yet   -> "Choose a date..."
//  2. closed that day      -> "We're closed on Mondays..."
//  3. open, but no room    -> "No start times are left..."  (visit too long, or today is nearly over)
//  4. open with room       -> one button per start time

function renderSlots() {
    const noteEl = document.getElementById("booking-slots-note");
    const slotsEl = document.getElementById("booking-slots");
    slotsEl.innerHTML = "";

    //1.
    if (booking.date === "") {
        noteEl.textContent = "Choose a date to see available times.";
        return;
    }

    const dayName = dayNames[parseDate(booking.date).getDay()];

    //2.
    if (!openingHours[parseDate(booking.date).getDay()]) {
        noteEl.textContent = `We're closed on ${dayName}s. Please choose another day.`;
        booking.time = "";
        return;
    }

    const slots = getSlots(booking.date);

    //3.
    if (slots.length === 0) {
        noteEl.textContent = "No start times are left for a visit this long. Please try another date.";
        booking.time = "";
        return;
    }

    //if the remembered time isn't in today's list any more, forget it
    if (!slots.includes(booking.time)) {
        booking.time = "";
    }

    //4.
    noteEl.textContent = `Start times on ${dayName}:`;

    for (const slot of slots) {
        const label = document.createElement("label");
        label.classList.add("booking-slot");
        label.innerHTML = `
        <input type="radio" name="booking-time" value="${slot}" ${slot === booking.time ? "checked" : ""}>
        <span>${formatTime(slot)}</span>
        `;

        label.querySelector("input").addEventListener("change", function() {
            booking.time = slot;
            showError("");
        });

        slotsEl.appendChild(label);
    }
}



//Step 3 is complete when there is a valid date AND a start time.
//The date is checked again here even though the picker limits it, because
//people can type into a date field or the browser may not enforce min/max.

function validateStepDateTime() {
    if (booking.date === "") {
        return "Please choose a date.";
    }

    //"2026-10-09" strings can be compared directly with < because the year comes first
    if (booking.date < todayString()) {
        return "Please choose a date from today onwards.";
    }

    const day = parseDate(booking.date).getDay();
    if (!openingHours[day]) {
        return `We're closed on ${dayNames[day]}s. Please choose another day.`;
    }

    if (booking.time === "") {
        return "Please choose a start time.";
    }

    return "";
}