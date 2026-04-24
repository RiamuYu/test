export type Comparator = ">=" | "<=" | ">" | "<" | "==" | "!=";

export type NumericPredicate = {
  key: string;
  op: Comparator;
  value: number;
};

export type Predicate =
  | { all: Predicate[] }
  | { any: Predicate[] }
  | { not: Predicate }
  | { stat: NumericPredicate }
  | { flag: NumericPredicate }
  | { route: { id: string; is: boolean } }
  | { seenQuickEvent: { id: string; is: boolean } };

export type StatDef = {
  id: string; // e.g. "A"
  label: string; // e.g. "Nhận thức"
  shortLabel?: string; // e.g. "A"
  min?: number; // default 0
  max?: number; // default 100
};

export type FlagDef = {
  id: string; // e.g. "red"
  label: string; // e.g. "RedFlag"
  tone: "bad" | "good";
};

export type RouteDef = {
  id: string; // e.g. "aware"
  label: string; // e.g. "Aware Route"
  description?: string;
  unlockWhen?: Predicate;
};

export type Character = {
  id: string;
  name: string;
  age?: number;
  bio?: string;
};

export type DialogueLine = {
  speakerId?: string; // if omitted: narrator
  text: string;
};

export type ScenarioAssets = {
  backgrounds?: Record<string, string>; // id -> public path
  characters?: Record<string, string>; // characterId -> public path
};

export type Effect = {
  stats?: Partial<Record<string, number>>;
  flags?: Partial<Record<string, number>>;
  unlockRoutes?: string[];
  setNames?: Partial<Record<string, string>>; // characterId -> display name override
};

export type Choice = {
  id: string;
  label: string;
  next: string;
  effect?: Effect;
  requires?: Predicate;
  note?: string; // e.g. "🟢" or "🔴"
  resultLine?: DialogueLine; // immediate reaction shown after picking choice
  resultLines?: DialogueLine[]; // multi-line immediate reaction shown before moving on
};

export type NodeKind = "scene" | "ending";

export type Node = {
  id: string;
  kind: NodeKind;
  title: string;
  body: string[]; // legacy narration paragraphs (optional when using lines)
  lines?: DialogueLine[];
  backgroundId?: string; // key of assets.backgrounds
  choices: Choice[];
};

export type QuickEvent = {
  id: string;
  title: string;
  body: string[]; // legacy narration paragraphs
  lines?: DialogueLine[];
  backgroundId?: string; // key of assets.backgrounds
  when: Predicate;
  once?: boolean; // default true
  forced?: boolean;
  choices: Array<{
    id: string;
    label: string;
    effect?: Effect;
    requires?: Predicate;
    note?: string;
    resultLine?: DialogueLine;
    resultLines?: DialogueLine[];
  }>;
};

export type Check = {
  id: string;
  when: Predicate;
  goto: string; // nodeId (usually an ending)
};

export type Scenario = {
  slug: string;
  title: string;
  tagline?: string;

  // Used on homepage cards + modal.
  roleplay: {
    as: string; // "Bạn vào vai..."
    summary: string; // card description
    mainCharacterId: string; // who is shown in the modal
  };

  characters: Character[];
  assets?: ScenarioAssets;
  initialNameOverrides?: Partial<Record<string, string>>;

  stats: StatDef[];
  initialStats: Record<string, number>;

  flags: FlagDef[];
  initialFlags: Record<string, number>;

  routes: RouteDef[];

  startNodeId: string;
  nodes: Record<string, Node>;
  quickEvents?: QuickEvent[];
  checks?: Check[];
};

export type GameMode = "node" | "event";

export type GameState = {
  mode: GameMode;
  nodeId: string;
  stats: Record<string, number>;
  flags: Record<string, number>;
  routes: Record<string, boolean>;
  nameOverrides: Record<string, string>;
  history: string[];
  seenQuickEvents: string[];
  activeEventId?: string;
  resumeTo?: string;
};

