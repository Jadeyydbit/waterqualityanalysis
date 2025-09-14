const STORAGE_KEY = "rivers";

const DEFAULT_RIVERS = [
  {
    id: 1,
    slug: "mithi",
    location: "Mithi River",
    wqi: 48,
    status: "Moderate",
    ph: 7.1,
    oxygen: 4.5,
    temperature: 27,
    turbidity: 62,
    trend: "down",
  },
  {
    id: 2,
    slug: "godavari",
    location: "Godavari",
    wqi: 72,
    status: "Good",
    ph: 7.4,
    oxygen: 7.9,
    temperature: 25,
    turbidity: 30,
    trend: "up",
  },
  {
    id: 3,
    slug: "krishna",
    location: "Krishna",
    wqi: 66,
    status: "Moderate",
    ph: 7.0,
    oxygen: 6.2,
    temperature: 24,
    turbidity: 40,
    trend: "up",
  },
  {
    id: 4,
    slug: "tapi",
    location: "Tapi",
    wqi: 58,
    status: "Moderate",
    ph: 7.3,
    oxygen: 5.6,
    temperature: 26,
    turbidity: 50,
    trend: "down",
  },
];

function save(rivers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rivers));
  try {
    // Notify all tabs within this app
    window.dispatchEvent(new Event("rivers:updated"));
  } catch (e) {}
}

export function getRivers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      save(DEFAULT_RIVERS);
      return DEFAULT_RIVERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_RIVERS;
    return parsed;
  } catch (e) {
    return DEFAULT_RIVERS;
  }
}

export function addRiver(river) {
  const rivers = getRivers();
  const nextId = rivers.length
    ? Math.max(...rivers.map((r) => r.id || 0)) + 1
    : 1;
  const withId = { ...river, id: nextId };
  const updated = [...rivers, withId];
  save(updated);
  return withId;
}

export function deleteRiver(slug) {
  const rivers = getRivers();
  const updated = rivers.filter((r) => r.slug !== slug);
  save(updated);
  return updated;
}

export function upsertRiver(river, identifier) {
  const rivers = getRivers();
  const key = identifier || river.slug;
  const idx = rivers.findIndex((r) => r.slug === key);
  if (idx >= 0) {
    const preservedId = rivers[idx]?.id;
    rivers[idx] = { ...rivers[idx], ...river, id: preservedId };
    // If slug changed, ensure no duplicate entries with same slug remain
    const newSlug = rivers[idx].slug;
    for (let i = rivers.length - 1; i >= 0; i--) {
      if (i !== idx && rivers[i].slug === newSlug) rivers.splice(i, 1);
    }
    save(rivers);
    return rivers[idx];
  }
  return addRiver(river);
}

export function generateSlug(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getDefaultRivers() {
  return DEFAULT_RIVERS;
}
