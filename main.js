let koreanAudioLinks = {};

fetch('koreanAudioLinks.json')
  .then(response => response.json())
  .then(data => {
    koreanAudioLinks = data;
    renderBibleTracker();  // <-- call your render/init function here
  })
  .catch(err => console.error("Failed to load koreanAudioLinks.json", err));

const bibleSections = {
  "Torah (Law)": {
    Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34
  },
  "History": {
    Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24,
    "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
    Ezra: 10, Nehemiah: 13, Esther: 10
  },
  "Wisdom": {
    Job: 42, Psalms: 150, Proverbs: 31, Ecclesiastes: 12, "Song of Solomon": 8
  },
  "Major Prophets": {
    Isaiah: 66, Jeremiah: 52, Lamentations: 5, Ezekiel: 48, Daniel: 12
  },
  "Minor Prophets": {
    Hosea: 14, Joel: 3, Amos: 9, Obadiah: 1, Jonah: 4, Micah: 7,
    Nahum: 3, Habakkuk: 3, Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4
  },
  "Gospels & Acts": {
    Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28
  },
  "Letters": {
    Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6,
    Ephesians: 6, Philippians: 4, Colossians: 4, "1 Thessalonians": 5,
    "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, Titus: 3,
    Philemon: 1, Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3,
    "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1
  },
  "Revelation": {
    Revelation: 22
  }
};


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bibleTracker");

  Object.entries(bibleSections).forEach(([sectionName, books]) => {
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "mb-6";

    const sectionHeader = document.createElement("h2");
    sectionHeader.className = "text-xl font-bold mb-2 text-[#BD6221]";
    sectionHeader.textContent = sectionName;
    sectionContainer.appendChild(sectionHeader);

    const booksWrapper = document.createElement("div");
    booksWrapper.className = "flex flex-wrap gap-4";

    Object.entries(books).forEach(([book, chapters]) => {
      const section = document.createElement("div");
      section.className = "border rounded-lg shadow p-4 w-64";

      const header = document.createElement("h3");
      header.className = "text-lg font-semibold cursor-pointer flex justify-between items-center text-[#777060]";
      header.innerHTML = `<span>${book}</span><span id="progress-${book}">0%</span>`;

      const chapterList = document.createElement("div");
      chapterList.className = "mt-3 space-y-1 hidden";

      header.addEventListener("click", () => {
        chapterList.classList.toggle("hidden");
      });

      for (let i = 1; i <= chapters; i++) {
        const chapterRow = document.createElement("div");
        chapterRow.className = "flex items-center space-x-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${book}-ch-${i}`;
        checkbox.className = "accent-[#777060]";
        checkbox.addEventListener("change", () => {
          updateProgress(book, chapters);
          saveReadingProgress(book, i, checkbox.checked);
        });

        const label = document.createElement("label");
        label.setAttribute("for", checkbox.id);
        label.className = "text-sm";
        label.innerHTML = `Chapter ${i} ${createChapterLinks(book, i)}`;

        // Restore saved state
        const saved = localStorage.getItem(`read:${book}:${i}`);
        if (saved === "true") checkbox.checked = true;

        chapterRow.appendChild(checkbox);
        chapterRow.appendChild(label);
        chapterList.appendChild(chapterRow);
      }

      section.appendChild(header);
      section.appendChild(chapterList);
      booksWrapper.appendChild(section);
      updateProgress(book, chapters);
    });

    sectionContainer.appendChild(booksWrapper);
    container.appendChild(sectionContainer);
  });
});



function updateProgress(book, total) {
  const checkboxes = document.querySelectorAll(`#bibleTracker input[id^="${book}-ch-"]`);
  const checked = [...checkboxes].filter(c => c.checked).length;
  const percent = Math.round((checked / total) * 100);
  document.getElementById(`progress-${book}`).textContent = `${percent}%`;
}

function saveReadingProgress(book, chapter, value) {
  localStorage.setItem(`read:${book}:${chapter}`, value ? "true" : "false");
}

function toggleNav() {
  const nav = document.getElementById("sideNav");
  nav.classList.toggle("-translate-x-full");
}

// Example section toggle function
function goTo(section) {
  alert(`Go to: ${section} (swap content here)`);
  toggleNav();
}

function createChapterLinks(book, chapter) {
  const esvLink = `https://www.esv.org/${book.replace(/\s+/g, '+')}+${chapter}/`;
  const koreanLink = koreanAudioLinks?.[book]?.[chapter];

  return `
    <span class="ml-2 text-sm">
      <a href="${esvLink}" target="_blank" class="text-blue-600 underline">📖</a>
      ${koreanLink ? `<a href="${koreanLink}" target="_blank" class="text-red-600 underline ml-1">🎧</a>` : ''}
    </span>
  `;
}
