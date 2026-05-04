const elements = {
  deviceSelect: document.querySelector("#input-device"),
  connectButton: document.querySelector("#connect-button"),
  refreshButton: document.querySelector("#refresh-button"),
  inputProfileButtons: Array.from(document.querySelectorAll(".input-scene")),
  inputProfileSummary: document.querySelector("#input-profile-summary"),
  trackInputSelects: Array.from(document.querySelectorAll(".track-input-select")),
  trackArmButtons: Array.from(document.querySelectorAll(".track-arm-button")),
  monitorToggle: document.querySelector("#monitor-toggle"),
  monitorLevel: document.querySelector("#monitor-level"),
  monitorLevelValue: document.querySelector("#monitor-level-value"),
  monitorStatus: document.querySelector("#monitor-status"),
  inputModeStat: document.querySelector("#input-mode-stat"),
  monitorTypeStat: document.querySelector("#monitor-type-stat"),
  outputCueStat: document.querySelector("#output-cue-stat"),
  latencyStat: document.querySelector("#latency-stat"),
  channelInputName: document.querySelector("#channel-input-name"),
  statusText: document.querySelector("#status-text"),
  pitchText: document.querySelector("#pitch-text"),
  recordButton: document.querySelector("#record-button"),
  stopButton: document.querySelector("#stop-button"),
  playLastButton: document.querySelector("#play-last-button"),
  timerText: document.querySelector("#recording-timer"),
  levelText: document.querySelector("#level-text"),
  levelFill: document.querySelector("#level-fill"),
  visualizer: document.querySelector("#visualizer"),
  patternPlay: document.querySelector("#pattern-play"),
  patternStop: document.querySelector("#pattern-stop"),
  bpmControl: document.querySelector("#bpm-control"),
  bpmValue: document.querySelector("#bpm-value"),
  stepRows: Array.from(document.querySelectorAll(".step-row")),
  timelineRows: Array.from(document.querySelectorAll(".timeline-row")),
  clipPills: Array.from(document.querySelectorAll(".clip-pill")),
  stripFaders: Array.from(document.querySelectorAll(".strip-fader")),
  stripToggles: Array.from(document.querySelectorAll(".strip-toggle")),
  takeAudio: document.querySelector("#take-audio"),
  takePlayer: document.querySelector("#take-player"),
  takeEmpty: document.querySelector("#take-empty"),
  downloadLink: document.querySelector("#download-link"),
  presetDescription: document.querySelector("#preset-description"),
  assistantText: document.querySelector("#assistant-text"),
  quickStarts: Array.from(document.querySelectorAll(".quick-start-card")),
  presetPills: Array.from(document.querySelectorAll(".preset-pill")),
  modePills: Array.from(document.querySelectorAll(".mode-pill")),
  keySelect: document.querySelector("#key-select"),
  scaleSelect: document.querySelector("#scale-select"),
  targetNote: document.querySelector("#target-note"),
  tuneSummary: document.querySelector("#tune-summary"),
  workflowSteps: {
    connect: document.querySelector("#step-connect"),
    preset: document.querySelector("#step-preset"),
    record: document.querySelector("#step-record"),
    review: document.querySelector("#step-review"),
  },
  controls: {
    gate: document.querySelector("#gate-control"),
    deess: document.querySelector("#deess-control"),
    pitch: document.querySelector("#pitch-control"),
    air: document.querySelector("#air-control"),
    comp: document.querySelector("#comp-control"),
    retune: document.querySelector("#retune-control"),
    humanize: document.querySelector("#humanize-control"),
  },
  outputs: {
    gate: document.querySelector("#gate-value"),
    deess: document.querySelector("#deess-value"),
    pitch: document.querySelector("#pitch-value"),
    air: document.querySelector("#air-value"),
    comp: document.querySelector("#comp-value"),
    retune: document.querySelector("#retune-value"),
    humanize: document.querySelector("#humanize-value"),
  },
  navChips: Array.from(document.querySelectorAll(".nav-chip")),
};

const audioState = {
  stream: null,
  context: null,
  highPassFilter: null,
  analyser: null,
  gateGain: null,
  deessFilter: null,
  airFilter: null,
  tubeDrive: null,
  compressor: null,
  outputGain: null,
  monitorGain: null,
  mediaRecorder: null,
  recordingChunks: [],
  lastTakeUrl: null,
  animationFrame: null,
  pitchBlend: 0.58,
  activeProfile: null,
};

const sequencerState = {
  context: null,
  masterGain: null,
  noiseBuffer: null,
  isPlaying: false,
  timer: null,
  currentStep: -1,
  bpm: 118,
  lanes: {
    kick: { steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0], gain: null },
    snare: { steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], gain: null },
    hat: { steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], gain: null },
    keys: { steps: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], gain: null },
  },
};

const mixerState = {
  vocal: { level: 0.92, muted: false },
  kick: { level: 0.84, muted: false },
  snare: { level: 0.76, muted: false },
  hat: { level: 0.62, muted: false },
  keys: { level: 0.68, muted: false },
  master: { level: 0.88, muted: false },
};

const tuningState = {
  key: "C",
  scale: "major",
  mode: "natural",
  retune: 0.68,
  humanize: 0.34,
  detectedFrequency: null,
};

let recordingStart = 0;
let selectedPreset = "clean-vocal";
let hasRecordedTake = false;
let selectedInputProfile = "vocal-mic";

const trackState = {
  lead: { name: "Track 1", typeLabel: "Audio Track 1", profile: "vocal-mic", armed: true },
  beat: { name: "Track 2", typeLabel: "Audio Track 2", profile: "drum-machine", armed: false },
  bass: { name: "Track 3", typeLabel: "Audio Track 3", profile: "guitar-di", armed: false },
  fx: { name: "Track 4", typeLabel: "Audio Track 4", profile: "aux-line", armed: false },
};

