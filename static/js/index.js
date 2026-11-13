"use strict";

// Table 1 in arXiv:2611.16339v1. Ours: clean, C1, C2, C3, C4.
const results = [
  {
    name: "DexYCB-MV",
    baseline: "JUMP-Hand",
    mpvpe: [5.45, [2.07, 2.18, 2.41, 2.63, 2.98]],
    rrv: [6.41, [1.63, 1.82, 2.01, 2.15, 2.38]],
    pav: [3.77, [1.12, 1.23, 1.37, 1.49, 1.63]],
    mpjpe: [5.31, [2.12, 2.23, 2.46, 2.68, 3.04]],
    rrj: [6.41, [1.69, 1.89, 2.08, 2.23, 2.47]],
    paj: [3.61, [1.16, 1.27, 1.42, 1.55, 1.69]],
  },
  {
    name: "HO3D-MV",
    baseline: "POEMv2",
    mpvpe: [7.63, [2.79, 3.03, 3.31, 3.45, 3.55]],
    rrv: [10.58, [2.7, 2.95, 3.16, 3.31, 3.47]],
    pav: [4.59, [1.83, 1.89, 1.99, 2.07, 2.16]],
    mpjpe: [7.18, [2.76, 3.01, 3.28, 3.42, 3.52]],
    rrj: [10.58, [2.67, 2.92, 3.15, 3.3, 3.47]],
    paj: [4.13, [1.76, 1.83, 1.93, 2.01, 2.1]],
  },
  {
    name: "OakInk-MV",
    baseline: "JUMP-Hand",
    mpvpe: [5.94, [2.95, 3.31, 3.77, 4.14, 4.58]],
    rrv: [6.99, [2.9, 3.25, 3.66, 4.01, 4.4]],
    pav: [4.13, [2.25, 2.48, 2.76, 2.97, 3.21]],
    mpjpe: [5.72, [3.0, 3.37, 3.83, 4.21, 4.66]],
    rrj: [6.94, [2.95, 3.31, 3.74, 4.1, 4.52]],
    paj: [3.86, [2.25, 2.49, 2.78, 3.01, 3.26]],
  },
  {
    name: "ARCTIC-MV",
    baseline: "POEMv2",
    mpvpe: [5.89, [2.99, 3.07, 3.22, 3.43, 3.76]],
    rrv: [7.13, [2.97, 3.04, 3.15, 3.31, 3.56]],
    pav: [4.43, [2.2, 2.26, 2.33, 2.41, 2.55]],
    mpjpe: [5.42, [3.0, 3.09, 3.24, 3.45, 3.77]],
    rrj: [6.8, [2.99, 3.06, 3.18, 3.34, 3.61]],
    paj: [3.91, [2.18, 2.25, 2.32, 2.41, 2.55]],
  },
  {
    name: "InterHand-MV",
    baseline: "POEMv2",
    mpvpe: [7.64, [3.52, 3.67, 3.79, 3.87, 4.0]],
    rrv: [9.04, [3.39, 3.51, 3.51, 3.53, 3.59]],
    pav: [5.23, [2.18, 2.24, 2.29, 2.35, 2.44]],
    mpjpe: [7.19, [3.59, 3.75, 3.86, 3.94, 4.06]],
    rrj: [8.82, [3.45, 3.58, 3.58, 3.6, 3.66]],
    paj: [4.72, [2.17, 2.23, 2.29, 2.36, 2.45]],
  },
];
const descriptions = {
  mpvpe: "Mean per-vertex position error · mm · lower is better",
  rrv: "Root-relative vertex error (RR-V) · mm · lower is better",
  pav: "Procrustes-aligned vertex error (PA-V) · mm · lower is better",
  mpjpe: "Mean per-joint position error · mm · lower is better",
  rrj: "Root-relative joint error (RR-J) · mm · lower is better",
  paj: "Procrustes-aligned joint error (PA-J) · mm · lower is better",
};
let selectedMetric = "mpvpe";
const condition = document.querySelector("#mask-condition");

