// 📝 Additional mapping for Korean 3-letter codes:
const koreanBookCodes = {
  Genesis: 'gen', Exodus: 'exo', Leviticus: 'lev', Numbers: 'num', Deuteronomy: 'deu',
  Joshua: 'jos', Judges: 'jdg', Ruth: 'rut', '1 Samuel': '1sa', '2 Samuel': '2sa',
  '1 Kings': '1ki', '2 Kings': '2ki', '1 Chronicles': '1ch', '2 Chronicles': '2ch',
  Ezra: 'ezr', Nehemiah: 'neh', Esther: 'est', Job: 'job', Psalms: 'psa',
  Proverbs: 'pro', Ecclesiastes: 'ecc', 'Song of Solomon': 'sng', Isaiah: 'isa',
  Jeremiah: 'jer', Lamentations: 'lam', Ezekiel: 'ezk', Daniel: 'dan',
  Hosea: 'hos', Joel: 'jol', Amos: 'amo', Obadiah: 'oba', Jonah: 'jon',
  Micah: 'mic', Nahum: 'nam', Habakkuk: 'hab', Zephaniah: 'zep',
  Haggai: 'hag', Zechariah: 'zec', Malachi: 'mal', Matthew: 'mat',
  Mark: 'mrk', Luke: 'luk', John: 'jhn', Acts: 'act',
  Romans: 'rom', '1 Corinthians': '1co', '2 Corinthians': '2co', Galatians: 'gal',
  Ephesians: 'eph', Philippians: 'php', Colossians: 'col', '1 Thessalonians': '1th',
  '2 Thessalonians': '2th', '1 Timothy': '1ti', '2 Timothy': '2ti', Titus: 'tit',
  Philemon: 'phm', Hebrews: 'heb', James: 'jas', '1 Peter': '1pe', '2 Peter': '2pe',
  '1 John': '1jn', '2 John': '2jn', '3 John': '3jn', Jude: 'jud', Revelation: 'rev'
};

// 📝 Keep the rest of your existing main.js as is → then inside `renderChapterPanel()`:

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

    // ✅ ENG (ESV link)
    const esv = document.createElement("a");
    esv.href = `https://www.esv.org/${book.replace(/\s+/g, '+')}+${i}/`;
    esv.target = "_blank";
    esv.textContent = "ENG";

    links.appendChild(esv);

    // ✅ KOR (bskorea link)
    const korCode = koreanBookCodes[book];
    if (korCode) {
      const korLink = document.createElement("a");
      korLink.href = `https://www.bskorea.or.kr/bible/korbibReadpage.php?version=GAE&book=${korCode}&chap=${i}&sec=1&cVersion=&fontSize=15px&fontWeight=normal`;
      korLink.target = "_blank";
      korLink.textContent = "KOR";
      links.appendChild(korLink);
    }

    // ✅ existing 🎧 audio
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