const inputProfiles = {
  "vocal-mic": {
    label: "Vocal Mic",
    summary: "Vocal Mic is ready for a mono microphone through your interface with processed live monitoring.",
    assistant: "Use Vocal Mic for singing, rap, and spoken voice through an interface preamp. Keep the source close and monitor through headphones.",
    preset: "clean-vocal",
    channelMode: "mono",
    channelCount: 1,
    latency: "Low",
    monitor: "Processed",
    cue: "Main phones",
    highPass: 95,
    airBias: 1,
    deessBias: 1,
  },
  "guitar-di": {
    label: "Guitar DI",
    summary: "Guitar DI keeps the path mono and cleaner for direct electric guitar or amp-modeler feeds.",
    assistant: "Use Guitar DI for instrument-level sources through your interface. Start clean, then build tone with the rack and mixer.",
    preset: "instrument-di",
    channelMode: "mono",
    channelCount: 1,
    latency: "Low",
    monitor: "Processed",
    cue: "Main phones",
    highPass: 70,
    airBias: 0.55,
    deessBias: 0.2,
  },
  "bass-di": {
    label: "Bass DI",
    summary: "Bass DI holds onto low-end and keeps vocal-style brightening out of the way for bass tracking.",
    assistant: "Use Bass DI when the instrument needs weight more than sparkle. The chain backs off the airy top and keeps monitoring solid.",
    preset: "instrument-di",
    channelMode: "mono",
    channelCount: 1,
    latency: "Low",
    monitor: "Processed",
    cue: "Main phones",
    highPass: 42,
    airBias: 0.35,
    deessBias: 0.1,
  },
  "keys-stereo": {
    label: "Keys Stereo",
    summary: "Keys Stereo asks for two channels when available so hardware keyboards and workstations feel more natural.",
    assistant: "Use Keys Stereo for stereo outputs from keyboards, synths, or pianos. Monitoring stays wider and the chain stays cleaner.",
    preset: "instrument-di",
    channelMode: "stereo",
    channelCount: 2,
    latency: "Balanced",
    monitor: "Stereo line",
    cue: "Main phones",
    highPass: 35,
    airBias: 0.4,
    deessBias: 0.05,
  },
  "drum-machine": {
    label: "Drum Machine",
    summary: "Drum Machine is tuned for stereo aux feeds from grooveboxes, samplers, and external beat makers.",
    assistant: "Use Drum Machine for stereo aux outputs from drum gear. The path avoids vocal-style shaping so transients stay punchy.",
    preset: "instrument-di",
    channelMode: "stereo",
    channelCount: 2,
    latency: "Balanced",
    monitor: "Stereo line",
    cue: "Main phones",
    highPass: 28,
    airBias: 0.25,
    deessBias: 0,
  },
  "aux-line": {
    label: "Aux Line",
    summary: "Aux Line is the general stereo utility path for interfaces, mixers, samplers, and external playback rigs.",
    assistant: "Use Aux Line for any general-purpose stereo feed that should stay clean and easy to monitor without vocal cleanup getting in the way.",
    preset: "instrument-di",
    channelMode: "stereo",
    channelCount: 2,
    latency: "Balanced",
    monitor: "Stereo line",
    cue: "Main phones",
    highPass: 30,
    airBias: 0.3,
    deessBias: 0,
  },
};

const presets = {
  "clean-vocal": {
    values: { gate: 28, deess: 42, pitch: 58, air: 64, comp: 48 },
    tuning: { retune: 58, humanize: 46, key: "C", scale: "major", mode: "natural" },
    description: "Clean Vocal keeps the chain balanced so most singers can record immediately without fighting the software.",
    assistant: "Use this when you want a polished vocal quickly. Connect input, test the level, then record before tweaking.",
  },
  "pop-tune": {
    values: { gate: 32, deess: 36, pitch: 82, air: 74, comp: 58 },
    tuning: { retune: 86, humanize: 18, key: "A", scale: "minor", mode: "hard" },
    description: "Pop Tune pushes the pitch-assist feel forward for tighter melodic vocals and a brighter top end.",
    assistant: "This preset is the closest to a modern AutoTune-style feel in this prototype. Keep the singer close to the mic for best pitch readout.",
  },
  "warm-condenser": {
    values: { gate: 24, deess: 44, pitch: 46, air: 68, comp: 54 },
    tuning: { retune: 42, humanize: 62, key: "D", scale: "major", mode: "natural" },
    description: "Warm Condenser adds shine and thickness for a rich studio-vocal character without over-tight tuning.",
    assistant: "Try this when the vocal needs more expensive-sounding presence. It adds sparkle while keeping the performance natural.",
  },
  "instrument-di": {
    values: { gate: 18, deess: 8, pitch: 12, air: 28, comp: 34 },
    tuning: { retune: 8, humanize: 74, key: "E", scale: "minor", mode: "natural" },
    description: "Instrument DI pulls back the vocal shaping so guitars, bass, and keys can come through cleaner.",
    assistant: "This is the easiest starting point for direct instruments through an interface. Monitoring should feel cleaner and less hyped.",
  },
  "podcast-clean": {
    values: { gate: 34, deess: 48, pitch: 10, air: 26, comp: 62 },
    tuning: { retune: 0, humanize: 84, key: "C", scale: "chromatic", mode: "natural" },
    description: "Podcast Clean focuses on speech clarity and consistency with less sparkle and almost no pitch effect.",
    assistant: "For spoken voice, keep the pitch-assist low and let the compression and de-ess controls do most of the work.",
  },
};

function updateStatus(text) {
  elements.statusText.textContent = text;
}

function updateOutputLabels() {
  Object.entries(elements.controls).forEach(([key, input]) => {
    elements.outputs[key].textContent = `${input.value}%`;
  });
}

function setActiveModeButtons(mode) {
  elements.modePills.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
}

function updateTuneSummary() {
  const retunePercent = Math.round(tuningState.retune * 100);
  const humanizePercent = Math.round(tuningState.humanize * 100);
  const modeLabel = tuningState.mode === "hard" ? "Hard Tune" : "Natural";
  elements.tuneSummary.textContent = `${modeLabel} mode in ${tuningState.key} ${tuningState.scale} with ${retunePercent}% retune speed and ${humanizePercent}% humanize.`;
}

