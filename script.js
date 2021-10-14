const url = "http://localhost:3000/notes";
const container = document.getElementById("container")

function listNotes() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            for (let item of data) {
                renderNoteItem(item);
            }
        })
}

function renderNoteCard(noteObj) {
    const li = document.createElement('li');
    li.id = noteObj.title
    renderNoteText(li, noteObj)
    container.appendChild(li);
}

function renderNoteText(li, noteObj) {
    li.innerText = `${noteObj.body}`
}


listNotes()