document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Dark Mode: Load Preference on Startup
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = 'Toggle Light Mode';
    }

    // Dark Mode: Toggle Functionality
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                darkModeToggle.textContent = 'Toggle Light Mode';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                darkModeToggle.textContent = 'Toggle Dark Mode';
            }
        });
    }

    const categoryListIds = {
        'Shopping List': 'notes-shopping-list',
        'Tasks': 'notes-tasks',
        'Ideas': 'notes-ideas',
        'Quotes': 'notes-quotes',
        'General Notes': 'notes-general-notes'
    };

    function displayNotes(notes) {
        // Clear all existing notes from the category lists
        for (const listId of Object.values(categoryListIds)) {
            const ulElement = document.getElementById(listId);
            if (ulElement) {
                ulElement.innerHTML = '';
            }
        }

        // Iterate through the notes and display them
        notes.forEach(note => {
            const listId = categoryListIds[note.category];
            if (listId) {
                const ulElement = document.getElementById(listId);
                if (ulElement) {
                    const liElement = document.createElement('li');
                    liElement.dataset.id = note.id; // Set dataset.id

                    // Create a span for the text to make it easier to target
                    const textSpan = document.createElement('span');
                    textSpan.textContent = note.text;
                    textSpan.classList.add('note-text'); // For easier selection
                    if (note.trigger) {
                        textSpan.title = `Reason: ${note.trigger}`;
                    }
                    liElement.appendChild(textSpan);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.classList.add('delete-btn'); // For styling
                    deleteBtn.onclick = () => deleteNote(note.id);
                    liElement.appendChild(deleteBtn);

                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Edit';
                    editBtn.classList.add('edit-btn'); // For styling
                    editBtn.onclick = () => startEditNote(note.id, liElement); // Pass the <li> element
                    liElement.appendChild(editBtn);

                    ulElement.appendChild(liElement);
                } else {
                    console.warn(`Could not find list element for ID: ${listId}`);
                }
            } else {
                console.warn(`Unknown category: ${note.category} for note ID: ${note.id}`);
            }
        });
    }

    async function fetchAndDisplayNotes() {
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notes = await response.json();
            displayNotes(notes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    }

    async function addNote() {
        const noteText = noteInput.value.trim();

        if (!noteText) {
            // alert("Note text cannot be empty."); // Simple alert, or could be a more sophisticated UI element
            return;
        }

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: noteText })
            });

            if (response.ok) {
                noteInput.value = ''; // Clear the input field
                await fetchAndDisplayNotes(); // Refresh the displayed notes
            } else {
                const errorData = await response.json();
                console.error("Error adding note:", response.status, errorData);
                // alert(`Error adding note: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error("Error adding note:", error);
            // alert("A network error occurred while adding the note.");
        }
    }

    // Initial load of notes
    fetchAndDisplayNotes();

    // Event listener for the add note button
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', addNote);
    } else {
        console.error("Add note button not found!");
    }
});

async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        const response = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
        if (response.ok) {
            fetchAndDisplayNotes();
        } else {
            const errorData = await response.json();
            console.error("Error deleting note:", response.status, errorData);
            // alert(`Error deleting note: ${errorData.error || response.statusText}`);
        }
    } catch (error) {
        console.error("Network error deleting note:", error);
        // alert("A network error occurred while deleting the note.");
    }
}

function startEditNote(noteId, liElement) {
    // const currentText = liElement.childNodes[0].textContent; // Assuming text is the first child
    const textSpan = liElement.querySelector('.note-text');
    if (!textSpan) {
        console.error("Could not find text span in note item for editing.");
        fetchAndDisplayNotes(); // Re-render to fix potential UI inconsistency
        return;
    }
    const currentText = textSpan.textContent;
    
    liElement.innerHTML = ''; // Clear the li content

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;
    liElement.appendChild(inputField);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-btn');
    saveBtn.onclick = () => saveEditedNote(noteId, inputField.value);
    liElement.appendChild(saveBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.classList.add('cancel-btn');
    cancelBtn.onclick = () => fetchAndDisplayNotes(); // Simple way to cancel: just re-render
    liElement.appendChild(cancelBtn);

    inputField.focus();
}

async function saveEditedNote(noteId, newText) {
    if (!newText.trim()) {
        alert("Note text cannot be empty.");
        return;
    }

    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: newText })
        });

        if (response.ok) {
            fetchAndDisplayNotes();
        } else {
            const errorData = await response.json();
            console.error("Error saving note:", response.status, errorData);
            // alert(`Error saving note: ${errorData.error || response.statusText}`);
        }
    } catch (error) {
        console.error("Network error saving note:", error);
        // alert("A network error occurred while saving the note.");
    }
}
