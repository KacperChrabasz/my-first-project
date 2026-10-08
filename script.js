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
const progressBar = document.createElement("div");
progressBar.id = "progress-bar";
document.body.appendChild(progressBar);

function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = percent + "%";
}
