import { occupationById, QUALIFICATIONS, skillById } from '../data/knowledge';
import type { Qualification } from '../data/knowledge';
import type { CareerPassport, GapReport, Proficiency, SkillClaim } from './types';
import { computeSkillGap } from './skillGapCore';

export function claimFor(passport: CareerPassport, skillId: string): SkillClaim | undefined {
  return passport.skills.find(claim => claim.skillId === skillId);
}

export function computeGapReport(passport: CareerPassport, occupationId: string): GapReport {
  const occupation = occupationById.get(occupationId);
  if (!occupation) throw new Error(`Unknown occupation: ${occupationId}`);
  return computeSkillGap(passport, occupation);
}

export function skillName(skillId: string): string {
  return skillById.get(skillId)?.name ?? skillId;
}

export function learningRoutesForSkill(skillId: string, limit = 3): Qualification[] {
  return QUALIFICATIONS.filter(qualification => qualification.developsSkillIds.includes(skillId))
    .sort((a, b) => a.typicalMonths - b.typicalMonths)
    .slice(0, limit);
}
