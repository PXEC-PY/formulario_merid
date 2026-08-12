import type { FormData } from "../types/formData";

const KEY_PREFIX = "la-meridional-draft:";

export interface PersistedDraft {
  data: FormData;
  sectionIndex: number;
}

/** Per-form draft autosave in localStorage, keyed by `FormSchema.id` — so a reload (or
 * an accidental tab close) never loses what the user already typed. A draft is only
 * ever removed by an explicit action: downloading that form's PDF/zip (clearDraft), or
 * clicking the header logo to go back to the dashboard (clearAllDrafts). */
export function loadDraft(formId: string): PersistedDraft | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + formId);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedDraft;
  } catch {
    return null;
  }
}

export function saveDraft(formId: string, draft: PersistedDraft): void {
  try {
    localStorage.setItem(KEY_PREFIX + formId, JSON.stringify(draft));
  } catch {
    // Storage full or unavailable (private browsing, quota) — the form still works for
    // this session, it just won't survive a reload. Not worth surfacing as an error.
  }
}

export function clearDraft(formId: string): void {
  try {
    localStorage.removeItem(KEY_PREFIX + formId);
  } catch {
    // ignore
  }
}

/** Clears every form's draft — used when the user clicks the header logo to leave back
 * to the dashboard, which reads as "start over" rather than "I got interrupted". */
export function clearAllDrafts(): void {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(KEY_PREFIX)) localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}
