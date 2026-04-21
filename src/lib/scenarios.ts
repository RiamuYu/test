import type { Scenario } from "@/lib/story-format";
import { HA_AN_KHANH_SCENARIO } from "@/lib/scenarios/ha-an-khanh";
import { MINH_LAN_SCENARIO } from "@/lib/scenarios/minh-lan";

export type ScenarioCard = {
  slug: string;
  title: string;
  tagline?: string;
  summary: string;
  roleplayAs: string;
  mainCharacter: { name: string; age?: number; bio?: string };
};

const ALL_SCENARIOS: Scenario[] = [MINH_LAN_SCENARIO, HA_AN_KHANH_SCENARIO];

export const SCENARIO_CARDS: ScenarioCard[] = ALL_SCENARIOS.map((s) => {
  const main = s.characters.find((c) => c.id === s.roleplay.mainCharacterId);
  return {
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    summary: s.roleplay.summary,
    roleplayAs: s.roleplay.as,
    mainCharacter: {
      name: main?.name ?? "Nhân vật",
      age: main?.age,
      bio: main?.bio,
    },
  };
});

export function getScenarioBySlug(slug: string) {
  return ALL_SCENARIOS.find((s) => s.slug === slug) ?? null;
}

