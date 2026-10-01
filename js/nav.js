//Navigation bar: the hamburger menu on small screens

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("navigation-links");


//opens and closes the menu
navToggle.addEventListener("click", function() {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
});

//closes the menu after a link is tapped
navLinks.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function(){
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    });
});

//closes the menu when tapping anywhere outside it
document.addEventListener("click", function(event) {
    const clickedInsideNav = navToggle.contains(event.target) || navLinks.contains(event.target);
    if (!clickedInsideNav && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }
});