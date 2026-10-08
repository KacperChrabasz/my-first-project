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
