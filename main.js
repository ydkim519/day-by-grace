// your existing koreanAudioLinks, propagateAudioLinks, koreanBookCodes, bibleSections...

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

const koreanBookCodes = { /* same as before */ };
const bibleSections = { /* same as before */ };

// unchanged renderBibleLayout, renderChapterPanel, updateBoxStyle, updateProgress...

function renderBibleLayout(initialBook) {
  // same as your current version
}

function renderChapterPanel(book, chapters) {
  // same as your current version
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

let calendarInstance = null;

function goTo(section) {
  const chapterPanel = document.getElementById("chapterPanel");
  const calendarPanel = document.getElementById("calendarPanel");

  if (section === 'bible') {
    chapterPanel.classList.remove('hidden');
    calendarPanel.classList.add('hidden');
  } else if (section === 'events') {
    chapterPanel.classList.add('hidden');
    calendarPanel.classList.remove('hidden');

    // ✅ Initialize calendar if not already
    if (!calendarInstance) {
      calendarInstance = new FullCalendar.Calendar(calendarPanel, {
        initialView: 'dayGridMonth',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
        selectable: true,
        select: function (info) {
          const eventName = prompt('Event name:');
          if (eventName) {
            calendarInstance.addEvent({
              title: eventName,
              start: info.startStr,
              end: info.endStr,
              allDay: info.allDay,
              backgroundColor: '#BD6221'
            });
          }
          calendarInstance.unselect();
        }
      });
      calendarInstance.render();
    }
  }

  toggleNav();
}

function toggleNav() {
  const nav = document.getElementById("sideNav");
  nav.classList.toggle("-translate-x-full");
}
