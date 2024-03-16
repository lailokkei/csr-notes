import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

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

    idx(id: number): number {
        for (let i = 0; i < this.ids.length; i++) {
            if (id === this.ids[i]) {
                return i;
            }
        }
        return -1;
    }

    remove(id: number) {
        const idx = this.idx(id);
        this.ids.splice(idx, 1);
        this.titles.splice(idx, 1);
        this.contents.splice(idx, 1);
    }
}

function render_note_page(notes: Notes, id: number) {
    const idx = notes.idx(id);
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
        render_list(notes);
    });
}

function render_list(notes: Notes) {
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
            render_note_page(notes, id);
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

function main() {
    const notes = new Notes();
    render_list(notes);
}

const router = async () => {
    const routes = [
        { path: "/", view: () => console.log("dash") },
        { path: "/posts", view: () => console.log("posts") },
        { path: "/settings", view: () => console.log("setting") },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname === route.path,
        };
    });

    let match = potentialMatches.find(
        (potentialMatches) => potentialMatches.isMatch,
    );

    if (!match) {
        return;
    }

    console.log(match.route.view());
    console.log(potentialMatches);
};
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        history.pushState(null, "what", "settings");
        router();
    });
    router();
});

// main();
