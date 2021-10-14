const url = "http://localhost:3000/notes";
const container = document.getElementById("container")

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

// takes a .json object and creates a list item with id as the json title
// uses renderNoteText and then adds li to ul
function renderNoteCard(noteObj) {
    const li = document.createElement('li');
    li.id = noteObj.title
    renderNoteText(li, noteObj)
    container.appendChild(li);
}

// adds .json object's body to innerText of list item
function renderNoteText(li, noteObj) {
    li.innerText = `${noteObj.body}`
}


listNotes()