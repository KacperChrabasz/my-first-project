// script.js - used by index.html and about.html
// Every feature is inside its own try/catch, so if one breaks, the others still work.


// 1. Greeting that depends on the time of day
try {
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
} catch (error) {
    console.error("Greeting error:", error);
}


// 2. Reading progress bar and "Back to top" button
try {
    const progressBar = document.createElement("div");
    progressBar.id = "progress-bar";
    document.body.appendChild(progressBar);

    const topButton = document.createElement("button");
    topButton.id = "top-button";
    topButton.textContent = "Top";
    topButton.setAttribute("aria-label", "Back to top");
    document.body.appendChild(topButton);

    function updateProgress() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.width = percent + "%";
    }

    topButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", function () {
        updateProgress();
        topButton.classList.toggle("visible", window.scrollY > 400);
    });

    updateProgress();
} catch (error) {
    console.error("Progress bar / Top button error:", error);
}


// 3. Mob filter: show only Hostile, Neutral or Passive mobs
try {
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
} catch (error) {
    console.error("Mob filter error:", error);
}


// 4. Beginner tips checklist: click a step to tick it off
try {
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

            try {
                localStorage.setItem("doneTips", JSON.stringify(doneIndexes));
            } catch (error) {
                // Ignore saving problems
            }
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
} catch (error) {
    console.error("Tips checklist error:", error);
}


// 5. Random fun fact button
try {
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
} catch (error) {
    console.error("Fun fact button error:", error);
}


// 6. Dark / light theme button (added to the nav bar)
try {
    const nav = document.querySelector("nav");

    if (nav) {
        const themeButton = document.createElement("button");
        themeButton.id = "theme-toggle";
        themeButton.className = "button";
        nav.appendChild(themeButton);

        function setTheme(theme) {
            document.body.classList.toggle("light", theme === "light");
            themeButton.textContent = theme === "light" ? "Dark mode" : "Light mode";

            try {
                localStorage.setItem("theme", theme);
            } catch (error) {
                // If saving fails, the theme still works until you close the page
            }
        }

        let savedTheme = "dark";
        try {
            savedTheme = localStorage.getItem("theme") || "dark";
        } catch (error) {
            savedTheme = "dark";
        }

        setTheme(savedTheme);

        themeButton.addEventListener("click", function () {
            const isLight = document.body.classList.contains("light");
            setTheme(isLight ? "dark" : "light");
        });
    }
} catch (error) {
    console.error("Theme button error:", error);
}


// 7. Search bar for the tables
try {
    const jumpLink = document.querySelector('a[href="#modes"]');
    const contentTables = document.querySelectorAll(".container table");

    if (jumpLink && contentTables.length > 0) {
        const searchWrap = document.createElement("div");

        const searchBox = document.createElement("input");
        searchBox.type = "search";
        searchBox.id = "search-box";
        searchBox.placeholder = "Search the tables (try creeper, diamond or nether)";
        searchBox.setAttribute("aria-label", "Search the tables");

        const searchResult = document.createElement("p");
        searchResult.id = "search-result";

        searchWrap.append(searchBox, searchResult);
        jumpLink.parentElement.after(searchWrap);

        searchBox.addEventListener("input", function () {
            const term = searchBox.value.trim().toLowerCase();
            let totalMatches = 0;

            contentTables.forEach(function (table) {
                let tableMatches = 0;

                table.querySelectorAll("tr").forEach(function (row) {
                    // Skip header rows
                    if (row.querySelector("th")) {
                        return;
                    }

                    const matches = term === "" || row.textContent.toLowerCase().includes(term);
                    row.classList.toggle("search-hidden", !matches);

                    if (matches) {
                        tableMatches++;
                    }
                });

                // Hide the whole table if nothing in it matches
                table.classList.toggle("search-hidden", term !== "" && tableMatches === 0);
                totalMatches += tableMatches;
            });

            if (term === "") {
                searchResult.textContent = "";
            } else if (totalMatches === 0) {
                searchResult.textContent = `Nothing found for "${term}".`;
            } else {
                searchResult.textContent = `Found ${totalMatches} matching row(s).`;
            }
        });
    }
} catch (error) {
    console.error("Search bar error:", error);
}


