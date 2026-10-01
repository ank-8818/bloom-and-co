//Team members

const team = {
    anika: {
        name: "Anika Rao",
        role: "Founder & Lead Esthetician",
        bio: "Opened Bloom & Co. after years of watching clients get rushed out the door. Still reads every ingredient label.",
        photo: "./images/profile-pictures/anika.webp"
    },
    
    daniel: {
        name: "Daniel Okafor",
        role: "Senior Stylist",
        bio: "Twelve years behind the chair. Believes the best haircut is one you can style yourself on a Tuesday morning.",
        photo: "./images/profile-pictures/daniel.webp"
    },

    sofia: {
        name: "Sofia Marin",
        role: "Colorist",
        bio: "Specializes in soft, low-maintenance color, and is quick to say 'let's wait' when your hair needs a break.",
        photo: "./images/profile-pictures/sofia.webp"
    },

    leila: {
        name: "Leila Haddad",
        role: "Massage Therapist",
        bio: "Trained in Swedish and deep tissue. Checks in about pressure more than you'd expect, on purpose.",
        photo: "./images/profile-pictures/leila.webp"
    },

    tara: {
        name: "Tara Nguyen",
        role: "Nail Artist",
        bio: "Sterilizes everything twice, and will happily talk you out of gel when your nails need a rest.",
        photo: "./images/profile-pictures/tara.webp"
    }
};


//For the services tab contents- duration in minutes and price in dollars