function updateMonitorState() {
  const level = Number(elements.monitorLevel?.value || 0) / 100;
  const enabled = Boolean(elements.monitorToggle?.checked);
  const [, armedTrack] = getArmedTrackEntry();

  if (elements.monitorLevelValue) {
    elements.monitorLevelValue.textContent = `${Math.round(level * 100)}%`;
  }

  if (elements.monitorStatus) {
    elements.monitorStatus.textContent = enabled ? `${armedTrack.name} live ${Math.round(level * 100)}%` : `${armedTrack.name} monitor off`;
  }

  if (audioState.monitorGain && audioState.context) {
    audioState.monitorGain.gain.setTargetAtTime(enabled ? level : 0, audioState.context.currentTime, 0.01);
  }
}

function getSelectedInputProfile() {
  return inputProfiles[selectedInputProfile] || inputProfiles["vocal-mic"];
}

function getArmedTrackEntry() {
  const armedEntry = Object.entries(trackState).find(([, track]) => track.armed);
  return armedEntry || ["lead", trackState.lead];
}

function updateTrackRoutingUI() {
  Object.entries(trackState).forEach(([trackId, track]) => {
    const profile = inputProfiles[track.profile];
    const nameNode = document.querySelector(`[data-track-name="${trackId}"]`);
    const typeNode = document.querySelector(`[data-track-type="${trackId}"]`);
    const armButton = elements.trackArmButtons.find((button) => button.dataset.track === trackId);
    const inputSelect = elements.trackInputSelects.find((select) => select.dataset.track === trackId);
    const meta = document.querySelector(`[data-track-meta="${trackId}"]`);

    if (nameNode) {
      nameNode.textContent = track.name;
    }

    if (typeNode) {
      typeNode.textContent = `${track.typeLabel} · ${profile.label}`;
    }

    if (armButton) {
      armButton.classList.toggle("active", track.armed);
      armButton.textContent = track.armed ? "Armed" : "Arm";
    }

    if (inputSelect) {
      inputSelect.value = track.profile;
    }

    if (meta) {
      meta.classList.toggle("armed", track.armed);
    }
  });

  const [, armedTrack] = getArmedTrackEntry();
  const armedProfile = inputProfiles[armedTrack.profile];

  if (elements.channelInputName) {
    elements.channelInputName.textContent = armedTrack.name;
  }

  const vocalStripName = document.querySelector('[data-strip-name="vocal"]');
  const vocalStripType = document.querySelector('[data-strip-type="vocal"]');
  if (vocalStripName) {
    vocalStripName.textContent = armedTrack.name;
  }
  if (vocalStripType) {
    vocalStripType.textContent = `Armed · ${armedProfile.label}`;
  }
}

function armTrack(trackId) {
  if (!trackState[trackId]) {
    return;
  }

  Object.keys(trackState).forEach((key) => {
    trackState[key].armed = key === trackId;
  });

  updateTrackRoutingUI();
  applyInputProfile(trackState[trackId].profile);
}

function updateInputProfileUI() {
  const profile = getSelectedInputProfile();
  elements.inputProfileButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.inputProfile === selectedInputProfile);
  });

  if (elements.inputProfileSummary) {
    elements.inputProfileSummary.textContent = profile.summary;
  }

  if (elements.inputModeStat) {
    elements.inputModeStat.textContent = profile.channelMode === "stereo" ? "Stereo record" : "Mono record";
  }

  if (elements.monitorTypeStat) {
    elements.monitorTypeStat.textContent = profile.monitor;
  }

  if (elements.outputCueStat) {
    elements.outputCueStat.textContent = profile.cue;
  }

  if (elements.latencyStat) {
    elements.latencyStat.textContent = profile.latency;
  }

  updateTrackRoutingUI();
}

function applyInputProfile(profileName, options = {}) {
  const profile = inputProfiles[profileName];
  if (!profile) {
    return;
  }

  selectedInputProfile = profileName;
  updateInputProfileUI();

  if (options.syncPreset !== false && profile.preset && profile.preset !== selectedPreset) {
    applyPreset(profile.preset);
  }

  if (!options.quiet && elements.assistantText) {
    elements.assistantText.textContent = profile.assistant;
  }

  if (audioState.highPassFilter && audioState.context) {
    audioState.highPassFilter.frequency.setTargetAtTime(profile.highPass, audioState.context.currentTime, 0.02);
  }

  if (audioState.context) {
    applyEffectSettings();
    updateMonitorState();
  }
}

function noteNumberToName(noteNumber) {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteIndex = ((noteNumber % 12) + 12) % 12;
  const octave = Math.floor(noteNumber / 12) - 1;
  return `${noteNames[noteIndex]}${octave}`;
}

function getScaleIntervals(scale) {
  if (scale === "major") {
    return [0, 2, 4, 5, 7, 9, 11];
  }
  if (scale === "minor") {
    return [0, 2, 3, 5, 7, 8, 10];
  }
  if (scale === "pentatonic") {
    return [0, 2, 4, 7, 9];
  }
  return Array.from({ length: 12 }, (_, index) => index);
}

function getTargetNoteInfo(frequency) {
  if (!Number.isFinite(frequency) || frequency <= 0) {
    return { label: `${tuningState.key} ${tuningState.scale} ready`, cents: null };
  }

  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const keyIndex = noteNames.indexOf(tuningState.key);
  const scaleIntervals = getScaleIntervals(tuningState.scale);
  const midiEstimate = Math.round(12 * Math.log2(frequency / 440) + 69);

  let bestNote = midiEstimate;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let octave = -2; octave <= 8; octave += 1) {
    scaleIntervals.forEach((interval) => {
      const candidate = (octave + 1) * 12 + keyIndex + interval;
      const distance = Math.abs(candidate - midiEstimate);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestNote = candidate;
      }
    });
  }

  const targetFrequency = 440 * 2 ** ((bestNote - 69) / 12);
  const cents = Math.round(1200 * Math.log2(frequency / targetFrequency));
  return {
    label: noteNumberToName(bestNote),
    cents,
  };
}

