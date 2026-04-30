import { createFloorDraft } from "./floorSchema";

const STORAGE_KEY = "inovamap_floor_drafts_v1";

export function getFloorDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFloorDrafts(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function upsertFloorDraft(payload) {
  const drafts = getFloorDrafts();
  const draft = createFloorDraft(payload);
  const index = drafts.findIndex((item) => item.id === draft.id);

  if (index >= 0) {
    drafts[index] = {
      ...drafts[index],
      ...draft,
      updatedAt: new Date().toISOString(),
    };
  } else {
    drafts.unshift(draft);
  }

  saveFloorDrafts(drafts);
  return draft;
}

export function deleteFloorDraft(id) {
  const drafts = getFloorDrafts().filter((item) => item.id !== id);
  saveFloorDrafts(drafts);
  return drafts;
}

export function getFloorDraftById(id) {
  return getFloorDrafts().find((item) => item.id === id) || null;
}

export function updateFloorDraft(id, patch) {
  const drafts = getFloorDrafts();

  const nextDrafts = drafts.map((item) =>
    item.id === id
      ? {
          ...item,
          ...patch,
          updatedAt: new Date().toISOString(),
        }
      : item
  );

  saveFloorDrafts(nextDrafts);
  return nextDrafts.find((item) => item.id === id) || null;
}
