const state = {
  world: null,
  pendingApprovals: new Set(),
  declinedProposals: new Set(),
  proposalOutcomes: new Map(),
  activeProposalTab: "active",
  lastNotice: "",
};

const ACTIVE_PROPOSAL_LIMIT = 5;
const DECLINED_STORAGE_KEY = "bubble-boy-declined-proposals";

function loadDeclinedProposals() {
  try {
    const values = JSON.parse(localStorage.getItem(DECLINED_STORAGE_KEY) || "[]");
    state.declinedProposals = new Set(Array.isArray(values) ? values : []);
  } catch (_error) {
    state.declinedProposals = new Set();
  }
}

function saveDeclinedProposals() {
  localStorage.setItem(DECLINED_STORAGE_KEY, JSON.stringify([...state.declinedProposals]));
}

function qs(selector) {
  return document.querySelector(selector);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

function setRequestStatus(message) {
  const status = qs("#request-status");
  if (status) status.textContent = message;
}

function setButtonBusy(button, isBusy, busyText) {
  if (!button) return;
  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent;
  }

  button.disabled = isBusy;
  button.setAttribute("aria-busy", isBusy ? "true" : "false");
  button.textContent = isBusy ? busyText : button.dataset.defaultText;
}

async function withBusyButton(button, busyText, task) {
  setButtonBusy(button, true, busyText);
  try {
    return await task();
  } finally {
    setButtonBusy(button, false, busyText);
  }
}

function showNotice(message, kind = "success") {
  const notice = qs("#approval-notice");
  if (!notice || !message) return;

  const key = `${kind}:${message}`;
  if (state.lastNotice === key && notice.classList.contains("is-visible")) {
    return;
  }

  state.lastNotice = key;
  notice.textContent = message;
  notice.className = `notice is-visible is-${kind}`;
}

function addChatMessage(kind, message) {
  const log = qs("#chat-log");
  if (!log || !message) return;

  const messageNode = el("div", `chat-message ${kind}-message`, message);
  log.appendChild(messageNode);
  log.scrollTop = log.scrollHeight;
}

function renderAvatar(world) {
  const avatar = world.avatar || {};
  qs("#avatar-name").textContent = avatar.name || "Bubble Boy";
  qs("#avatar-motto").textContent = avatar.motto || "Tiny world. Big swings.";
  qs("#avatar-speech").textContent = avatar.speech || "No speech loaded.";

  const avatarCard = qs("#avatar-card");
  avatarCard.dataset.mood = avatar.mood || "unknown";
  avatarCard.dataset.pose = avatar.pose || "unknown";

  const orb = qs("#avatar-orb");
  const visuals = avatar.visuals || {};
  orb.dataset.expression = visuals.expression || "neutral";
  orb.dataset.motion = visuals.motion || "idle";
}

function renderRoom(world) {
  const room = world.room || {};
  const zones = Array.isArray(room.zones) ? room.zones : [];
  const zoneRoot = qs("#room-zones");
  zoneRoot.innerHTML = "";

  for (const zone of zones) {
    const zoneNode = el("div", "room-zone");
    zoneNode.style.left = `${Number(zone.x || 0)}%`;
    zoneNode.style.top = `${Number(zone.y || 0)}%`;
    zoneNode.style.width = `${Number(zone.width || 20)}%`;
    zoneNode.style.height = `${Number(zone.height || 12)}%`;

    zoneNode.appendChild(el("strong", "", zone.label || zone.id || "Zone"));
    zoneNode.appendChild(el("span", "", `${zone.kind || "zone"} / ${zone.status || "unknown"}`));
    zoneRoot.appendChild(zoneNode);
  }
}

function shortReason(text) {
  const value = String(text || "").trim();
  if (value.length <= 220) return value;
  return `${value.slice(0, 217)}...`;
}

function proposalStatus(proposal) {
  return String(proposal.status || "unknown").toLowerCase();
}

function proposalIdFor(currentProposal) {
  return String(currentProposal.id || "");
}

function proposalOutcome(proposalId, currentProposal) {
  if (state.declinedProposals.has(proposalId)) return "declined";
  if (state.proposalOutcomes.has(proposalId)) return state.proposalOutcomes.get(proposalId);
  if (proposalStatus(currentProposal) !== "proposed") return "approved";
  return "pending";
}

