let koreanAudioLinks = {};

fetch('koreanAudioLinks.json')
  .then(response => response.json())
  .then(data => {
    koreanAudioLinks = propagateAudioLinks(data);
    renderBibleLayout("Genesis");
  })
  .catch(err => {
    console.error("Failed to load koreanAudioLinks.json", err);
    renderBibleLayout("Genesis");
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
  "Torah (Law)": { Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34 },
  "History": { Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, Ezra: 10, Nehemiah: 13, Esther: 10 },
  "Wisdom": { Job: 42, Psalms: 150, Proverbs: 31, Ecclesiastes: 12, "Song of Solomon": 8 },
  "Major Prophets": { Isaiah: 66, Jeremiah: 52, Lamentations: 5, Ezekiel: 48, Daniel: 12 },
  "Minor Prophets": { Hosea: 14, Joel: 3, Amos: 9, Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3, Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4 },
  "Gospels & Acts": { Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28 },
  "Letters": { Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6, Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1 },
  "Revelation": { Revelation: 22 }
};

function renderBibleLayout(initialBook) {
  const container = document.getElementById("bibleTracker");
  container.innerHTML = "";

  Object.entries(bibleSections).forEach(([sectionName, books]) => {
    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "font-bold text-[#BD6221] mb-1";
    sectionTitle.textContent = sectionName;
    container.appendChild(sectionTitle);

    Object.entries(books).forEach(([book, chapters]) => {
      const bookRow = document.createElement("div");
      bookRow.className = "flex justify-between items-center text-sm mb-1";

      const bookBtn = document.createElement("button");
      bookBtn.className = "text-left text-[#777060] px-2 py-1 rounded hover:bg-[#BD6221] hover:text-[#FDEFCC] flex-grow";
      bookBtn.textContent = book;
      bookBtn.onclick = () => renderChapterPanel(book, chapters);

      const percentSpan = document.createElement("span");
      percentSpan.id = `progress-${book}`;
      percentSpan.className = "text-xs text-right w-10";
      percentSpan.textContent = computeProgress(book, chapters);

      bookRow.appendChild(bookBtn);
      bookRow.appendChild(percentSpan);
      container.appendChild(bookRow);
    });
  });

  renderChapterPanel(initialBook, bibleSections["Torah (Law)"][initialBook]);
}

function renderChapterPanel(book, chapters) {
  const chapterPanel = document.getElementById("chapterPanel");
  const calendarPanel = document.getElementById("calendarPanel");

  chapterPanel.classList.remove("hidden");
  calendarPanel.classList.add("hidden");

  chapterPanel.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "text-lg font-bold text-[#BD6221] mb-2 whitespace-nowrap overflow-hidden text-ellipsis";
  title.textContent = book;
  chapterPanel.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1";

  for (let i = 1; i <= chapters; i++) {
    const key = `read:${book}:${i}`;
    const isRead = localStorage.getItem(key) === "true";

    const box = document.createElement("div");
    box.className = "flex justify-between items-center px-2 py-1 rounded border cursor-pointer text-xs";
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
    links.className = "flex gap-1 items-center ml-1";

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

  chapterPanel.appendChild(grid);
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

function toggleNav() {
  const nav = document.getElementById("sideNav");
  nav.classList.toggle("-translate-x-full");
}

let calendarInitialized = false;

function goTo(section) {
  const chapterPanel = document.getElementById("chapterPanel");
  const calendarPanel = document.getElementById("calendarPanel");

  if (section === 'bible') {
    chapterPanel.classList.remove('hidden');
    calendarPanel.classList.add('hidden');
  } else if (section === 'events') {
    chapterPanel.classList.add('hidden');
    calendarPanel.classList.remove('hidden');

    if (!calendarInitialized) {
      const calendar = new FullCalendar.Calendar(calendarPanel, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        select: function (info) {
          const eventName = prompt('Event name:');
          if (eventName) {
            calendar.addEvent({
              title: eventName,
              start: info.startStr,
              end: info.endStr,
              allDay: info.allDay,
              backgroundColor: '#BD6221'
            });
          }
          calendar.unselect();
        }
      });
      calendar.render();
      calendarInitialized = true;
    }
  }

  toggleNav();
}

