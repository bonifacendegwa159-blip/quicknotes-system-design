const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

let notes = [];

// Display status messages and their styles.
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// Reusable function for sending HTTP requests.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    // Some successful responses, such as HTTP 204, have no body.
    if (response.status === 204) {
        return {
            status: response.status,
            data: null
        };
    }

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

// Display a message inside the notes list.
function showEmptyState(message) {
    notesList.replaceChildren();

    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = message;

    notesList.appendChild(item);
}

// Display a single note.
function renderNote(note) {
    const item = document.createElement("li");
    item.className = "note-item";

    const title = document.createElement("h3");
    title.textContent = note.title || "Untitled note";

    const body = document.createElement("p");
    body.textContent = note.body || "No note body provided.";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        deleteNote(note.id, item, deleteButton);
    });

    item.append(title, body, deleteButton);

    return item;
}

// Render all notes currently held in memory.
function renderNotes() {
    notesList.replaceChildren();

    if (notes.length === 0) {
        showEmptyState("No notes found. Create your first note!");
        return;
    }

    notes.forEach((note) => {
        notesList.appendChild(renderNote(note));
    });
}

// Load 10 notes from the practice API.
async function loadNotes() {
    loadButton.disabled = true;

    showStatus("Loading notes...");

    try {
        const result = await request(`${API_URL}?_limit=10`);

        notes = result.data;

        renderNotes();

        if (notes.length === 0) {
            showStatus("No notes were found.", "success");
        } else {
            showStatus(
                `Loaded ${notes.length} notes from the server.`,
                "success"
            );
        }
    } catch (error) {
        showStatus(
            "Unable to load notes. Please check your connection and try again.",
            "error"
        );
    } finally {
        loadButton.disabled = false;
    }
}

// Connect the button to the GET request.
loadButton.addEventListener("click", loadNotes);