function renderProposalCard(currentProposal, isActive, pastReason = "") {
  const proposalId = proposalIdFor(currentProposal);
  const outcome = proposalOutcome(proposalId, currentProposal);
  const card = el(
    "article",
    `proposal-card ${isActive ? "is-active" : "is-history"} is-${outcome}`
  );
  const isPending = state.pendingApprovals.has(proposalId);
  const status = proposalStatus(currentProposal);

  card.appendChild(el("h3", "proposal-title", currentProposal.title || "Untitled proposal"));

  if (isActive) {
    const actions = el("div", "proposal-actions");

    const approveButton = el("button", "approve-button", isPending ? "Approving..." : "Approve");
    approveButton.type = "button";
    approveButton.disabled = isPending || !proposalId;
    approveButton.setAttribute("aria-busy", isPending ? "true" : "false");
    approveButton.addEventListener("click", () => approveProposal(proposalId));
    actions.appendChild(approveButton);

    const declineButton = el("button", "decline-button", "Decline");
    declineButton.type = "button";
    declineButton.disabled = isPending || !proposalId;
    declineButton.addEventListener("click", () => declineProposal(proposalId));
    actions.appendChild(declineButton);

    card.appendChild(actions);
  } else if (pastReason) {
    card.appendChild(el("p", "proposal-past-reason", pastReason));
  }

  const details = el("details", "proposal-details");
  const summary = el("summary", "", "Extended information");
  details.appendChild(summary);

  const meta = el("div", "proposal-meta");
  meta.appendChild(el("span", "", `Status: ${status}`));
  meta.appendChild(el("span", "", `Risk: ${currentProposal.risk || "risk unknown"}`));
  if (proposalId) meta.appendChild(el("span", "", proposalId));
  details.appendChild(meta);

  const reason = shortReason(currentProposal.reason);
  if (reason) details.appendChild(el("p", "", reason));

  const changes = Array.isArray(currentProposal.planned_changes)
    ? currentProposal.planned_changes
    : [];
  if (changes.length > 0) {
    const list = el("ul", "proposal-detail-list");
    for (const change of changes) {
      list.appendChild(el("li", "", change));
    }
    details.appendChild(list);
  }

  card.appendChild(details);
  return card;
}

function renderProposals(world) {
  const proposals = Array.isArray(world.proposals) ? world.proposals : [];
  const activeRoot = qs("#proposal-list");
  const historyRoot = qs("#proposal-history-list");
  activeRoot.innerHTML = "";
  historyRoot.innerHTML = "";

  const proposed = proposals
    .filter((proposal) => proposalStatus(proposal) === "proposed")
    .slice()
    .reverse();
  const available = proposed.filter((proposal) => !state.declinedProposals.has(proposalIdFor(proposal)));
  const active = available.slice(0, ACTIVE_PROPOSAL_LIMIT);
  const overflow = available.slice(ACTIVE_PROPOSAL_LIMIT);
  const declined = proposed.filter((proposal) => state.declinedProposals.has(proposalIdFor(proposal)));
  const completed = proposals
    .filter((proposal) => proposalStatus(proposal) !== "proposed")
    .slice()
    .reverse();
  const history = [
    ...declined.map((proposal) => ({ proposal, reason: "Declined" })),
    ...overflow.map((proposal) => ({ proposal, reason: "Moved from active after the five most recent proposals" })),
    ...completed.map((proposal) => ({ proposal, reason: "Completed" })),
  ];

  if (active.length === 0) {
    activeRoot.appendChild(el("div", "empty-state", "No active proposals. Wake or chat to generate one."));
  } else {
    for (const currentProposal of active) {
      activeRoot.appendChild(renderProposalCard(currentProposal, true));
    }
  }

  if (history.length === 0) {
    historyRoot.appendChild(el("div", "empty-state", "No past proposals yet."));
  } else {
    for (const item of history) {
      historyRoot.appendChild(renderProposalCard(item.proposal, false, item.reason));
    }
  }
}

function setProposalTab(tabName) {
  state.activeProposalTab = tabName === "past" ? "past" : "active";

  const activeTab = qs("#active-proposals-tab");
  const pastTab = qs("#past-proposals-tab");
  const activePanel = qs("#active-proposals-panel");
  const pastPanel = qs("#past-proposals-panel");
  const isPast = state.activeProposalTab === "past";

  activeTab.classList.toggle("is-selected", !isPast);
  activeTab.setAttribute("aria-selected", isPast ? "false" : "true");
  pastTab.classList.toggle("is-selected", isPast);
  pastTab.setAttribute("aria-selected", isPast ? "true" : "false");
  activePanel.hidden = isPast;
  activePanel.classList.toggle("is-selected", !isPast);
  pastPanel.hidden = !isPast;
  pastPanel.classList.toggle("is-selected", isPast);
}

function declineProposal(proposalId) {
  if (!proposalId || state.pendingApprovals.has(proposalId)) return;
  state.declinedProposals.add(proposalId);
  state.proposalOutcomes.set(proposalId, "declined");
  saveDeclinedProposals();
  showNotice(`Declined proposal: ${proposalId}`, "error");
  setProposalTab("past");
  if (state.world) renderWorld(state.world);
}