function compare(a: number, op: Comparator, b: number) {
  if (op === ">=") return a >= b;
  if (op === "<=") return a <= b;
  if (op === ">") return a > b;
  if (op === "<") return a < b;
  if (op === "==") return a === b;
  return a !== b;
}

export function evalPredicate(state: GameState, pred: Predicate | undefined): boolean {
  if (!pred) return true;
  if ("all" in pred) return pred.all.every((p) => evalPredicate(state, p));
  if ("any" in pred) return pred.any.some((p) => evalPredicate(state, p));
  if ("not" in pred) return !evalPredicate(state, pred.not);
  if ("route" in pred) return Boolean(state.routes[pred.route.id]) === pred.route.is;
  if ("seenQuickEvent" in pred) {
    const has = state.seenQuickEvents.includes(pred.seenQuickEvent.id);
    return has === pred.seenQuickEvent.is;
  }

  if ("stat" in pred) {
    const v = state.stats[pred.stat.key] ?? 0;
    return compare(v, pred.stat.op, pred.stat.value);
  }

  const v = state.flags[pred.flag.key] ?? 0;
  return compare(v, pred.flag.op, pred.flag.value);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function createInitialState(s: Scenario): GameState {
  const routes: Record<string, boolean> = {};
  for (const r of s.routes) routes[r.id] = false;
  const nameOverrides: Record<string, string> = {};
  if (s.initialNameOverrides) {
    for (const [k, v] of Object.entries(s.initialNameOverrides)) {
      if (typeof v === "string") nameOverrides[k] = v;
    }
  }

  return {
    mode: "node",
    nodeId: s.startNodeId,
    stats: { ...s.initialStats },
    flags: { ...s.initialFlags },
    routes,
    nameOverrides,
    history: [],
    seenQuickEvents: [],
  };
}

export function applyEffect(s: Scenario, state: GameState, effect: Effect | undefined): GameState {
  if (!effect) return state;

  const nextStats = { ...state.stats };
  for (const def of s.stats) {
    const delta = effect.stats?.[def.id];
    if (typeof delta !== "number") continue;
    const min = def.min ?? 0;
    const max = def.max ?? 100;
    nextStats[def.id] = clamp((nextStats[def.id] ?? 0) + delta, min, max);
  }

  const nextFlags = { ...state.flags };
  if (effect.flags) {
    for (const [k, delta] of Object.entries(effect.flags)) {
      if (typeof delta !== "number") continue;
      nextFlags[k] = (nextFlags[k] ?? 0) + delta;
    }
  }

  const nextRoutes = { ...state.routes };
  if (effect.unlockRoutes) {
    for (const rid of effect.unlockRoutes) nextRoutes[rid] = true;
  }

  const nextNames = { ...state.nameOverrides };
  if (effect.setNames) {
    for (const [cid, name] of Object.entries(effect.setNames)) {
      if (typeof name !== "string") continue;
      nextNames[cid] = name;
    }
  }

  return { ...state, stats: nextStats, flags: nextFlags, routes: nextRoutes, nameOverrides: nextNames };
}

export function applyAutoUnlockRoutes(s: Scenario, state: GameState): GameState {
  let next = state;
  for (const r of s.routes) {
    if (next.routes[r.id]) continue;
    if (!r.unlockWhen) continue;
    if (!evalPredicate(next, r.unlockWhen)) continue;
    next = { ...next, routes: { ...next.routes, [r.id]: true } };
  }
  return next;
}

export function pickQuickEvent(s: Scenario, state: GameState) {
  const list = s.quickEvents ?? [];
  for (const e of list) {
    const once = e.once ?? true;
    if (once && state.seenQuickEvents.includes(e.id)) continue;
    if (evalPredicate(state, e.when)) return e;
  }
  return null;
}

export function pickCheckRedirect(s: Scenario, state: GameState) {
  const checks = s.checks ?? [];
  for (const c of checks) {
    if (evalPredicate(state, c.when)) return c.goto;
  }
  return null;
}

