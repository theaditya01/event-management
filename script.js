let events = JSON.parse(localStorage.getItem("events")) || [];

let editId = null;

function editEvent(id) {
    let event = events.find(e => e.id === id);

    document.getElementById("eventName").value = event.name;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventLocation").value = event.location;

    editId = id;
    openModal();
}

function addEvent() {
    showLoader();
    let name = document.getElementById("eventName").value;
    let date = document.getElementById("eventDate").value;
    let location = document.getElementById("eventLocation").value;
    let category = document.getElementById("eventCategory").value;
    if (name.length < 3) {
    showToast("Event name too short");
    return;
}

    if (name === "" || date === "" || location === "" || category === "") {
        showToast("Please fill all fields");
        return;
    }

    if (editId) {
    events = events.map(e => e.id === editId ? { ...e, name, date, location } : e);
    editId = null;
} else {
    events.push({ id: Date.now(), name, date, location, category });
}

    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    displayEvents();
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventCategory").value = "";
    closeModal();
    showToast("Event added successfully");
}

function displayEvents() {
    let list = document.getElementById("eventList");
    list.innerHTML = "";

    list.innerHTML = `
  <div style="text-align:center; color:white;">
    <h2>No events yet 😕</h2>
    <p>Add your first event!</p>
  </div>
`;
    if (events.length === 0) {
    list.innerHTML = "<h3 style='color:white;'>No events found 🚫</h3>";
    return;
}
    if (events.length === 0) {
    list.innerHTML = "<p style='color:white;'>No events yet</p>";
    return;
}

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    events.forEach(event => {
        let today = new Date();
        let eventDate = new Date(event.date);

        let status = eventDate >= today ? "Upcoming" : "Completed";
        let color = eventDate >= today ? "green" : "red";
        let tagClass =
        event.category === "Technical" ? "tech" :
        event.category === "Cultural" ? "cultural" : "sports";
       
        let diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
       list.innerHTML += `

    <div class="event-card">
        <h3>${event.name}</h3>
        <p>📅 ${event.date}</p>
        <p>📍 ${event.location}</p>
        <p>🏷 ${event.category}</p>
        <p style="color:${color}; font-weight:bold;">${status}</p>
        <p>⏳ ${diff} days left</p>

        <div class="event-actions">
            <button onclick="editEvent(${event.id})">Edit</button>
            <button onclick="deleteEvent(${event.id})">Delete</button>
        </div>
    </div>
`;
});

let total = events.length;
let upcoming = 0;
let completed = 0;

events.forEach(e => {
    let today = new Date();
    let d = new Date(e.date);
    if (d >= today) upcoming++;
    else completed++;
});

document.getElementById("totalCount").innerText = total;
document.getElementById("upcomingCount").innerText = upcoming;
document.getElementById("completedCount").innerText = completed;

}


function deleteEvent(id) {
    showLoader();
    if (confirm("Are you sure you want to delete?")) {
        events = events.filter(e => e.id !== id);
        localStorage.setItem("events", JSON.stringify(events));
        displayEvents();
    }
}

function editEvent(id) {
    let event = events.find(e => e.id === id);

    document.getElementById("eventName").value = event.name;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventLocation").value = event.location;

    // Remove old event
    events = events.filter(e => e.id !== id);
    localStorage.setItem("events", JSON.stringify(events));}

displayEvents();

function searchEvent() {
    let searchValue = document.getElementById("search").value.toLowerCase();

    let filtered = events.filter(e =>
        e.name.toLowerCase().includes(searchValue)
    );

    displayFilteredEvents(filtered);
}

function displayFilteredEvents(filteredEvents) {
    let list = document.getElementById("eventList");
    list.innerHTML = "";

    filteredEvents.forEach(event => {
        list.innerHTML += `
            <div class="event-card">
                <h3>${event.name}</h3>
                <p>${event.date}</p>
                <p>${event.location}</p>
                <button onclick="editEvent(${event.id})">Edit</button>
                <button onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `;
    });
}
function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

function showToast(msg) {
    let t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";

    setTimeout(() => {
        t.style.display = "none";
    }, 2000);
}

function applyFilters() {
    let status = document.getElementById("filterStatus").value;
    let category = document.getElementById("filterCategory").value;

    let filtered = events.filter(e => {
        let today = new Date();
        let isUpcoming = new Date(e.date) >= today;

        let statusMatch =
            status === "all" ||
            (status === "upcoming" && isUpcoming) ||
            (status === "completed" && !isUpcoming);

        let categoryMatch =
            category === "all" || e.category === category;

        return statusMatch && categoryMatch;
    });

    displayFilteredEvents(filtered);
}

function sortEvents(type) {
    if (type === "newest") {
        events.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    displayEvents();
}

function showLoader() {
    document.getElementById("loader").style.display = "block";
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 500);
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
};
document.getElementById("eventName").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addEvent();
});
