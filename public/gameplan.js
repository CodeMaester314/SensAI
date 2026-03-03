const container = document.getElementById("gameplan");
const output = document.getElementById("output");
const badge = document.getElementById("modeBadge");

if (!output) {
    console.error("Missing #output element in HTML");
}

const userData = JSON.parse(localStorage.getItem("mmaInput"));

if (!userData) {
    container.innerHTML =
        "<p class='text-gray-400'>No input data found. Please go back and fill in your stats.</p>";
} else {
    generateGameplan(userData);
}

async function generateGameplan(dataToSend) {

    output.innerHTML = `
        <div class="animate-pulse text-gray-400">
            Generating tactical breakdown...
        </div>
    `;

    badge?.classList.add("hidden");

    try {
        const res = await fetch("/generate-gameplan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        console.log("SERVER RESPONSE:", data);

        output.innerText = data.gameplan || "No gameplan returned.";

        if (data.mode === "demo") {
            badge?.classList.remove("hidden");
            output.classList.add("opacity-80");
        } else {
            output.classList.remove("opacity-80");
        }

    } catch (err) {
        console.error(err);
        output.innerText =
            "Unable to reach server. Is the backend running?";
    }
}