// 8. Minecraft quiz (added before the Fun facts section)
try {
    const quizQuestions = [
        {
            question: "Who created Minecraft?",
            options: ["Markus \"Notch\" Persson", "Bill Gates", "Shigeru Miyamoto", "Gabe Newell"],
            answer: 0
        },
        {
            question: "What do you need to build a Nether portal?",
            options: ["Diamond blocks", "Obsidian", "Netherite", "Gold blocks"],
            answer: 1
        },
        {
            question: "Which mob sneaks up on you and explodes?",
            options: ["Zombie", "Skeleton", "Creeper", "Enderman"],
            answer: 2
        },
        {
            question: "Which boss lives in The End?",
            options: ["The Wither", "The Warden", "The Elder Guardian", "The Ender Dragon"],
            answer: 3
        },
        {
            question: "In which year did Microsoft buy Mojang?",
            options: ["2011", "2012", "2014", "2016"],
            answer: 2
        },
        {
            question: "What is the strongest material in the game?",
            options: ["Diamond", "Netherite", "Iron", "Gold"],
            answer: 1
        },
        {
            question: "How long does one full day last in Minecraft?",
            options: ["10 minutes", "20 minutes", "30 minutes", "1 hour"],
            answer: 1
        },
        {
            question: "Which new biome was added in the Wilderness Bound game drop?",
            options: ["Dappled Forest", "Deep Dark", "Mushroom Fields", "Cherry Grove"],
            answer: 0
        }
    ];

    const quizSpot = document.getElementById("facts");

    if (quizSpot) {
        const quizHeading = document.createElement("h2");
        quizHeading.id = "quiz";
        quizHeading.textContent = "Minecraft quiz";

        const quizIntro = document.createElement("p");
        quizIntro.textContent = "Think you know Minecraft? Test yourself!";

        const quizBox = document.createElement("div");
        quizBox.className = "quiz-card";

        quizSpot.before(quizHeading, quizIntro, quizBox);

        // Add a "Quiz" link to the Jump to list
        const factsLink = document.querySelector('a[href="#facts"]');
        if (factsLink) {
            const quizLink = document.createElement("a");
            quizLink.href = "#quiz";
            quizLink.textContent = "Quiz";
            factsLink.before(quizLink, " | ");
        }

        let current = 0;
        let score = 0;

        function showQuestion() {
            quizBox.replaceChildren();
            const q = quizQuestions[current];

            const info = document.createElement("p");
            info.className = "quiz-info";
            info.textContent = `Question ${current + 1} of ${quizQuestions.length} | Score: ${score}`;

            const title = document.createElement("h3");
            title.textContent = q.question;

            quizBox.append(info, title);

            const nextButton = document.createElement("button");
            nextButton.className = "button";
            nextButton.hidden = true;
            nextButton.textContent = current === quizQuestions.length - 1 ? "See result" : "Next question";

            const optionButtons = [];

            q.options.forEach(function (text, index) {
                const btn = document.createElement("button");
                btn.className = "quiz-option";
                btn.textContent = text;

                btn.addEventListener("click", function () {
                    optionButtons.forEach(function (b) {
                        b.disabled = true;
                    });

                    if (index === q.answer) {
                        btn.classList.add("correct");
                        score = score + 1;
                    } else {
                        btn.classList.add("wrong");
                        optionButtons[q.answer].classList.add("correct");
                    }

                    info.textContent = `Question ${current + 1} of ${quizQuestions.length} | Score: ${score}`;
                    nextButton.hidden = false;
                });

                optionButtons.push(btn);
                quizBox.appendChild(btn);
            });

            nextButton.addEventListener("click", function () {
                current = current + 1;

                if (current < quizQuestions.length) {
                    showQuestion();
                } else {
                    showResult();
                }
            });

            quizBox.appendChild(nextButton);
        }

        function showResult() {
            quizBox.replaceChildren();

            // Save the best score
            let best = 0;
            try {
                best = Number(localStorage.getItem("quizBest")) || 0;
            } catch (error) {
                best = 0;
            }

            if (score > best) {
                best = score;
                try {
                    localStorage.setItem("quizBest", String(score));
                } catch (error) {
                    // Ignore saving problems
                }
            }

            let message = "Keep exploring and try again!";
            if (score === quizQuestions.length) {
                message = "Perfect score! You are a true Minecraft master.";
            } else if (score >= quizQuestions.length * 0.6) {
                message = "Nice job! You know your blocks.";
            }

            const title = document.createElement("h3");
            title.textContent = `You scored ${score} out of ${quizQuestions.length}`;

            const text = document.createElement("p");
            text.textContent = message;

            const bestText = document.createElement("p");
            bestText.className = "quiz-info";
            bestText.textContent = `Your best score: ${best} out of ${quizQuestions.length}`;

            const restartButton = document.createElement("button");
            restartButton.className = "button";
            restartButton.textContent = "Play again";
            restartButton.addEventListener("click", function () {
                current = 0;
                score = 0;
                showQuestion();
            });

            quizBox.append(title, text, bestText, restartButton);
        }

        showQuestion();
    }
} catch (error) {
    console.error("Quiz error:", error);
}