function setActivePresetButtons(presetName) {
  elements.presetPills.forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === presetName);
  });
}

function updateWorkflowUI() {
  const isConnected = Boolean(audioState.context);
  const isRecording = audioState.mediaRecorder?.state === "recording";

  Object.values(elements.workflowSteps).forEach((step) => {
    step.classList.remove("current", "done");
  });

  if (isConnected) {
    elements.workflowSteps.connect.classList.add("done");
  } else {
    elements.workflowSteps.connect.classList.add("current");
  }

  if (selectedPreset) {
    elements.workflowSteps.preset.classList.add(isConnected ? "done" : "current");
  }

  if (isConnected && !hasRecordedTake && !isRecording) {
    elements.workflowSteps.record.classList.add("current");
  }

  if (isRecording || hasRecordedTake) {
    elements.workflowSteps.record.classList.add("done");
  }

  if (hasRecordedTake) {
    elements.workflowSteps.review.classList.add("current");
  }
}

function applyPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) {
    return;
  }

  selectedPreset = presetName;

  Object.entries(preset.values).forEach(([key, value]) => {
    elements.controls[key].value = String(value);
  });

  Object.entries(preset.tuning).forEach(([key, value]) => {
    if (key === "key") {
      elements.keySelect.value = value;
      tuningState.key = value;
    } else if (key === "scale") {
      elements.scaleSelect.value = value;
      tuningState.scale = value;
    } else if (key === "mode") {
      tuningState.mode = value;
    } else if (elements.controls[key]) {
      elements.controls[key].value = String(value);
      tuningState[key] = Number(value) / 100;
    }
  });

  updateOutputLabels();
  applyEffectSettings();
  setActivePresetButtons(presetName);
  setActiveModeButtons(tuningState.mode);
  elements.targetNote.textContent = `${tuningState.key} ${tuningState.scale} ready`;
  updateTuneSummary();
  elements.presetDescription.textContent = preset.description;
  elements.assistantText.textContent = preset.assistant;
  updateWorkflowUI();
}

function updateMixerReadout(strip, level) {
  const readout = document.querySelector(`[data-readout="${strip}"]`);
  if (readout) {
    readout.textContent = `${Math.round(level * 100)}%`;
  }
}

function applyMixerState() {
  if (audioState.outputGain) {
    const vocalLevel = mixerState.vocal.muted ? 0 : mixerState.vocal.level;
    const masterLevel = mixerState.master.muted ? 0 : mixerState.master.level;
    audioState.outputGain.gain.value = vocalLevel * masterLevel;
  }

  if (sequencerState.masterGain) {
    sequencerState.masterGain.gain.value = mixerState.master.muted ? 0 : mixerState.master.level;
  }

  ["kick", "snare", "hat", "keys"].forEach((lane) => {
    if (sequencerState.lanes[lane].gain) {
      sequencerState.lanes[lane].gain.gain.value = mixerState[lane].muted ? 0 : mixerState[lane].level;
    }
  });
}

function updateStepHighlights(currentStep) {
  document.querySelectorAll(".step-button").forEach((button) => {
    button.classList.toggle("current", Number(button.dataset.step) === currentStep);
  });
}

function buildStepGrid() {
  elements.stepRows.forEach((row) => {
    const lane = row.dataset.lane;
    const container = row.querySelector(".step-buttons");
    container.innerHTML = "";

    sequencerState.lanes[lane].steps.forEach((isActive, stepIndex) => {
      const button = document.createElement("button");
      button.className = `step-button${isActive ? " active" : ""}`;
      button.type = "button";
      button.dataset.lane = lane;
      button.dataset.step = String(stepIndex);
      button.setAttribute("aria-label", `${lane} step ${stepIndex + 1}`);
      container.append(button);
    });
  });
}

function buildTimelineGrid() {
  elements.timelineRows.forEach((row) => {
    row.innerHTML = "";
    for (let index = 0; index < 8; index += 1) {
      const slot = document.createElement("div");
      slot.className = "timeline-slot";
      slot.dataset.slot = String(index);
      slot.dataset.lane = row.dataset.lane;
      row.append(slot);
    }
  });
}

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  return buffer;
}

async function getPlaybackContext() {
  let context = audioState.context;

  if (!context || context.state === "closed") {
    if (!sequencerState.context || sequencerState.context.state === "closed") {
      sequencerState.context = new AudioContext();
    }
    context = sequencerState.context;
  }

  if (context.state === "suspended") {
    await context.resume();
  }

  if (sequencerState.context !== context || !sequencerState.masterGain) {
    sequencerState.context = context;
    sequencerState.masterGain = context.createGain();
    sequencerState.masterGain.connect(context.destination);
    sequencerState.noiseBuffer = createNoiseBuffer(context);

    ["kick", "snare", "hat", "keys"].forEach((lane) => {
      const laneGain = context.createGain();
      laneGain.connect(sequencerState.masterGain);
      sequencerState.lanes[lane].gain = laneGain;
    });
  }

  applyMixerState();
  return context;
}

function triggerKick(context, when) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(140, when);
  oscillator.frequency.exponentialRampToValueAtTime(44, when + 0.16);
  gain.gain.setValueAtTime(0.001, when);
  gain.gain.exponentialRampToValueAtTime(1, when + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.26);
  oscillator.connect(gain);
  gain.connect(sequencerState.lanes.kick.gain);
  oscillator.start(when);
  oscillator.stop(when + 0.28);
}

