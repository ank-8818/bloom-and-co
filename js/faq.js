//FAQ accordion
//Uses: faqs (from services-data.js)

const faqListEl = document.getElementById("faq-list");

let openFaqIndex = null;


function renderFaqs() {
    faqListEl.innerHTML = "";

    faqs.forEach(function(faq, index) {
        const item = document.createElement("div");
        item.classList.add("faq-item");

        item.innerHTML = `
            <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
                <span>${faq.question}</span>
                <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            </button>
            
            <div class="faq-answer" id="faq-answer-${index}" role="region">
                <p>${faq.answer}</p>
            </div>
        `;

        const questionBtn = item.querySelector(".faq-question");
        questionBtn.addEventListener("click", function() {
            toggleFaq(index);
        });

        faqListEl.appendChild(item);
    });
}


function toggleFaq(index) {
    const isCurrentlyOpen = openFaqIndex === index;


    //close whichever one was open, including this one if it's the one being closed
    if (openFaqIndex !== null) {
        setFaqOpen(openFaqIndex, false);
    }


    //if a different question was clicked, open it; if the same one was clicked, leave it closed
    if (!isCurrentlyOpen) {
        setFaqOpen(index, true);
        openFaqIndex = index;
    } else {
        openFaqIndex = null;
    }
}


function setFaqOpen(index, isOpen) {
    const item = faqListEl.children[index];
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    item.classList.toggle("open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
        answer.style.maxHeight = "0px";
    }
}


renderFaqs();