// Dinagat Heritage — "Surprise Me" random destination picker
const DINAGAT_RANDOM_DESTINATIONS = [
  "/roots/#dionisia",
  "/roots/#family-tree",
  "/roots/#jazon-branch",
  "/roots/#rotd-story",
  "/roots/#dinagat-association",
  "/roots/#stories",
  "/roots/#kanjinahud",
  "/roots/#mamas-dinagat",
  "/roots/#zacarias-line",
  "/roots/#penaflor-line",
  "/roots/#ligason-line",
  "/island/#mamanwa",
  "/island/#cortes-bohol",
  "/island/",
  "/guides/",
];

function dinagatSurpriseMe() {
  const current = window.location.pathname + window.location.hash;
  let pick = current;
  // avoid landing on the same spot twice in a row where possible
  let attempts = 0;
  while (pick === current && attempts < 10) {
    pick = DINAGAT_RANDOM_DESTINATIONS[Math.floor(Math.random() * DINAGAT_RANDOM_DESTINATIONS.length)];
    attempts++;
  }
  window.location.href = pick;
}