function triggerSnare(context, when) {
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = sequencerState.noiseBuffer;
  const bandPass = context.createBiquadFilter();
  bandPass.type = "bandpass";
  bandPass.frequency.value = 1800;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.001, when);
  gain.gain.exponentialRampToValueAtTime(0.7, when + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.18);
  noiseSource.connect(bandPass);
  bandPass.connect(gain);
  gain.connect(sequencerState.lanes.snare.gain);
  noiseSource.start(when);
  noiseSource.stop(when + 0.2);
}

function triggerHat(context, when) {
  const noiseSource = context.createBufferSource();
  noiseSource.buffer = sequencerState.noiseBuffer;
  const highPass = context.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.value = 6800;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.001, when);
  gain.gain.exponentialRampToValueAtTime(0.22, when + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.06);
  noiseSource.connect(highPass);
  highPass.connect(gain);
  gain.connect(sequencerState.lanes.hat.gain);
  noiseSource.start(when);
  noiseSource.stop(when + 0.07);
}

function triggerKeys(context, when) {
  const notes = [261.63, 329.63, 392];
  notes.forEach((frequency) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.001, when);
    gain.gain.exponentialRampToValueAtTime(0.18, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.28);
    oscillator.connect(gain);
    gain.connect(sequencerState.lanes.keys.gain);
    oscillator.start(when);
    oscillator.stop(when + 0.3);
  });
}

async function runPatternStep() {
  const context = await getPlaybackContext();
  const stepIndex = sequencerState.currentStep;
  updateStepHighlights(stepIndex);

  Object.entries(sequencerState.lanes).forEach(([lane, data]) => {
    if (!data.steps[stepIndex]) {
      return;
    }

    const when = context.currentTime + 0.01;
    if (lane === "kick") {
      triggerKick(context, when);
    } else if (lane === "snare") {
      triggerSnare(context, when);
    } else if (lane === "hat") {
      triggerHat(context, when);
    } else if (lane === "keys") {
      triggerKeys(context, when);
    }
  });

  sequencerState.currentStep = (stepIndex + 1) % 16;
}

async function startPatternPlayback() {
  await getPlaybackContext();
  stopPatternPlayback();
  sequencerState.isPlaying = true;
  sequencerState.currentStep = 0;
  const intervalMs = (60 / sequencerState.bpm / 4) * 1000;
  await runPatternStep();
  sequencerState.timer = window.setInterval(runPatternStep, intervalMs);
  elements.assistantText.textContent = "Pattern playback is live. Use the mixer strips to balance the groove quickly like a starter beat sketchpad.";
}

function stopPatternPlayback() {
  if (sequencerState.timer) {
    window.clearInterval(sequencerState.timer);
    sequencerState.timer = null;
  }
  sequencerState.isPlaying = false;
  sequencerState.currentStep = -1;
  updateStepHighlights(-1);
}

function placeClip(slot, label) {
  slot.innerHTML = "";
  const clip = document.createElement("div");
  clip.className = "timeline-clip";
  clip.draggable = true;
  clip.dataset.clip = label;
  clip.textContent = label;
  slot.append(clip);
}

function updateToggleButton(button, muted) {
  button.classList.toggle("active", !muted);
  button.textContent = muted ? "Muted" : "On";
}

function createTubeCurve(amount) {
  const sampleCount = 2048;
  const curve = new Float32Array(sampleCount);
  const drive = 1 + amount * 4;

  for (let index = 0; index < sampleCount; index += 1) {
    const x = (index * 2) / sampleCount - 1;
    curve[index] = Math.tanh(drive * x);
  }

  return curve;
}

async function listDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    updateStatus("Media devices unavailable");
    return;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter((device) => device.kind === "audioinput");
    elements.deviceSelect.innerHTML = "";

    if (!inputs.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No input devices found";
      elements.deviceSelect.append(option);
      elements.connectButton.disabled = true;
      return;
    }

    inputs.forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label || `Input ${index + 1}`;
      elements.deviceSelect.append(option);
    });

    elements.connectButton.disabled = false;
  } catch (error) {
    updateStatus("Device list blocked");
    console.error(error);
  }
}

function applyEffectSettings() {
  if (!audioState.context) {
    return;
  }

  const profile = getSelectedInputProfile();

  const gateValue = Number(elements.controls.gate.value) / 100;
  const deessValue = Number(elements.controls.deess.value) / 100;
  const pitchValue = Number(elements.controls.pitch.value) / 100;
  const airValue = Number(elements.controls.air.value) / 100;
  const compValue = Number(elements.controls.comp.value) / 100;
  const retuneValue = Number(elements.controls.retune.value) / 100;
  const humanizeValue = Number(elements.controls.humanize.value) / 100;
  const modeBoost = tuningState.mode === "hard" ? 1.2 : 0.82;
  const humanizeReduction = 1 - humanizeValue * 0.45;
  const tuneIntensity = Math.min(1, pitchValue * retuneValue * modeBoost * humanizeReduction + pitchValue * 0.2);

  tuningState.retune = retuneValue;
  tuningState.humanize = humanizeValue;
  audioState.pitchBlend = tuneIntensity;

  if (audioState.deessFilter) {
    audioState.deessFilter.gain.value = -14 * deessValue * profile.deessBias;
  }

  if (audioState.airFilter) {
    audioState.airFilter.gain.value = 10 * airValue * profile.airBias;
  }

  if (audioState.compressor) {
    audioState.compressor.threshold.value = -30 - compValue * 18;
    audioState.compressor.ratio.value = 2 + compValue * 8;
    audioState.compressor.attack.value = 0.003 + compValue * 0.015;
    audioState.compressor.release.value = 0.08 + compValue * 0.22;
  }

  if (audioState.tubeDrive) {
    audioState.tubeDrive.curve = createTubeCurve(compValue * 0.5 + airValue * 0.3 + tuneIntensity * 0.3);
    audioState.tubeDrive.oversample = "4x";
  }

  elements.recordButton.dataset.gateThreshold = String(0.025 + gateValue * 0.2);
  updateTuneSummary();
}