function renderResults(announce = true) {
  const level = Number(condition.value);
  const max = Math.max(...results.map((row) => row[selectedMetric][0]));
  document.querySelector("#results-body").innerHTML = results
    .map((row) => {
      const [baseline, values] = row[selectedMetric];
      const ours = values[level];
      const reduction = (((baseline - ours) / baseline) * 100).toFixed(1);
      return `<tr><th scope="row">${row.name}<small class="mobile-baseline">${row.baseline}</small></th><td>${row.baseline}</td><td>${baseline.toFixed(2)}</td><td class="ours-column">${ours.toFixed(2)}</td><td><span class="reduction">${reduction}%</span><span class="comparison-bars" aria-hidden="true"><i style="width:${(baseline / max) * 100}%"></i><b style="width:${(ours / max) * 100}%"></b></span></td></tr>`;
    })
    .join("");
  document.querySelector("#metric-description").textContent =
    descriptions[selectedMetric];
  document.querySelector("#condition-note").textContent =
    level === 0
      ? "Clean masks are rendered from reference geometry. Baselines use RGB inputs. Error reduction is calculated from the rounded values reported in Table 1."
      : `C${level} applies synthetic corruption to reference-rendered masks; C3 most closely matches the calibrated SAM3 mask quality. Baseline RGB results are unchanged. Values are from Table 1.`;
  if (announce) {
    document.querySelector("#results-announcement").textContent =
      `${descriptions[selectedMetric]}. ${level ? `Corruption C${level}` : "Clean masks"}. Results updated for five datasets.`;
  }
}
document.querySelectorAll("[data-metric]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedMetric = button.dataset.metric;
    document
      .querySelectorAll("[data-metric]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    renderResults();
  });
});
condition.addEventListener("change", renderResults);
// Firefox restores select values after reload; the table must reflect that state.
window.addEventListener("pageshow", () => renderResults(false));
renderResults(false);
document.querySelector(".results-controls").hidden = false;

// A release URL activates all matching resource links and removes Soon labels.
for (const resource of ["code", "dataset"]) {
  const configured = window.SILHAND_LINKS?.[resource];
  const value = typeof configured === "string" ? configured.trim() : "";
  let url;
  try {
    if (value) url = new URL(value);
  } catch {
    /* Keep unavailable state. */
  }
  const available = url && url.protocol === "https:";
  document.querySelectorAll(`[data-resource="${resource}"]`).forEach((link) => {
    if (available) {
      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
      link.classList.remove("pending-resource");
    } else if (link.hasAttribute("data-resource-cta")) {
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });
  if (available) {
    document
      .querySelectorAll(`[data-coming="${resource}"]`)
      .forEach((badge) => {
        badge.hidden = true;
      });
    document
      .querySelectorAll(`[data-resource-label="${resource}"]`)
      .forEach((label) => {
        label.textContent =
          resource === "dataset"
            ? "Dataset on Hugging Face"
            : "Inference code on GitHub";
      });
  }
}

const dialog = document.querySelector("#figure-dialog");
document.querySelectorAll("[data-figure]").forEach((button) => {
  button.addEventListener("click", (event) => {
    // Preserve normal image links without JS and when opening a new browser tab.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    if (typeof dialog.showModal !== "function") return;
    event.preventDefault();
    const image = document.querySelector("#figure-image");
    image.src = button.dataset.figure;
    image.alt = button.querySelector("img").alt;
    document.querySelector("#figure-original").href = button.href;
    document.querySelector("#figure-caption").textContent =
      button.dataset.caption;
    dialog.showModal();
  });
});
dialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const first = dialog.querySelector("#figure-original");
  const last = dialog.querySelector(".dialog-close");
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom)
  )
    dialog.close();
});

document.querySelector("#copy-citation").addEventListener("click", async () => {
  const code = document.querySelector("#bibtex");
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText(code.textContent);
    status.textContent = "BibTeX copied to clipboard.";
    document.querySelector("#copy-citation span").textContent = "Copied";
    setTimeout(() => {
      document.querySelector("#copy-citation span").textContent = "Copy BibTeX";
    }, 2500);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Citation selected. Press Ctrl+C (or ⌘C) to copy.";
  }
});
document.querySelector("#copy-citation").hidden = false;
