// Dinagat Heritage — automatically shows the real latest CONTENT update from
// GitHub, pulled live from the repo's commit history. Technical/site-maintenance
// commits (features, fixes, config) are filtered out so visitors always see
// something that's actually about the family, not the site's plumbing.
(function () {
  const el = document.getElementById("last-updated");
  if (!el) return;

  // Substrings that mark a commit as technical/maintenance rather than
  // actual family content — matched case-insensitively.
  const TECHNICAL_MARKERS = [
    "automatic", "fade-in", "fade in", "surprise me", "sitemap",
    "verification", "internal linking", "trigger fresh deploy",
    "retry deploy", "github actions", "cropping", "crop", "favicon",
    "size fix", "legibility", "privacy:", "workflow", "deploy after",
    "stuck", "cancelled", "re-run", "merge github actions",
    "scaffold", "initial commit", "readme", "reduce personal surname",
    "cnam", "dns", "last-updated", "last updated", "filter", "technical",
    "commit history", "site plumbing", "engagement feature",
  ];

  function isTechnical(message) {
    const lower = message.toLowerCase();
    return TECHNICAL_MARKERS.some((marker) => lower.includes(marker));
  }

  function reveal(text) {
    el.textContent = text;
    requestAnimationFrame(() => {
      el.classList.add("is-loaded");
    });
  }

  fetch("https://api.github.com/repos/dinagat-heritage/dinagat-heritage/commits?per_page=25")
    .then((res) => {
      if (!res.ok) throw new Error("GitHub API request failed");
      return res.json();
    })
    .then((data) => {
      const contentCommit = data.find((c) => !isTechnical(c.commit.message.split("\n")[0]));
      const commit = contentCommit || data[0];
      const rawMessage = commit.commit.message.split("\n")[0];
      const date = new Date(commit.commit.author.date);
      const dateStr = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      reveal("Last updated: " + dateStr + " — " + rawMessage);
    })
    .catch(() => {
      reveal("This archive is updated regularly.");
    });
})();
