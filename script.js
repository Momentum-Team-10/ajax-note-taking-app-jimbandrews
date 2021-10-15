const url = "http://localhost:3000/notes";
const noteList = document.getElementById("note-list")
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
noteList.addEventListener('click', (e) => {
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
    const li = document.createElement('li');
    li.id = noteObj.id
    // li.classList.add(
    //     'message',
    //     'is-info'
    // )
    renderNoteText(li, noteObj)
    noteList.appendChild(li);
}

// adds .json object's body to innerText of list item
function renderNoteText(li, noteObj) {
    li.innerHTML = `
        <span>${noteObj.body}</span> (${noteObj.created_at ? moment(noteObj.created_at).format('MMM D, YYYY') : ""}) <i class="fas fa-pencil-alt edit"></i> <i class="far fa-trash-alt delete"></i>
    `
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
    fetch(url + '/' + `${noteEl.parentElement.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(() => noteEl.parentElement.remove())
}

// updates indicated note and saves that to db.json, then rerenders notes
function updateNote(noteEl) {
    const noteText = document.getElementById("note-text").value
    fetch(url + '/' + `${noteEl.parentElement.id}`, {
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
        renderNoteText(noteEl.parentElement, data)
    })
}