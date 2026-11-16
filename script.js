
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const countryCard = document.getElementById("countryCard");
const message = document.getElementById("message");

async function searchCountry() {
    const country = countryInput.value.trim();

    message.textContent = "";
    countryCard.hidden = true;

    if (!country) {
        message.textContent = "Please enter a country name!";
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        // Fetch country information without an API key
        const url = `https://countries.dev/name/${encodeURIComponent(country)}`;

        const response = await fetch(url);

        if (response.status === 404) {
            throw new Error("Country not found!");
        }

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Country not found!");
        }

        const countryData = data.find(
            item => item.name.toLowerCase() === country.toLowerCase()
        ) || data[0];

        // Display country flag
        const flag = document.getElementById("flag");
        flag.src = countryData.flags?.png || countryData.flag || "";
        flag.alt = `${countryData.name} flag`;

        // Display country details
        document.getElementById("countryName").textContent =
            countryData.name || "Not available";

        document.getElementById("capital").textContent =
            countryData.capital || "Not available";

        document.getElementById("population").textContent =
            countryData.population?.toLocaleString("en-IN") || "Not available";

        document.getElementById("region").textContent =
            countryData.region || "Not available";

        // Display currency
        const currencies = countryData.currencies || [];

        document.getElementById("currency").textContent =
            currencies.map(currency =>
                `${currency.name} (${currency.symbol || currency.code})`
            ).join(", ") || "Not available";

        countryCard.hidden = false;

    } catch (error) {
        console.error("Error:", error);

        message.textContent =
            error.message === "Country not found!"
                ? error.message
                : "Unable to fetch country information. Please try again.";
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}

// Search button click
searchBtn.addEventListener("click", searchCountry);

// Search using Enter key
countryInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchCountry();
    }
});
