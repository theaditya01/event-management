let events = JSON.parse(localStorage.getItem("events")) || [];

function addEvent() {
    let name = document.getElementById("eventName").value;
    let date = document.getElementById("eventDate").value;
    let location = document.getElementById("eventLocation").value;

    if (name === "" || date === "" || location === "") {
        alert("Please fill all fields");
        return;
    }

    let event = {
        id: Date.now(),
        name,
        date,
        location
    };

    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    displayEvents();
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventLocation").value = "";
    closeModal();
}

function displayEvents() {
    let list = document.getElementById("eventList");
    list.innerHTML = "";
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
       
        let diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
       list.innerHTML += `

    <div class="event-card">
        <h3>${event.name}</h3>
        <p>📅 ${event.date}</p>
        <p>📍 ${event.location}</p>
        <p style="color:${color}; font-weight:bold;">${status}</p>
        <p>⏳ ${diff} days left</p>

        <div class="event-actions">
            <button onclick="editEvent(${event.id})">Edit</button>
            <button onclick="deleteEvent(${event.id})">Delete</button>
        </div>
    </div>
`;
});
}


function deleteEvent(id) {
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