function teardownAudio() {
  const closingContext = audioState.context;
  cancelAnimationFrame(audioState.animationFrame);
  stopPatternPlayback();

  if (audioState.mediaRecorder?.state === "recording") {
    audioState.mediaRecorder.stop();
  }

  audioState.stream?.getTracks().forEach((track) => track.stop());
  audioState.context?.close();

  audioState.stream = null;
  audioState.context = null;
  audioState.highPassFilter = null;
  audioState.analyser = null;
  audioState.gateGain = null;
  audioState.deessFilter = null;
  audioState.airFilter = null;
  audioState.tubeDrive = null;
  audioState.compressor = null;
  audioState.outputGain = null;
  audioState.monitorGain = null;
  audioState.mediaRecorder = null;
  if (sequencerState.context === closingContext) {
    sequencerState.context = null;
    sequencerState.masterGain = null;
    sequencerState.noiseBuffer = null;
    ["kick", "snare", "hat", "keys"].forEach((lane) => {
      sequencerState.lanes[lane].gain = null;
    });
  }
  updateMonitorState();
  updateWorkflowUI();
}

async function connectInput() {
  if (!navigator.mediaDevices?.getUserMedia) {
    updateStatus("getUserMedia not supported");
    return;
  }

  try {
    teardownAudio();

    const deviceId = elements.deviceSelect.value;
    const profile = getSelectedInputProfile();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: { ideal: profile.channelCount },
      },
    });

    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const highPass = context.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = profile.highPass;

    const gateGain = context.createGain();
    const deessFilter = context.createBiquadFilter();
    deessFilter.type = "peaking";
    deessFilter.frequency.value = 6100;
    deessFilter.Q.value = 1.1;

    const airFilter = context.createBiquadFilter();
    airFilter.type = "highshelf";
    airFilter.frequency.value = 7200;

    const tubeDrive = context.createWaveShaper();
    const compressor = context.createDynamicsCompressor();
    compressor.knee.value = 28;

    const outputGain = context.createGain();
    outputGain.gain.value = 0.92;

    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;

    const monitorGain = context.createGain();
    monitorGain.gain.value = 0;

    source.connect(highPass);
    highPass.connect(gateGain);
    gateGain.connect(deessFilter);
    deessFilter.connect(airFilter);
    airFilter.connect(tubeDrive);
    tubeDrive.connect(compressor);
    compressor.connect(outputGain);
    outputGain.connect(analyser);
    outputGain.connect(monitorGain);
    monitorGain.connect(context.destination);

    const recorderDestination = context.createMediaStreamDestination();
    outputGain.connect(recorderDestination);

    const mediaRecorder = new MediaRecorder(recorderDestination.stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) {
        audioState.recordingChunks.push(event.data);
      }
    };
    mediaRecorder.onstop = finalizeRecording;

    audioState.stream = stream;
    audioState.context = context;
    audioState.highPassFilter = highPass;
    audioState.analyser = analyser;
    audioState.gateGain = gateGain;
    audioState.deessFilter = deessFilter;
    audioState.airFilter = airFilter;
    audioState.tubeDrive = tubeDrive;
    audioState.compressor = compressor;
    audioState.outputGain = outputGain;
    audioState.monitorGain = monitorGain;
    audioState.mediaRecorder = mediaRecorder;
    audioState.activeProfile = profile.label;

    applyEffectSettings();
    applyMixerState();
    updateMonitorState();
    startVisualization();
    updateStatus("Input connected");
    elements.assistantText.textContent = `${profile.label} is live on ${getArmedTrackEntry()[1].name}. Set monitor level, test the source, and then record when the meter feels healthy.`;
    updateInputProfileUI();
    updateWorkflowUI();
    await listDevices();
  } catch (error) {
    updateStatus("Permission denied or interface busy");
    console.error(error);
  }
}

function placeRecordedTakeClip() {
  const [armedTrackId, armedTrack] = getArmedTrackEntry();
  const slots = Array.from(document.querySelectorAll(`.timeline-row[data-lane="${armedTrackId}"] .timeline-slot`));
  const targetSlot = slots.find((slot) => !slot.querySelector(".timeline-clip")) || slots[0];
  if (targetSlot) {
    placeClip(targetSlot, `${armedTrack.name} Take`);
  }
}

function finalizeRecording() {
  const blob = new Blob(audioState.recordingChunks, { type: "audio/webm" });
  audioState.recordingChunks = [];
  const [, armedTrack] = getArmedTrackEntry();

  if (audioState.lastTakeUrl) {
    URL.revokeObjectURL(audioState.lastTakeUrl);
  }

  audioState.lastTakeUrl = URL.createObjectURL(blob);
  elements.takeAudio.src = audioState.lastTakeUrl;
  elements.downloadLink.href = audioState.lastTakeUrl;
  elements.downloadLink.download = `${armedTrack.name.toLowerCase().replace(/\s+/g, "-")}-take.webm`;
  elements.takeEmpty.classList.add("hidden");
  elements.takePlayer.classList.remove("hidden");
  elements.playLastButton.disabled = false;
  elements.recordButton.disabled = false;
  elements.stopButton.disabled = true;
  elements.timerText.textContent = "Take captured. Review or download it below.";
  updateStatus("Take ready");
  hasRecordedTake = true;
  placeRecordedTakeClip();
  elements.assistantText.textContent = `${armedTrack.name} captured cleanly. Play it back, then adjust one control at a time so it stays easy to dial in.`;
  updateWorkflowUI();
}

function startRecording() {
  if (!audioState.mediaRecorder || audioState.mediaRecorder.state !== "inactive") {
    updateStatus("Connect an input first");
    return;
  }

  audioState.recordingChunks = [];
  recordingStart = performance.now();
  hasRecordedTake = false;
  const [, armedTrack] = getArmedTrackEntry();
  audioState.mediaRecorder.start();
  elements.recordButton.disabled = true;
  elements.stopButton.disabled = false;
  elements.timerText.textContent = `Recording ${armedTrack.name}... keep the performance steady.`;
  updateStatus(`Recording ${armedTrack.name}`);
  elements.assistantText.textContent = `${armedTrack.name} is armed and recording. Focus on the performance first and ignore the controls until the take is done.`;
  updateWorkflowUI();
}

