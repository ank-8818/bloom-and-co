//Small helper functions - date, times, text

//Days
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


//Dates
 
//date -> "2026-10-07"
function toDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
 
    return `${y}-${m}-${d}`;
}
 
//"2026-10-07" -> date
function parseDate(dateString) {
    const parts = dateString.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}
 
function todayString() {
    return toDateString(new Date());
}
 
//"2026-10-07" -> "Wednesday, 7 October 2026"
function formatLongDate(dateString) {
    return parseDate(dateString).toLocaleDateString("en-US",
        {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        }
    );
}



//Times
 
//"14:30" -> 870
function timeToMinutes(time) {
    const parts = time.split(":").map(Number);
    return parts[0] * 60 + parts[1];
}
 
//870 -> "14:30"
function minutesToTime(minutes) {
    const h = String(Math.floor(minutes/60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
}
 
//"14:30" -> "2:30 pm"
function formatTime(time) {
    const parts = time.split(":").map(Number);
    const suffix = parts[0] >= 12 ? "pm" : "am";
    const hour = parts[0] % 12 === 0 ? 12 : parts[0] % 12;
    return `${hour}:${String(parts[1]).padStart(2, "0")} ${suffix}`;
}
 
 
//Text
 
//makes text safe to put inside innerHTML
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}