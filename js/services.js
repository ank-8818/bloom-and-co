//Services section: category tabs and service cards
//Uses: services, team, formatDuration() (all from services-data.js)

const tabsEl = document.getElementById("service-tabs");
const categoryIntroEl = document.getElementById("category-intro");
const categoryTeamEl = document.getElementById("category-team");
const serviceCardsEl = document.getElementById("service-cards");

let activeCategory = "hair";


//build tab buttons
function buildTabs() {
    for (const key in services) {
        const btn = document.createElement("button");
        btn.textContent = services[key].label;
        btn.classList.add("tab");
        btn.dataset.category = key;
        btn.addEventListener("click", function() {
            setCategory(key);
        });

        tabsEl.appendChild(btn);
    }
}


//switch category, highlighting updated tab, then redraw the panel
function setCategory(key) {
    activeCategory = key;
    tabsEl.querySelectorAll(".tab").forEach(function(tab) {
        const isActive = tab.dataset.category === key;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
    });

    renderServices();
}


function renderServices() {

    categoryTeamEl.innerHTML = "";
    serviceCardsEl.innerHTML = "";
    const category = services[activeCategory];

    categoryIntroEl.textContent = category.intro;

    //team row
    for (const id of category.team) {
        const person = team[id];
        const member = document.createElement("div");
        member.classList.add("team-member");
        member.innerHTML = `
        <img class="team-photo" src="${person.photo}" alt="${person.name}">
        <span class="team-name">${person.name}</span>
        <span class="team-role"> ${person.role}</span>
        `;

        categoryTeamEl.appendChild(member);
    }


    //service cards
    serviceCardsEl.innerHTML = "";
    for (const item of category.items) {
        const card = document.createElement("article");
        card.classList.add("service-card");

        card.innerHTML = `
        <img class="service-card-img" src="./images/${activeCategory}/${item.id}.webp" alt="${item.name}">
        <div class="service-top">
            <h3>${item.name}</h3>
            <span class="service-price">$${item.price}</span>
        </div>
        
        <p class="service-meta">${formatDuration(item.duration)}</p>
        <p class="service-brief">${item.brief}</p>
        <button class="show-more" aria-expanded="false" aria-controls="details-${item.id}">
            <span>Show more</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
        </button>
        <p class="service-details" id="details-${item.id}" hidden>${item.details}</p>
        `;


        const moreBtn = card.querySelector(".show-more");
        const detailsEl = card.querySelector(".service-details");
        moreBtn.addEventListener("click", function() {
            const wasHidden = detailsEl.hidden;
            detailsEl.hidden = !wasHidden;
            moreBtn.setAttribute("aria-expanded", String(wasHidden));
            moreBtn.classList.toggle("expanded", wasHidden);
            moreBtn.querySelector("span").textContent = wasHidden ? "Show less" : "Show more";
        });

        serviceCardsEl.appendChild(card);
    }
}


buildTabs();
setCategory("hair");