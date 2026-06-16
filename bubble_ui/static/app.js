

const state = {
  world: null,
  pendingApprovals: new Set(),
};

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

function addChatMessage(kind, message) {
  const log = qs("#chat-log");
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
    zoneNode.appendChild(el("span", "", `${zone.kind || "zone"} · ${zone.status || "unknown"}`));
    zoneRoot.appendChild(zoneNode);
  }
}

function shortReason(text) {
  const value = String(text || "").trim();
  if (value.length <= 220) return value;
  return `${value.slice(0, 217)}...`;
}

function renderProposals(world) {
  const proposals = Array.isArray(world.proposals) ? world.proposals : [];
  const root = qs("#proposal-list");
  root.innerHTML = "";

  if (proposals.length === 0) {
    root.appendChild(el("div", "chat-message system-message", "No proposals yet. Wake him up."));
    return;
  }

  for (const currentProposal of proposals.slice().reverse()) {
    const card = el("article", "proposal-card");
    const proposalId = currentProposal.id || "";
    const isPending = state.pendingApprovals.has(proposalId);

    card.appendChild(
      el(
        "div",
        "proposal-meta",
        `${currentProposal.status || "unknown"} · ${currentProposal.risk || "risk unknown"}`
      )
    );
    card.appendChild(el("h3", "", currentProposal.title || "Untitled proposal"));
    card.appendChild(el("p", "", shortReason(currentProposal.reason)));
    card.appendChild(el("p", "proposal-meta", proposalId || "missing-id"));

    if (currentProposal.status === "proposed") {
      const button = el("button", "", isPending ? "Approving..." : "Approve");
      button.type = "button";
      button.disabled = isPending || !proposalId;
      button.addEventListener("click", () => approveProposal(proposalId));
      card.appendChild(button);
    }

    root.appendChild(card);
  }
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
  const world = await fetchJson("/api/world");
  renderWorld(world);
}

async function wakeBubbleBoy() {
  addChatMessage("system", "Waking Bubble Boy...");
  const data = await fetchJson("/api/wake", { method: "POST", body: "{}" });
  addChatMessage("bubble", data.speech || "Bubble Boy woke up silently. Suspicious.");
  renderWorld(data.world);
}


async function approveProposal(proposalId) {
  if (!proposalId || state.pendingApprovals.has(proposalId)) {
    return;
  }

  state.pendingApprovals.add(proposalId);
  if (state.world) {
    renderWorld(state.world);
  }

  addChatMessage("system", `Approving ${proposalId}...`);

  try {
    const data = await fetchJson("/api/approve", {
      method: "POST",
      body: JSON.stringify({ proposal_ref: proposalId }),
    });

    const changedFiles = Array.isArray(data.proposal.changed_files)
      ? data.proposal.changed_files
      : [];

    addChatMessage("system", `Applied proposal: ${data.proposal.title}`);

    if (changedFiles.length > 0) {
      addChatMessage(
        "system",
        `Changed files: ${changedFiles.map((path) => `bubble/${path}`).join(", ")}`
      );
    }

    if (data.reflection && data.reflection.speech) {
      addChatMessage("bubble", data.reflection.speech);
    }

    if (data.reflection && data.reflection.next_intent) {
      addChatMessage("system", `Next intent: ${data.reflection.next_intent}`);
    }

    renderWorld(data.world);
  } catch (error) {
    addChatMessage("system", `Approval failed: ${error.message}`);
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
  addChatMessage("system", "Routing request to Bubble Boy...");

  const data = await fetchJson("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  addChatMessage("bubble", data.speech || "Bubble Boy responded with suspicious silence.");
  if (data.proposal) {
    addChatMessage("system", `Proposal created: ${data.proposal.title}`);
  }
  renderWorld(data.world);
}

function wireEvents() {
  qs("#reload-toybox-button").addEventListener("click", () => {
    reloadToybox();
  });

  qs("#refresh-button").addEventListener("click", () => {
    refreshWorld().catch((error) => addChatMessage("system", error.message));
  });

  qs("#wake-button").addEventListener("click", () => {
    wakeBubbleBoy().catch((error) => addChatMessage("system", error.message));
  });

  qs("#chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = qs("#chat-input");
    const message = input.value.trim();
    if (!message) return;

    input.value = "";
    sendChatMessage(message).catch((error) => addChatMessage("system", error.message));
  });
}

wireEvents();
refreshWorld().catch((error) => addChatMessage("system", error.message));
