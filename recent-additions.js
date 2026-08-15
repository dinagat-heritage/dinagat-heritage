// Dinagat Heritage — "Recent Additions" homepage strip.
// Pulls the last 3 real content updates from GitHub automatically. If a commit
// added a photo, that photo becomes the card's thumbnail. If not, a generic
// on-brand icon is used instead — never a generated or invented image of a
// real person, since this archive only shows real photographs.
(function () {
  const container = document.getElementById("recent-additions-grid");
  if (!container) return;

  const TECHNICAL_MARKERS = [
    "automatic", "fade-in", "fade in", "surprise me", "sitemap",
    "verification", "internal linking", "trigger fresh deploy",
    "retry deploy", "github actions", "cropping", "crop", "favicon",
    "size fix", "legibility", "privacy:", "workflow", "deploy after",
    "stuck", "cancelled", "re-run", "merge github actions",
    "scaffold", "initial commit", "readme", "reduce personal surname",
    "cnam", "dns", "last-updated", "last updated", "filter", "technical",
    "commit history", "site plumbing", "engagement feature", "recent additions",
    "homepage strip", "thumbnail",
  ];

  function isTechnical(message) {
    const lower = message.toLowerCase();
    return TECHNICAL_MARKERS.some((m) => lower.includes(m));
  }

  function humanize(message) {
    let text = message;
    text = text.replace(/\s*\([^)]*\)/g, "");
    text = text.replace(/^(Add|Adds|Added|Update|Updates|Updated|Create|Creates|Created|Insert|Inserts|Expand|Expands|Rebuild|Rebuilds|Convert|Converts|Photo of)\s+/i, "");
    text = text.replace(/\s{2,}/g, " ").trim();
    text = text.replace(/[.,;:]+$/, "");
    return text;
  }

  // A small, abstract, on-brand icon — an open ledger/book shape — used
  // whenever a name-only addition has no real photo to show yet.
  const GENERIC_ICON = `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 10C20 8 13 7 8 8V36C13 35 20 36 24 38C28 36 35 35 40 36V8C35 7 28 8 24 10Z"
            stroke="#B08245" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M24 10V38" stroke="#B08245" stroke-width="1.5"/>
      <path d="M13 15H19M13 20H19M29 15H35M29 20H35" stroke="#5A6E48" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  `;

  function dateStr(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function buildCard(commit, thumbUrl) {
    const a = document.createElement("a");
    a.className = "ra-card";
    a.href = "/roots/";

    if (thumbUrl) {
      const img = document.createElement("img");
      img.className = "ra-thumb";
      img.src = thumbUrl;
      img.alt = "";
      a.appendChild(img);
    } else {
      const wrap = document.createElement("div");
      wrap.className = "ra-icon-wrap";
      wrap.innerHTML = GENERIC_ICON;
      a.appendChild(wrap);
    }

    const body = document.createElement("div");
    body.className = "ra-body";
    const title = document.createElement("p");
    title.className = "ra-title";
    title.textContent = humanize(commit.commit.message.split("\n")[0]);
    const date = document.createElement("p");
    date.className = "ra-date";
    date.textContent = dateStr(commit.commit.author.date);
    body.appendChild(title);
    body.appendChild(date);
    a.appendChild(body);

    return a;
  }

  fetch("https://api.github.com/repos/dinagat-heritage/dinagat-heritage/commits?per_page=25")
    .then((res) => {
      if (!res.ok) throw new Error("GitHub API request failed");
      return res.json();
    })
    .then((data) => {
      const contentCommits = data
        .filter((c) => !isTechnical(c.commit.message.split("\n")[0]))
        .slice(0, 3);

      if (contentCommits.length === 0) {
        showFallback();
        return;
      }

      // For each content commit, check whether it added a photo, so we can
      // use the real photo as the thumbnail instead of the generic icon.
      const detailFetches = contentCommits.map((c) =>
        fetch(`https://api.github.com/repos/dinagat-heritage/dinagat-heritage/commits/${c.sha}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      );

      Promise.all(detailFetches).then((details) => {
        contentCommits.forEach((commit, i) => {
          let thumbUrl = null;
          const detail = details[i];
          if (detail && detail.files) {
            const addedImage = detail.files.find(
              (f) => f.status === "added" && /^images\/.+\.(jpg|jpeg|png)$/i.test(f.filename)
            );
            if (addedImage) thumbUrl = "/" + addedImage.filename;
          }
          const card = buildCard(commit, thumbUrl);
          container.appendChild(card);
          requestAnimationFrame(() => card.classList.add("is-loaded"));
        });
      });
    })
    .catch(() => {
      showFallback();
    });

  function showFallback() {
    container.innerHTML = "";
    const note = document.createElement("p");
    note.style.gridColumn = "1 / -1";
    note.style.fontFamily = "var(--font-mono)";
    note.style.fontSize = "0.85rem";
    note.style.color = "var(--mist)";
    note.textContent = "This archive is growing all the time — explore Family Roots to see the latest.";
    container.appendChild(note);
  }
})();
