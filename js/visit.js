//getting elements from the HTML file

const visitHoursEl = document.getElementById("visit-hours");
const visitStatusEl = document.getElementById("visit-status");
const visitStatusTextEl = document.getElementById("visit-status-text");


function renderVisitHours(todayIndex) {
    visitHoursEl.innerHTML = "";

    const order = [1, 2, 3, 4, 5, 6, 0];

    for (const d of order) {
        const hours = openingHours[d];
        const timeText = hours ? `${formatTime(hours.open)} to ${formatTime(hours.close)}` : "Closed";

        const li = document.createElement("li");
        li.classList.toggle("today", d === todayIndex);

        li.innerHTML = `
        <span>${dayNames[d]}</span>
        <span${hours ? "" : ' class="day-closed"'}>${timeText}</span>
        `;

        visitHoursEl.appendChild(li);
    }
}


function renderVisitStatus(todayIndex, minutes) {
    const today = openingHours[todayIndex];

    //open right now?
    if (today && minutes >= timeToMinutes(today.open) && minutes < timeToMinutes(today.close)) {
        visitStatusEl.dataset.state = "open";
        visitStatusTextEl.textContent = `Open now, until ${formatTime(today.close)}`;

        return;
    }

    //closed: looked ahead up to a week for the next opening
    visitStatusEl.dataset.state = "closed";

    for (let i = 0; i < 7; i++) {
        const d = (todayIndex + i) % 7;
        const hours = openingHours[d];
        if (!hours) continue;


        //today, but we've already opened and closed
        if (i === 0 && minutes >= timeToMinutes(hours.open)) continue;


        let when = dayNames[d];
        if (i === 0) when = "today";
        if (i === 1) when = "tomorrow";

        visitStatusTextEl.textContent = `Closed now. Opens ${when} at ${formatTime(hours.open)}`;

        return;
    }

    visitStatusTextEl.textContent = "Closed";
}


function updateVisit() {
    const now = new Date();
    const todayIndex = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();

    renderVisitHours(todayIndex);
    renderVisitStatus(todayIndex, minutes);
  
}


if (visitHoursEl && visitStatusEl && visitStatusTextEl) {
    updateVisit();
    setInterval(updateVisit, 60 * 1000);
} else {
    console.warn("Visit section: one or more elements not found. Check the ids.");
}