const services = {
    hair: {
        label:"Hair",
        intro:"Every cut and color starts with a conversation about your hair: how it behaves, what you like, and what you don't want. Ammonia-free color is available on request.",
        team: ["daniel", "sofia"],
        items: [
            {
               id:"signature-cut",
               name:"Signature Cut & Style",
               duration:45,
               price:55,
               brief:"A precision cut shaped to how your hair actually grows and falls, not a one-size template.",
               details: "We begin by looking at your growth patterns, your texture, and how you usually wear your hair. We cut on damp hair, style it, and show you how to recreate it at home. If a cut you've asked for won't sit well on your hair, we'll say so and suggest what will."
            },

            {
                id: "blowout",
                name: "Blowout & Style",
                duration: 30,
                price: 35,
                brief: "For when you want to look put-together, not perfect.",
                details: "A wash, gentle heat styling with a heat protectant, and a finish that suits your hair type: smooth, bouncy, or somewhere in between. We use as little product as we can, and we'll name everything we used if you ask."
            },

            {
                id: "single-color",
                name: "Single-Process Color",
                duration: 90,
                price: 95,
                brief: "Full color, formulated to protect condition, not just deposit pigment.",
                details: "We start with a consultation, and a patch or strand test where it's needed. The color is mixed for your hair's current condition, and we check in while it processes instead of leaving it on a timer. If your hair needs a break, we'll suggest waiting rather than pushing through."
            },

            {
                id: "balayage",
                name: "Balayage / Dimensional Color",
                duration: 150,
                price: 180,
                brief: "Hand-painted, low-maintenance color that grows out softly instead of leaving a hard line.",
                details: "Sections are painted by hand for a soft, natural transition, which means fewer root touch-ups. We'll talk honestly about how light you want to go and what your hair can safely handle in one session. Sometimes the healthiest route is to go there gradually, over two visits."
            },

            {
                id: "scalp-treatment",
                name: "Deep Conditioning Scalp Treatment",
                duration: 30,
                price: 40,
                brief: "Because healthy hair starts at the scalp, not the ends.",
                details: "A gentle scalp massage and a conditioning treatment chosen for your scalp and hair type, followed by a rinse and a light style. It works best as a regular habit rather than a one-off fix, and we'll tell you how often it's actually worth doing for you."
            }
        ]
    },


    skin: {
        label: "Skin",
        intro: "Every product we use has been patch-tested and reviewed by us before it ever touches a client. We focus on skin health over time, not a single dramatic before-and-after.",
        team: ["anika"],
        items: [
            {
                id: "express-facial",
                name: "Express Facial",
                duration: 30,
                price: 45,
                brief: "A quick reset: cleanse, exfoliate, hydrate. Good for maintenance between deeper treatments.",
                details: "A gentle cleanse, light exfoliation, a hydrating mask and moisturizer. No extractions and no strong actives, just a reset that fits into a lunch break. Suitable for most skin types. Please tell us about any sensitivities beforehand."
            },
            {
                id: "signature-facial",
                name: "Signature Facial",
                duration: 60,
                price: 85,
                brief: "Our full facial: assessed, cleansed and treated for what your skin needs that day.",
                details: "We begin by looking at your skin and asking how it's been feeling. The treatment (cleanse, exfoliation, massage, mask and hydration) is then adjusted to match. We explain each product as we use it, so you can ask about anything afterwards."
            },
            {
                id: "deep-cleanse-facial",
                name: "Deep-Cleanse & Hydration Facial",
                duration: 75,
                price: 110,
                brief: "A longer, more thorough reset, with no rushed extractions and no shortcuts.",
                details: "A thorough double cleanse, gentle extractions only if your skin is ready for them, and a rich hydrating mask. We stop if your skin tells us it's had enough. Because skin improves over time, we'll usually suggest a gentle follow-up plan instead of promising change in a single visit."
            }
        ]
    },


    massage: {
        label: "Massage",
        intro: "Every therapist checks in with you before and during your session. Pressure, focus areas and pace are yours to direct.",
        team: ["leila"],
        items: [
            {
                id: "head-neck-shoulder",
                name: "Head, Neck & Shoulder Release",
                duration: 25,
                price: 40,
                brief: "Where most tension actually lives, especially after a long week at a desk.",
                details: "Seated or lying down, and you can stay clothed. We work on the scalp, neck, shoulders and upper back with steady, medium pressure. It's a short, focused session, and we'll ask about pressure at the start and check in throughout."
            },

            {
                id: "swedish",
                name: "Swedish Relaxation Massage",
                duration: 60,
                price: 90,
                brief: "Slow, full-body, meant to calm the nervous system, not just the muscles.",
                details: "Long, flowing strokes with light to medium pressure, using a light massage oil. Fragrance-free is available on request. You're draped throughout and only the area being worked on is uncovered. Tell us if you'd rather skip an area."
            },

            {
                id: "deep-tissue",
                name: "Deep Tissue Massage",
                duration: 60,
                price: 100,
                brief: "Focused pressure on chronic tension: communicated, not guessed at.",
                details: "Slower, firmer work on areas that hold long-term tension. Deep doesn't have to mean painful. Pressure is yours to direct throughout, and we'd rather go slower than push through. It's normal to feel a little tender the next day, and we'll explain what to expect."
            },

            {
                id: "deep-tissue-extended",
                name: "Deep Tissue Massage (Extended)",
                duration: 90,
                price: 140,
                brief: "More time, for more than one problem area.",
                details: "The same approach as our 60-minute session, with room to work on two or three areas properly instead of rushing between them. Best if you're carrying tension in more than one place, or if it's been a while since your last massage."
            }
        ]
    },



    nails: {
        label: "Nails",
        intro: "Tools are sterilized between every single client. No exceptions, no shortcuts.",
        team: ["tara"],
        items: [
            {
                id: "manicure",
                name: "Manicure",
                duration: 40,
                price: 35,
                brief: "Shape, cuticle care, polish.",
                details: "We shape and tidy your nails, soften and push back cuticles (trimming only where needed), and finish with the polish of your choice. If your nails need a break from polish, we'll tell you."
            },

            {
                id: "pedicure",
                name: "Pedicure",
                duration: 50,
                price: 45,
                brief: "The same care, just for your feet.",
                details: "A warm soak, gentle exfoliation, nail shaping, cuticle care and a short foot massage, finished with polish. We don't use blades on your skin. If something looks like it needs a doctor rather than a pedicure, we'll say so."
            },

            {
                id: "gel-finish",
                name: "Gel / No-chip Finish (add-on)",
                duration: 15,
                price: 15,
                addon: true,
                brief: "Longer-lasting polish, added to any manicure or pedicure.",
                details: "A gel polish cured under an LED lamp, lasting around two weeks. We remove it gently, without scraping the nail. Like any gel, it's worth giving your nails a break between rounds, and we'll tell you if we think yours need one."
            },

            {
                id: "mani-pedi",
                name: "Manicure + Pedicure Combo",
                duration: 85,
                price: 70,
                brief: "Both, back to back.",
                details: "A full manicure and pedicure in one visit, at a small saving compared with booking them separately."
            }
        ]
    }

};