function renderStatus(world) {
  const health = world.health || {};
  const statusMd = world.status_md || "";
  const tree = Array.isArray(world.tree) ? world.tree : [];

  qs("#status-output").textContent = [
    "HEALTH",
    JSON.stringify(health, null, 2),
    "",
    "STATUS",
    statusMd.trim(),
    "",
    "TREE",
    tree.join("\n"),
  ].join("\n");
}

function renderWorld(world) {
  state.world = world;
  renderAvatar(world);
  renderRoom(world);
  renderProposals(world);
  renderStatus(world);
}

function reloadToybox() {
  const frame = qs("#toybox-frame");
  if (!frame) return;
  frame.src = `/toybox?reload=${Date.now()}`;
}

async function refreshWorld() {
  setRequestStatus("Refreshing");
  const world = await fetchJson("/api/world");
  renderWorld(world);
  setRequestStatus("Ready");
}

async function wakeBubbleBoy() {
  setRequestStatus("Waking");
  const data = await fetchJson("/api/wake", { method: "POST", body: "{}" });
  addChatMessage("bubble", data.speech || "Bubble Boy woke up silently.");
  if (data.proposal) {
    showNotice(`Proposal created: ${data.proposal.title}`, "success");
  }
  renderWorld(data.world);
  setRequestStatus("Ready");
}

async function approveProposal(proposalId) {
  if (!proposalId || state.pendingApprovals.has(proposalId)) {
    return;
  }

  state.pendingApprovals.add(proposalId);
  state.proposalOutcomes.set(proposalId, "approved");
  if (state.world) {
    renderWorld(state.world);
  }

  setRequestStatus("Approving");

  try {
    const data = await fetchJson("/api/approve", {
      method: "POST",
      body: JSON.stringify({ proposal_ref: proposalId }),
    });

    const changedFiles = Array.isArray(data.proposal.changed_files)
      ? data.proposal.changed_files
      : [];
    const fileSummary =
      changedFiles.length > 0 ? ` Changed: ${changedFiles.map((path) => `bubble/${path}`).join(", ")}.` : "";

    showNotice(`Applied proposal: ${data.proposal.title}.${fileSummary}`, "success");

    if (data.reflection && data.reflection.speech) {
      addChatMessage("bubble", data.reflection.speech);
    }

    if (data.reflection && data.reflection.next_intent) {
      addChatMessage("system", `Next: ${data.reflection.next_intent}`);
    }

    renderWorld(data.world);
    reloadToybox();
    setRequestStatus("Ready");
  } catch (error) {
    state.proposalOutcomes.set(proposalId, "declined");
    showNotice(`Approval failed: ${error.message}`, "error");
    setRequestStatus("Failed");
    await refreshWorld();
  } finally {
    state.pendingApprovals.delete(proposalId);
    if (state.world) {
      renderWorld(state.world);
    }
  }
}

async function sendChatMessage(message) {
  addChatMessage("user", message);
  setRequestStatus("Thinking");

  const data = await fetchJson("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  addChatMessage("bubble", data.speech || "Bubble Boy responded with silence.");
  if (data.proposal) {
    showNotice(`Proposal created: ${data.proposal.title}`, "success");
  }
  renderWorld(data.world);
  setRequestStatus("Ready");
}

function wireEvents() {
  qs("#active-proposals-tab").addEventListener("click", () => setProposalTab("active"));
  qs("#past-proposals-tab").addEventListener("click", () => setProposalTab("past"));

  const reloadButton = qs("#reload-toybox-button");
  reloadButton.addEventListener("click", () => {
    withBusyButton(reloadButton, "Reloading...", async () => {
      reloadToybox();
      await new Promise((resolve) => setTimeout(resolve, 350));
    }).catch((error) => showNotice(error.message, "error"));
  });

  const refreshButton = qs("#refresh-button");
  refreshButton.addEventListener("click", () => {
    withBusyButton(refreshButton, "Refreshing...", refreshWorld).catch((error) => {
      setRequestStatus("Failed");
      showNotice(error.message, "error");
    });
  });

  const wakeButton = qs("#wake-button");
  wakeButton.addEventListener("click", () => {
    withBusyButton(wakeButton, "Waking...", wakeBubbleBoy).catch((error) => {
      setRequestStatus("Failed");
      showNotice(error.message, "error");
    });
  });

  qs("#chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = qs("#chat-input");
    const button = qs("#chat-submit-button");
    const message = input.value.trim();
    if (!message) return;

    input.value = "";
    input.disabled = true;
    withBusyButton(button, "Sending...", () => sendChatMessage(message))
      .catch((error) => {
        setRequestStatus("Failed");
        showNotice(error.message, "error");
      })
      .finally(() => {
        input.disabled = false;
        input.focus();
      });
  });
}

loadDeclinedProposals();
wireEvents();
setProposalTab("active");
refreshWorld().catch((error) => {
  setRequestStatus("Failed");
  showNotice(error.message, "error");
});
