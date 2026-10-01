//About section: the space gallery and the team grid
//Uses: team (from services-data.js)

const galleryEl = document.getElementById("about-gallery");
const teamGridEl = document.getElementById("team-grid");


//gallery

const galleryPhotos = [
    {src: "./images/space/massage-room.webp", caption: "The massage room"},
    {src: "./images/space/facial-room.webp", caption: "The facial room"},
    {src: "./images/space/nails-room.webp", caption: "The nail bar"},
    {src: "./images/space/outside-the-door.webp", caption: "Where it all begins"}
];


function renderGallery() {
    for (const photo of galleryPhotos) {
        const fig = document.createElement("figure");
        fig.classList.add("gallery-item");
        fig.innerHTML = `
            <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
            <figcaption>${photo.caption}</figcaption>
        `;
        galleryEl.appendChild(fig);
    }
}

renderGallery();



//team grid

function renderTeam() {
    for (const id in team) {
        const person = team[id];
        const card = document.createElement("div");
        card.classList.add("team-card");
        card.innerHTML = `
            <img class="team-photo" src="${person.photo}" alt="${person.name}">
            <h4>${person.name}</h4>
            <p class="team-role">${person.role}</p>
            <p class="team-bio">${person.bio}</p>
        `;
        teamGridEl.appendChild(card);
    }
}

renderTeam();