//Bundles

const bundles = [
    {
        id: "bloom-day",
        name: "Bloom Day",
        featured: true,
        includes: ["deep-tissue", "deep-cleanse-facial", 'manicure', "pedicure"],
        price: 250,
        brief: "Our longest, slowest visit: massage, facial, manicure and pedicure in one unhurried afternoon."
    },

    {
        id: "full-unwind",
        name: "Full Unwind",
        featured: false,
        includes: ["swedish", "signature-facial"],
        price: 155,
        brief: "A slow massage, then a facial. Two hours that are just yours."
    },

    {
        id: "the-reset",
        name: "The Reset",
        featured: false,
        includes: ["head-neck-shoulder", "express-facial"],
        price: 75,
        brief: "Under an hour, for when you just need to come back to yourself."
    },

    {
        id: "quiet-hour",
        name: "Quiet Hour",
        featured: false,
        includes: ["express-facial", "manicure"],
        price: 70,
        brief: "A facial and a manicure, with nobody rushing you."
    },

    {
        id: "the-refresh",
        name: "The Refresh",
        featured: false,
        includes: ["blowout", "manicure"],
        price: 60,
        brief: "Hair and nails, ready for whatever's next."
    }
];


//FAQs

const faqs = [
    {
        question: "Do you accept walk-ins?",
        answer: "No, we're appointment-only. This lets us give every client our full attention rather than juggling a queue. Booking usually takes less than a minute."
    },

    {
        question: "What are your opening hours?",
        answer: "We're open Tuesday to Friday, 10am to 7pm, and Saturday, 9am to 5pm. We're closed on Sundays and Mondays. Longer visits like Bloom Day need an earlier start, so the booking form only shows times that fit."
    },

    {
        question: "What happens if I have allergies or sensitivities?",
        answer: "Tell us when you book, and again when you arrive. Every product we use is patch-tested, and we're always glad to swap something out."
    },

    {
        question: "How early should I arrive?",
        answer: "A few minutes early gives you time to settle in. Arriving late may mean a shorter session, since we don't want to run into the next client's time."
    },

    {
        question: "Do you push products or upsell at checkout?",
        answer: "No. If you ask what we used, we'll tell you honestly. That's the whole conversation."
    },

    {
        question: "What payment methods do you accept?",
        answer: "Card or cash, paid at the end of your visit. We don't take payment through the website — booking simply reserves your appointment."
    },

    {
        question: "What's your policy on refunds and cancellations?",
        answer: "Cancel or reschedule more than 24 hours ahead and there's no charge. Inside 24 hours, or for a no-show, we ask for half the service price to cover the time we held for you. If a bundle goes unused, let us know within 30 days and we'll refund the difference."
    }
];



//Opening Hours
const openingHours = {
    0: null,
    1: null,
    2: {open: "10:00", close: "19:00"},
    3: {open: "10:00", close: "19:00"},
    4: {open: "10:00", close: "19:00"},
    5: {open: "10:00", close: "19:00"},
    6: {open: "09:00", close: "17:00"}
};





//for looking up one service by its id, whichever category it is in

function findService(id) {
    for (const key in services) {
        for (const item of services[key].items) {
            if (item.id === id) return item;
        }
    }

    return null;
}


//total duration for a bundle

function bundleDuration(bundle) {
    let total = 0;
    for (const id of bundle.includes) {
        total += findService(id).duration;
    }

    return total;
}

//what the same services would cost if booked separately

function bundleFullPrice(bundle) {
    let total = 0;
    for (const id of bundle.includes) {
        total += findService(id).price;
    }

    return total;
}



//bundle saves

function bundleSavings(bundle) {
    return bundleFullPrice(bundle) - bundle.price;
}


//to format the timings

function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return m + " min";
    if (m === 0) return h + " hr";

    return h + " hr " + m + " min";
}