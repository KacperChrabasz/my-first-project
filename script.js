// 1. Greeting that depends on the time of day
const greeting = document.getElementById("greeting");

if (greeting) {
    const hour = new Date().getHours();
    let timeOfDay = "evening";

    if (hour < 12) {
        timeOfDay = "morning";
    } else if (hour < 18) {
        timeOfDay = "afternoon";
    }

    greeting.textContent = `Good ${timeOfDay}, and welcome to my Minecraft page!`;
}


// 2. Reading progress bar
const progressBar = document.createElement("div");
progressBar.id = "progress-bar";
document.body.appendChild(progressBar);

function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = percent + "%";
}


// 3. Back to top button
const topButton = document.createElement("button");
topButton.id = "top-button";
topButton.textContent = "Top";
topButton.setAttribute("aria-label", "Back to top");
document.body.appendChild(topButton);

topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", function () {
    updateProgress();
    topButton.classList.toggle("visible", window.scrollY > 400);
});

updateProgress();


// 4. Mob filter
const mobsHeading = document.getElementById("mobs");
const mobTable = document.querySelector("#mobs ~ table");

if (mobsHeading && mobTable) {
    const filters = ["All", "Hostile", "Neutral", "Passive"];
    const filterBar = document.createElement("p");

    filters.forEach(function (name) {
        const btn = document.createElement("button");
        btn.className = "button filter-button";
        btn.textContent = name;

        if (name === "All") {
            btn.classList.add("active");
        }

        btn.addEventListener("click", function () {
            filterBar.querySelectorAll(".filter-button").forEach(function (b) {
                b.classList.remove("active");
            });
            btn.classList.add("active");

            const rows = mobTable.querySelectorAll("tr");
            for (let i = 1; i < rows.length; i++) {
                const type = rows[i].cells[1].textContent.trim();
                rows[i].hidden = name !== "All" && type !== name;
            }
        });

        filterBar.appendChild(btn);
    });

    mobTable.before(filterBar);
}


// 5. Beginner tips checklist
const tipsList = document.querySelector("#tips ~ ol");

if (tipsList) {
    const steps = tipsList.querySelectorAll("li");
    const counter = document.createElement("p");
    counter.id = "tips-counter";
    tipsList.before(counter);

    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem("doneTips")) || [];
    } catch (error) {
        saved = [];
    }

    function updateCounter() {
        const done = tipsList.querySelectorAll("li.done").length;

        if (done === steps.length) {
            counter.textContent = "All done. You survived your first day!";
        } else {
            counter.textContent = `Click a step to tick it off: ${done} of ${steps.length} done`;
        }

        const doneIndexes = [];
        steps.forEach(function (li, index) {
            if (li.classList.contains("done")) {
                doneIndexes.push(index);
            }
        });
        localStorage.setItem("doneTips", JSON.stringify(doneIndexes));
    }

    steps.forEach(function (li, index) {
        li.classList.toggle("done", saved.includes(index));

        li.addEventListener("click", function () {
            li.classList.toggle("done");
            updateCounter();
        });
    });

    updateCounter();
}


// 6. Random fun fact button
const factsHeading = document.getElementById("facts");
const factItems = document.querySelectorAll("#facts ~ ul li");

if (factsHeading && factItems.length > 0) {
    const factButton = document.createElement("button");
    factButton.className = "button";
    factButton.textContent = "Show a random fact";

    const factBox = document.createElement("p");
    factBox.id = "fact-box";

    factButton.addEventListener("click", function () {
        const randomIndex = Math.floor(Math.random() * factItems.length);
        factBox.textContent = factItems[randomIndex].textContent;
    });

    factsHeading.after(factButton, factBox);
}