function stopRecording() {
  if (audioState.mediaRecorder?.state === "recording") {
    audioState.mediaRecorder.stop();
  }
}

function noteFromFrequency(frequency) {
  if (!Number.isFinite(frequency) || frequency <= 0) {
    return "--";
  }

  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteNumber = Math.round(12 * Math.log2(frequency / 440) + 69);
  const noteIndex = ((noteNumber % 12) + 12) % 12;
  const octave = Math.floor(noteNumber / 12) - 1;
  const nearestFrequency = 440 * 2 ** ((noteNumber - 69) / 12);
  const cents = Math.round(1200 * Math.log2(frequency / nearestFrequency));
  const sign = cents > 0 ? "+" : "";
  return `${noteNames[noteIndex]}${octave} ${sign}${cents}c`;
}

function autoCorrelate(buffer, sampleRate) {
  let rms = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    rms += buffer[index] * buffer[index];
  }

  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.01) {
    return null;
  }

  let bestOffset = -1;
  let bestCorrelation = 0;
  const minSamples = Math.floor(sampleRate / 1000);
  const maxSamples = Math.floor(sampleRate / 70);

  for (let offset = minSamples; offset <= maxSamples; offset += 1) {
    let correlation = 0;
    for (let index = 0; index < buffer.length - offset; index += 1) {
      correlation += Math.abs(buffer[index] - buffer[index + offset]);
    }

    correlation = 1 - correlation / (buffer.length - offset);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestCorrelation > 0.9 && bestOffset > 0) {
    return sampleRate / bestOffset;
  }

  return null;
}

function smoothGate(level) {
  if (!audioState.gateGain || !audioState.context) {
    return;
  }

  const threshold = Number(elements.recordButton.dataset.gateThreshold || 0.06);
  const desiredGain = level > threshold ? 1 : 0.18;
  audioState.gateGain.gain.setTargetAtTime(desiredGain, audioState.context.currentTime, 0.05);
}

function startVisualization() {
  if (!audioState.analyser || !audioState.context) {
    return;
  }

  const canvas = elements.visualizer;
  const context2d = canvas.getContext("2d");
  const buffer = new Float32Array(audioState.analyser.fftSize);

  const render = () => {
    audioState.analyser.getFloatTimeDomainData(buffer);

    let peak = 0;
    for (let index = 0; index < buffer.length; index += 1) {
      peak = Math.max(peak, Math.abs(buffer[index]));
    }

    const db = peak > 0 ? 20 * Math.log10(peak) : -Infinity;
    const meterValue = Math.min(100, Math.max(0, ((db + 60) / 60) * 100));
    elements.levelFill.style.width = `${meterValue}%`;
    elements.levelText.textContent = Number.isFinite(db) ? `${db.toFixed(1)} dB` : "-inf dB";
    smoothGate(peak);

    const detectedPitch = autoCorrelate(buffer, audioState.context.sampleRate);
    tuningState.detectedFrequency = detectedPitch;
    elements.pitchText.textContent = noteFromFrequency(detectedPitch);
    const targetInfo = getTargetNoteInfo(detectedPitch);
    if (targetInfo.cents === null) {
      elements.targetNote.textContent = targetInfo.label;
    } else {
      const centsLabel = targetInfo.cents > 0 ? `+${targetInfo.cents}` : `${targetInfo.cents}`;
      elements.targetNote.textContent = `${targetInfo.label} target (${centsLabel}c)`;
    }

    context2d.clearRect(0, 0, canvas.width, canvas.height);
    context2d.fillStyle = "#09111f";
    context2d.fillRect(0, 0, canvas.width, canvas.height);

    context2d.strokeStyle = "rgba(126, 240, 223, 0.18)";
    context2d.lineWidth = 1;
    for (let line = 1; line < 6; line += 1) {
      const y = (canvas.height / 6) * line;
      context2d.beginPath();
      context2d.moveTo(0, y);
      context2d.lineTo(canvas.width, y);
      context2d.stroke();
    }

    context2d.beginPath();
    context2d.lineWidth = 3;
    const gradient = context2d.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#7ef0df");
    gradient.addColorStop(0.5, "#ffd67b");
    gradient.addColorStop(1, "#ff8c72");
    context2d.strokeStyle = gradient;

    for (let index = 0; index < buffer.length; index += 1) {
      const x = (index / (buffer.length - 1)) * canvas.width;
      const shapedSample =
        buffer[index] * (0.72 + audioState.pitchBlend * 0.28) +
        Math.sin(index * 0.015) * 0.012 * audioState.pitchBlend;
      const y = (0.5 + shapedSample * 0.45) * canvas.height;

      if (index === 0) {
        context2d.moveTo(x, y);
      } else {
        context2d.lineTo(x, y);
      }
    }

    context2d.stroke();

    if (audioState.mediaRecorder?.state === "recording") {
      const elapsedSeconds = Math.floor((performance.now() - recordingStart) / 1000);
      const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
      const seconds = String(elapsedSeconds % 60).padStart(2, "0");
      elements.timerText.textContent = `Recording... ${minutes}:${seconds}`;
    }

    audioState.animationFrame = requestAnimationFrame(render);
  };

  render();
}

