
let koreanAudioLinks = {};

fetch('koreanAudioLinks.json')
  .then(response => response.json())
  .then(data => {
    koreanAudioLinks = propagateAudioLinks(data);
    renderBibleGroups();
  })
  .catch(err => {
    console.error("Failed to load koreanAudioLinks.json", err);
    renderBibleGroups();
  });

function propagateAudioLinks(links) {
  const propagated = {};
  for (const [book, chapters] of Object.entries(links)) {
    let lastLink = null;
    propagated[book] = {};
    for (let i = 1; i <= 150; i++) {
      if (chapters[i]) lastLink = chapters[i];
      if (lastLink) propagated[book][i] = lastLink;
    }
  }
  return propagated;
}

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

function renderBibleGroups() {
  const container = document.getElementById("bibleTracker");
  container.innerHTML = "";

  Object.entries(bibleSections).forEach(([sectionName, books]) => {
    const section = document.createElement("div");
    section.className = "mb-6";

    const toggleBtn = document.createElement("h2");
    toggleBtn.className = "text-xl font-bold mb-2 cursor-pointer text-[#BD6221]";
    toggleBtn.textContent = sectionName;

    const bookList = document.createElement("div");
    bookList.className = "flex flex-col gap-2 ml-4 hidden";

    toggleBtn.addEventListener("click", () => {
      bookList.classList.toggle("hidden");
    });

    Object.entries(books).forEach(([book, chapters]) => {
      const card = document.createElement("div");
      card.className = "border p-3 rounded cursor-pointer hover:shadow flex justify-between items-center";
      card.innerHTML = `<span class="font-semibold text-[#777060]">${book}</span><span id="progress-${book}" class="text-sm">0%</span>`;

      card.addEventListener("click", () => {
        openRightPanel(book, chapters);
      });

      bookList.appendChild(card);
      updateProgress(book, chapters);
    });

    section.appendChild(toggleBtn);
    section.appendChild(bookList);
    container.appendChild(section);
  });

  createRightPanelContainer();
}

function createRightPanelContainer() {
  let existing = document.getElementById("chapterPanel");
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = "chapterPanel";
  panel.className = "fixed top-20 right-0 w-full max-w-md h-full bg-white border-l shadow-lg p-4 overflow-y-auto transform translate-x-full transition-transform duration-300 z-50";
  document.body.appendChild(panel);
}

function openRightPanel(book, chapters) {
  const panel = document.getElementById("chapterPanel");
  panel.innerHTML = `<h2 class="text-xl font-bold mb-4 text-[#BD6221]">${book}</h2>`;

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-2 sm:grid-cols-3 gap-2";

  for (let i = 1; i <= chapters; i++) {
    const key = `read:${book}:${i}`;
    const isRead = localStorage.getItem(key) === "true";

    const box = document.createElement("div");
    box.className = "flex justify-between items-center p-2 rounded border cursor-pointer text-sm transition";
    updateBoxStyle(box, isRead);

    box.onclick = (e) => {
      if (e.target.tagName === "A") return;
      const nowRead = !box.classList.contains("bg-[#BD6221]");
      localStorage.setItem(key, nowRead ? "true" : "false");
      updateBoxStyle(box, nowRead);
      updateProgress(book, chapters);
    };

    const label = document.createElement("span");
    label.textContent = i;

    const links = document.createElement("div");
    links.className = "flex gap-1 items-center ml-2";

    const esv = document.createElement("a");
    esv.href = `https://www.esv.org/${book.replace(/\s+/g, '+')}+${i}/`;
    esv.target = "_blank";
    esv.innerHTML = "📖";

    links.appendChild(esv);

    const audio = koreanAudioLinks?.[book]?.[i];
    if (audio) {
      const link = document.createElement("a");
      link.href = audio;
      link.target = "_blank";
      link.innerHTML = "🎧";
      links.appendChild(link);
    }

    box.appendChild(label);
    box.appendChild(links);
    grid.appendChild(box);
  }

  panel.appendChild(grid);
  panel.classList.remove("translate-x-full");
}

function updateBoxStyle(box, isRead) {
  if (isRead) {
    box.classList.add("bg-[#BD6221]", "text-[#FDEFCC]");
    box.classList.remove("bg-white", "text-[#777060]");
  } else {
    box.classList.remove("bg-[#BD6221]", "text-[#FDEFCC]");
    box.classList.add("bg-white", "text-[#777060]");
  }
}

function updateProgress(book, total) {
  let count = 0;
  for (let i = 1; i <= total; i++) {
    if (localStorage.getItem(`read:${book}:${i}`) === "true") count++;
  }
  const percent = Math.round((count / total) * 100);
  const el = document.getElementById(`progress-${book}`);
  if (el) el.textContent = `${percent}%`;
}
