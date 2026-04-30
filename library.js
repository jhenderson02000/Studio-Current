const libraryElements = {
  search: document.querySelector("#library-search"),
  results: document.querySelector("#library-results"),
  tabs: Array.from(document.querySelectorAll(".genre-tab")),
  items: Array.from(document.querySelectorAll(".library-item")),
  actions: Array.from(document.querySelectorAll(".library-action")),
};

const libraryState = {
  genre: "all",
  query: "",
};

function normalizedText(text) {
  return (text || "").trim().toLowerCase();
}

function updateResultsText(visibleCount) {
  const label =
    libraryState.genre === "all"
      ? "all genres"
      : `${libraryState.genre} items`;
  const queryLabel = libraryState.query ? ` matching "${libraryState.query}"` : "";
  libraryElements.results.textContent = `Showing ${visibleCount} ${label}${queryLabel}.`;
}

function filterLibrary() {
  const query = normalizedText(libraryState.query);
  let visibleCount = 0;

  libraryElements.items.forEach((item) => {
    const genre = item.dataset.genre || "all";
    const haystack = normalizedText(
      [item.dataset.title, item.dataset.keywords, item.textContent].join(" "),
    );

    const matchesGenre = libraryState.genre === "all" || genre === libraryState.genre;
    const matchesQuery = !query || haystack.includes(query);
    const isVisible = matchesGenre && matchesQuery;

    item.classList.toggle("hidden-market-item", !isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  });

  updateResultsText(visibleCount);
}

function setActiveGenre(genre) {
  libraryState.genre = genre;
  libraryElements.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.genre === genre);
  });
  filterLibrary();
}

function applyActionState(button, mode) {
  if (mode === "working") {
    button.disabled = true;
    button.textContent = button.dataset.action === "install" ? "Installing..." : "Downloading...";
    return;
  }

  button.disabled = false;
  button.dataset.state = "done";
  button.textContent = button.dataset.action === "install" ? "Installed" : "Downloaded";
  button.classList.add("is-complete");

  const stateLabel = button.parentElement?.querySelector(".install-state");
  if (stateLabel) {
    stateLabel.textContent = button.dataset.action === "install" ? "Installed to library" : "Download complete";
  }
}

function attachLibraryEvents() {
  libraryElements.search?.addEventListener("input", () => {
    libraryState.query = libraryElements.search.value;
    filterLibrary();
  });

  libraryElements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveGenre(tab.dataset.genre || "all");
    });
  });

  libraryElements.actions.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.state === "done") {
        return;
      }

      applyActionState(button, "working");
      window.setTimeout(() => {
        applyActionState(button, "done");
      }, 850);
    });
  });
}

function initLibrary() {
  attachLibraryEvents();
  filterLibrary();
}

initLibrary();