function attachEvents() {
  elements.connectButton.addEventListener("click", connectInput);
  elements.refreshButton.addEventListener("click", listDevices);
  elements.recordButton.addEventListener("click", startRecording);
  elements.stopButton.addEventListener("click", stopRecording);
  elements.playLastButton.addEventListener("click", () => elements.takeAudio.play());
  elements.patternPlay.addEventListener("click", startPatternPlayback);
  elements.patternStop.addEventListener("click", stopPatternPlayback);

  elements.monitorToggle.addEventListener("change", updateMonitorState);
  elements.monitorLevel.addEventListener("input", updateMonitorState);
  elements.inputProfileButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const [armedTrackId] = getArmedTrackEntry();
      trackState[armedTrackId].profile = button.dataset.inputProfile;
      updateTrackRoutingUI();
      applyInputProfile(button.dataset.inputProfile);
    });
  });
  elements.trackInputSelects.forEach((select) => {
    select.addEventListener("change", () => {
      const trackId = select.dataset.track;
      if (!trackState[trackId]) {
        return;
      }

      trackState[trackId].profile = select.value;
      updateTrackRoutingUI();
      if (trackState[trackId].armed) {
        applyInputProfile(select.value);
      }
    });
  });
  elements.trackArmButtons.forEach((button) => {
    button.addEventListener("click", () => {
      armTrack(button.dataset.track);
    });
  });

  elements.bpmControl.addEventListener("input", () => {
    sequencerState.bpm = Number(elements.bpmControl.value);
    elements.bpmValue.textContent = String(sequencerState.bpm);
    if (sequencerState.isPlaying) {
      startPatternPlayback();
    }
  });

  elements.stepRows.forEach((row) => {
    row.addEventListener("click", (event) => {
      const button = event.target.closest(".step-button");
      if (!button) {
        return;
      }

      const lane = button.dataset.lane;
      const step = Number(button.dataset.step);
      const nextValue = sequencerState.lanes[lane].steps[step] ? 0 : 1;
      sequencerState.lanes[lane].steps[step] = nextValue;
      button.classList.toggle("active", Boolean(nextValue));
    });
  });

  elements.stripFaders.forEach((fader) => {
    fader.addEventListener("input", () => {
      const strip = fader.dataset.strip;
      const level = Number(fader.value) / 100;
      mixerState[strip].level = level;
      updateMixerReadout(strip, level);
      applyMixerState();
    });
  });

  elements.stripToggles.forEach((button) => {
    const strip = button.closest(".mixer-strip")?.dataset.strip;
    updateToggleButton(button, mixerState[strip].muted);
    button.addEventListener("click", () => {
      mixerState[strip].muted = !mixerState[strip].muted;
      updateToggleButton(button, mixerState[strip].muted);
      applyMixerState();
    });
  });

  elements.modePills.forEach((button) => {
    button.addEventListener("click", () => {
      tuningState.mode = button.dataset.mode;
      setActiveModeButtons(tuningState.mode);
      applyEffectSettings();
    });
  });

  elements.keySelect.addEventListener("change", () => {
    tuningState.key = elements.keySelect.value;
    elements.targetNote.textContent = `${tuningState.key} ${tuningState.scale} ready`;
    updateTuneSummary();
  });

  elements.scaleSelect.addEventListener("change", () => {
    tuningState.scale = elements.scaleSelect.value;
    elements.targetNote.textContent = `${tuningState.key} ${tuningState.scale} ready`;
    updateTuneSummary();
  });

  const handleDragStart = (event) => {
    const clip = event.target.closest("[data-clip]");
    if (!clip) {
      return;
    }

    const sourceSlot = clip.closest(".timeline-slot");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        label: clip.dataset.clip,
        sourceLane: sourceSlot?.dataset.lane || null,
        sourceSlot: sourceSlot?.dataset.slot || null,
      }),
    );
  };

  elements.clipPills.forEach((clip) => {
    clip.addEventListener("dragstart", handleDragStart);
  });

  elements.timelineRows.forEach((row) => {
    row.addEventListener("dragstart", handleDragStart);
    row.addEventListener("dragover", (event) => {
      const slot = event.target.closest(".timeline-slot");
      if (!slot) {
        return;
      }

      event.preventDefault();
      slot.classList.add("over");
    });

    row.addEventListener("dragleave", (event) => {
      event.target.closest(".timeline-slot")?.classList.remove("over");
    });

    row.addEventListener("drop", (event) => {
      const slot = event.target.closest(".timeline-slot");
      if (!slot) {
        return;
      }

      event.preventDefault();
      slot.classList.remove("over");
      const payload = event.dataTransfer.getData("text/plain");
      if (!payload) {
        return;
      }

      let data;
      try {
        data = JSON.parse(payload);
      } catch (error) {
        return;
      }
      if (data.sourceLane && data.sourceSlot !== null) {
        const source = document.querySelector(`.timeline-slot[data-lane="${data.sourceLane}"][data-slot="${data.sourceSlot}"]`);
        if (source) {
          source.innerHTML = "";
        }
      }

      placeClip(slot, data.label);
      elements.assistantText.textContent = "Nice. Your playlist is taking shape. Drag more clips in or sketch a matching beat from the pattern rack.";
    });

    row.addEventListener("click", (event) => {
      const clip = event.target.closest(".timeline-clip");
      if (!clip) {
        return;
      }

      clip.parentElement.innerHTML = "";
    });
  });

  Object.values(elements.controls).forEach((input) => {
    input.addEventListener("input", () => {
      updateOutputLabels();
      applyEffectSettings();
    });
  });

  elements.presetPills.forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.preset);
    });
  });

  elements.quickStarts.forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.preset);
      document.getElementById("session")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  elements.navChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (!chip.dataset.target) {
        return;
      }

      elements.navChips.forEach((button) => button.classList.remove("active"));
      chip.classList.add("active");
      document.getElementById(chip.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  navigator.mediaDevices?.addEventListener?.("devicechange", listDevices);
  window.addEventListener("beforeunload", teardownAudio);
}

async function init() {
  buildStepGrid();
  buildTimelineGrid();
  updateOutputLabels();
  attachEvents();
  applyInputProfile(selectedInputProfile, { quiet: true });
  applyPreset(selectedPreset);
  updateTrackRoutingUI();
  updateMonitorState();
  elements.bpmValue.textContent = String(sequencerState.bpm);
  elements.stripFaders.forEach((fader) => {
    updateMixerReadout(fader.dataset.strip, Number(fader.value) / 100);
  });
  applyMixerState();
  updateWorkflowUI();
  await listDevices();
}

init();
