//Bundles section: the grid of bundle tiles
//Uses: bundles, findService(), bundleDuration(), bundleSavings(), formatDuration() (all from services-data.js)
//
//Note: the "Book this" link inside each tile is handled in booking.js,
//because clicking it changes the booking state.

const bundleGridEl = document.getElementById("bundle-grid");


function renderBundles() {
    bundleGridEl.innerHTML = "";

    for (const bundle of bundles) {
        const tile = document.createElement("article");
        tile.classList.add("bundle-tile", bundle.id);

        let includedHTML = "";
        for (const id of bundle.includes) {
            includedHTML += `<li>${findService(id).name}</li>`;
        }

        tile.innerHTML = `
        <img class="bundle-photo" src="./images/bundles/${bundle.id}.webp" alt="" loading="lazy">
        
        <div class="bundle-label">
            ${bundle.featured ? '<span class="bundle-badge">Our flagship </span>' : ""}
            <h3>${bundle.name}</h3>
            <p class="bundle-price">$${bundle.price}</p>
            <button class="bundle-toggle" aria-expanded="false" aria-controls="bundle-${bundle.id}">What's included</button>
        </div>
        
        <div class="bundle-details" id="bundle-${bundle.id}">
            <button class="bundle-close" aria-label="Close details">×</button>
            <h3>${bundle.name}</h3>
            <p>${bundle.brief}</p>
            <ul>${includedHTML}</ul>
            <p class="bundle-meta">${formatDuration(bundleDuration(bundle))} · Save $${bundleSavings(bundle)}</p>
            <a href="#booking" class="bundle-book" data-bundle="${bundle.id}">Book this</a>
        </div>
        `;


        const toggleBtn = tile.querySelector(".bundle-toggle");
        const closeBtn = tile.querySelector(".bundle-close");

        const setOpen = function(isOpen) {
            tile.classList.toggle("open", isOpen);
            toggleBtn.setAttribute("aria-expanded", String(isOpen));
        };

        toggleBtn.addEventListener("click", function() {
            setOpen(true);
        });

        closeBtn.addEventListener("click", function() {
            setOpen(false);
            toggleBtn.focus();
        });

        bundleGridEl.appendChild(tile);
    }


    //the empty tile that fills the last corner of the grid
    const block = document.createElement("div");
    block.classList.add("bundle-block");
    block.setAttribute("aria-hidden", "true");
    bundleGridEl.appendChild(block);
}

renderBundles();