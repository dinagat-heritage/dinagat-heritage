// Dinagat Heritage — automatically shows the real latest update from GitHub,
// pulled live from the repo's commit history. No manual editing needed.
(function () {
  const el = document.getElementById("last-updated");
  if (!el) return;

  function reveal(text) {
    el.textContent = text;
    // trigger the fade-in on the next frame so the transition actually plays
    requestAnimationFrame(() => {
      el.classList.add("is-loaded");
    });
  }

  fetch("https://api.github.com/repos/dinagat-heritage/dinagat-heritage/commits?per_page=1")
    .then((res) => {
      if (!res.ok) throw new Error("GitHub API request failed");
      return res.json();
    })
    .then((data) => {
      const commit = data[0];
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
      // Fail quietly rather than show a broken message to visitors
      reveal("This archive is updated regularly.");
    });
})();
