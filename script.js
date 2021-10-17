const url = "http://localhost:3000/notes";
const noteDiv = document.getElementById("note-div")
const form = document.getElementById("note-form")


// calls listNotes function and displays stored notes
listNotes()

// When the save note button is clicked, a note is created and saved to db.json
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const noteText = document.getElementById('note-text').value
    if (noteText === "") {
        form.reset()
    } else {
        createNote(noteText)
        form.reset()
    }
})

// when pen or trashcan isons are clicked, note is updated or deleted, respectively
noteDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        deleteNote(e.target)
    } else if (e.target.classList.contains('edit')) {
        const noteText = document.getElementById('note-text').value
        if (noteText === "") {
            form.reset()
        } else {
            updateNote(e.target)
            form.reset()
        }
    }
})

// changes pointer style and icon font color when mouse passes over edit icon 
// and changes pointer style when mouse passes over note body; reverts after 
noteDiv.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains('edit')) {
        e.target.style.color = '#dddddd'
        document.body.style.cursor = 'pointer';
    }
    if (e.target.classList.contains('message-body')) {
        document.body.style.cursor = 'auto';
    }
})

noteDiv.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains('edit')) {
        e.target.style.color = "#ffffff";
        document.body.style.cursor = "default";
    }
    if (e.target.classList.contains('message-body')) {
        document.body.style.cursor = 'default';
    }
})


// makes icon color darker when clicked down, reverts back after click is released
noteDiv.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains('edit')) {
        e.target.style.color = "#bbbbbb";
    }
})

noteDiv.addEventListener("mouseup", (e) => {
    if (e.target.classList.contains('edit')) {
        e.target.style.color = "#dddddd";
    }
})



// use fetch to get an array of .json objects
function listNotes() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            for (let item of data) {
                renderNoteCard(item);
            }
        })
}

// takes a .json object and creates a list item with id the same as the json
// uses renderNoteText and then adds li to ul
function renderNoteCard(noteObj) {
    const noteCard = document.createElement('article');
    noteCard.id = noteObj.id
    noteCard.classList.add(
        'message',
        'is-link',
        "block"
    )
    renderNoteText(noteCard, noteObj)
    noteDiv.appendChild(noteCard);
}

// adds .json object's body to innerText of body section of article node, and create time to innerText of header section
// checks if article node already contains children, and removes them if so
function renderNoteText(noteCard, noteObj) {
    if (noteCard.hasChildNodes()) {
        while (noteCard.hasChildNodes()) {
            noteCard.firstChild.remove()
        }
    }
    const header = document.createElement('div');
    header.classList.add("message-header", "is-size-6");
    header.innerHTML = `
        ${noteObj.created_at ? moment(noteObj.created_at).format('h:mm a  MM/D/YYYY') : ""} <div><div class="icon"><i class="fas fa-edit edit"></i></div> <button class="delete is-medium"></button></div>
    `
    const body = document.createElement('div');
    body.classList.add("message-body");
    body.innerText = noteObj.body;

    noteCard.appendChild(header)
    noteCard.appendChild(body)
}

// adds inputed text to json as an element with an id and timestamp, then rerenders all the saved notes
function createNote(noteText) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            created_at: moment().format()
        })
    })
    .then(res => res.json())
    .then(data => renderNoteCard(data))
}

// deletes the parent element of the parameter from db.json
function deleteNote(noteEl) {
    const buttonDiv = noteEl.parentElement;
    const header = buttonDiv.parentElement;
    fetch(url + '/' + `${header.parentElement.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(() => header.parentElement.remove())
}

// updates indicated note and saves that to db.json, then rerenders notes
function updateNote(noteEl) {
    const noteText = document.getElementById("note-text").value
    const iconDiv = noteEl.parentElement;
    const buttonDiv = iconDiv.parentElement;
    const header = buttonDiv.parentElement
    fetch(url + '/' + `${header.parentElement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            created_at: moment().format()
        })
    })
    .then(res => res.json())
    .then(data => {
        renderNoteText(header.parentElement, data)
    })
}