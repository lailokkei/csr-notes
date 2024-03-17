import * as router from "./router";
import "./style.css";

class Notes {
    serial = 0;
    ids: number[] = [];
    titles: string[] = [];
    contents: string[] = [];

    add(): number {
        this.ids.push(this.serial);
        this.serial++;

        this.titles.push(`untitled (${this.serial})`);
        this.contents.push("no content");
        return this.ids.length - 1;
    }

    idx(id: number): number | undefined {
        for (let i = 0; i < this.ids.length; i++) {
            if (id === this.ids[i]) {
                return i;
            }
        }
        return undefined;
    }

    remove(id: number) {
        const idx = this.idx(id)!;
        this.ids.splice(idx, 1);
        this.titles.splice(idx, 1);
        this.contents.splice(idx, 1);
    }
}

function render_note(c: router.Context, notes: Notes, id: number) {
    const idx = notes.idx(id);
    if (idx === undefined) {
        render_404();
        return;
    }

    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div id="kys">d</div>
    <button id="exit">exit</button>
    <textarea id="title">${notes.titles[idx]}</textarea>
    <textarea id="content">${notes.contents[idx]}</textarea>
    `;

    const title = document.querySelector<HTMLTextAreaElement>("#title")!;
    title.addEventListener("input", () => {
        notes.titles[idx] = title.value;
        console.log(notes.titles[idx]);
    });
    const content = document.querySelector<HTMLTextAreaElement>("#content")!;
    content.addEventListener("input", () => {
        notes.contents[idx] = content.value;
        console.log(notes.contents[idx]);
    });

    const exit = document.querySelector("#exit");

    exit?.addEventListener("click", () => {
        c.navigate("/");
    });
}

function render_list(c: router.Context, notes: Notes) {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div>
        <button id="add-note">Add Note</button>
        <div id="notes-list"></div>
        </div>
    `;

    const notesList = document.querySelector<HTMLDivElement>("#notes-list")!;

    const appendNoteEl = (idx: number) => {
        const id = notes.ids[idx];
        const divId = `note-${id}`;

        const template = document.createElement("template");
        template.innerHTML = `
            <div id=${divId}>
                <h1>${notes.titles[idx]}</h1>
                <p>${notes.contents[idx]}</p>
            </div>
        `;
        notesList.append(template.content.children![0]);

        const noteEl = document.querySelector(`#${divId}`);
        noteEl?.addEventListener("click", () => {
            c.navigate(`/notes/${id}`);
        });
    };

    for (let i = 0; i < notes.ids.length; i++) {
        appendNoteEl(i);
    }

    const addNote = document.querySelector<HTMLDivElement>("#add-note")!;
    addNote.addEventListener("click", () => {
        const idx = notes.add();
        appendNoteEl(idx);
    });
}

function render_404() {
    console.log("404");
}

function main() {
    const notes = new Notes();

    const r = router.newRouter();
    r.add("/", (c: router.Context) => {
        render_list(c, notes);
    });
    r.add("/notes/:id", (c: router.Context) => {
        const id = c.param("id")!;
        render_note(c, notes, Number(id));
    });
    r.start();
}

main();
