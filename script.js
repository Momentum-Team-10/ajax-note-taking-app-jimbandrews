const url = "http://localhost:3000/notes";
const container = document.getElementById("container")
const form = document.getElementById("note-form")

// calls listNotes function and displays stored notes
listNotes()

// When the save note button is clicked, 
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
    renderNoteText(li, noteObj)
    container.appendChild(li);
}

// adds .json object's body to innerText of list item
function renderNoteText(li, noteObj) {
    li.innerText = `${noteObj.body}`
}


function createNote(noteText) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            created_at: moment().format()
        })
    })
    .then(res => res.json())
    .then(data => renderNoteCard(data))
}


