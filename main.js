
let koreanAudioLinks = {};

fetch('koreanAudioLinks.json')
  .then(response => response.json())
  .then(data => {
    koreanAudioLinks = propagateAudioLinks(data);
    renderBibleTracker();
  })
  .catch(err => {
    console.error("Failed to load koreanAudioLinks.json", err);
    renderBibleTracker();
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

function renderBibleTracker() {
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

  const container = document.getElementById("bibleTracker");
  if (!container) return;
  container.innerHTML = "";

  Object.entries(bibleSections).forEach(([sectionName, books]) => {
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "mb-8";

    const sectionHeader = document.createElement("h2");
    sectionHeader.className = "text-xl font-bold mb-4 text-[#BD6221]";
    sectionHeader.textContent = sectionName;
    sectionContainer.appendChild(sectionHeader);

    Object.entries(books).forEach(([book, chapters]) => {
      const bookCard = document.createElement("div");
      bookCard.className = "border rounded-lg shadow p-4 w-full mb-4 bg-white";

      const header = document.createElement("h3");
      header.className = "text-lg font-semibold cursor-pointer flex justify-between items-center text-[#777060]";
      header.innerHTML = `<span>${book}</span><span id="progress-${book}">0%</span>`;

      const chapterGrid = document.createElement("div");
      chapterGrid.className = "mt-4 hidden grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 chapter-grid";

      header.addEventListener("click", () => {
        const alreadyOpen = !chapterGrid.classList.contains("hidden");
        document.querySelectorAll(".chapter-grid").forEach(grid => grid.classList.add("hidden"));
        if (!alreadyOpen) chapterGrid.classList.remove("hidden");
      });

      for (let i = 1; i <= chapters; i++) {
        const key = `read:${book}:${i}`;
        const isRead = localStorage.getItem(key) === "true";

        const box = document.createElement("div");
        box.className = `flex items-center justify-between px-3 py-2 rounded border text-sm transition duration-150 ${isRead ? "bg-[#BD6221] text-[#FDEFCC]" : "bg-white text-[#777060]"} hover:shadow-md`;
        box.classList.add("cursor-pointer");

        const left = document.createElement("div");
        left.className = "flex items-center gap-2";

        const check = document.createElement("span");
        check.innerHTML = "✔️";
        check.style.color = isRead ? "#FDEFCC" : "#777060";

        check.onclick = (e) => {
          e.stopPropagation();
          const nowRead = !box.classList.contains("bg-[#BD6221]");
          box.classList.toggle("bg-[#BD6221]", nowRead);
          box.classList.toggle("text-[#FDEFCC]", nowRead);
          check.style.color = nowRead ? "#FDEFCC" : "#777060";
          localStorage.setItem(key, nowRead ? "true" : "false");
          updateProgress(book, chapters);
        };

        const label = document.createElement("span");
        label.textContent = i;

        left.appendChild(check);
        left.appendChild(label);

        const right = document.createElement("div");
        right.className = "flex gap-1 items-center";

        const esv = document.createElement("a");
        esv.href = `https://www.esv.org/${book.replace(/\s+/g, '+')}+${i}/`;
        esv.target = "_blank";
        esv.innerHTML = "📖";

        right.appendChild(esv);

        const audio = koreanAudioLinks?.[book]?.[i];
        if (audio) {
          const link = document.createElement("a");
          link.href = audio;
          link.target = "_blank";
          link.innerHTML = "🎧";
          right.appendChild(link);
        }

        box.appendChild(left);
        box.appendChild(right);
        chapterGrid.appendChild(box);
      }

      bookCard.appendChild(header);
      bookCard.appendChild(chapterGrid);
      sectionContainer.appendChild(bookCard);
    });

    container.appendChild(sectionContainer);
  });
}

function updateProgress(book, total) {
  const el = document.getElementById(`progress-${book}`);
  if (!el) return;
  const boxes = document.querySelectorAll(`[id^='${book}-ch-']`);
  const checked = [...document.querySelectorAll(`.chapter-grid .bg-[#BD6221]`)].length;
  const percent = Math.round((checked / total) * 100);
  el.textContent = `${percent}%`;
}

function toggleNav() {
  const nav = document.getElementById("sideNav");
  nav.classList.toggle("hidden");
}

function goTo(section) {
  alert(`Go to: ${section}`);
  toggleNav();
}
