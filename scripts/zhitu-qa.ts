import assert from 'node:assert/strict';
import { CAREERS, SKILLS, VALUES, QUESTIONS, RESOURCES } from '../src/zhitu/data';
import { analyzeCareer, createBlank, createExample, passportFor, planTasks, progress, ranking, validateState } from '../src/zhitu/model';

let passed = 0;
function test(name: string, run: () => void) {
  run();
  passed++;
  console.log(`PASS ${name}`);
}

test('Every career has valid skills, preferences and HTTPS learning resources', () => {
  for (const collection of [CAREERS, SKILLS, VALUES, QUESTIONS, RESOURCES]) {
    assert.equal(new Set(collection.map(item => item.id)).size, collection.length);
  }
  for (const career of CAREERS) {
    assert.equal(career.stages.length, 4);
    assert.ok(career.skills.length > 0);
    for (const skill of career.skills) {
      assert.ok(SKILLS.some(s => s.id === skill.skillId));
      assert.ok(skill.requiredProficiency >= 1 && skill.requiredProficiency <= 4);
    }
    for (const value of career.values) assert.ok(VALUES.some(v => v.id === value));
    for (const resource of career.resources) assert.ok(RESOURCES.some(r => r.id === resource));
  }
  for (const resource of RESOURCES) assert.equal(new URL(resource.url).protocol, 'https:');
});

test('Unfinished assessments never produce a personal match score', () => {
  const state = createBlank();
  for (const result of ranking(state)) {
    assert.equal(result.fit, null);
    assert.equal(result.interest, null);
    assert.equal(result.values, null);
  }
  state.responses = createExample().responses;
  assert.equal(analyzeCareer(state, CAREERS[0]).fit, null);
});

test('Interest answers retain their full 0–100 scale in the adapted questionnaire', () => {
  for (const [answer, expected] of [[1, 0], [3, 50], [5, 100]]) {
    const state = createBlank();
    state.responses = Object.fromEntries(QUESTIONS.map(q => [q.id, answer]));
    state.interestCompleted = true;
    assert.deepEqual(Object.values(passportFor(state).riasec!), Array(6).fill(expected));
  }
});

test('Skills progress monotonically from zero readiness to full requirements', () => {
  for (const career of CAREERS) {
    const state = createBlank();
    state.skillsCompleted = true;
    assert.equal(analyzeCareer(state, career).gap.readiness, 0);
    let previous = 0;
    for (let level = 1; level <= 4; level++) {
      state.profile.skills = Object.fromEntries(SKILLS.map(s => [s.id, level]));
      const result = analyzeCareer(state, career);
      assert.ok(result.gap.readiness >= previous && result.gap.readiness <= 100);
      previous = result.gap.readiness;
    }
    assert.equal(previous, 100);
    assert.equal(analyzeCareer(state, career).gap.gaps.length, 0);
  }
});

test('Weights use only completed assessments and scores stay bounded', () => {
  const state = createBlank();
  state.valuesCompleted = true;
  for (const preference of VALUES) state.profile.values[preference.id] = 5;
  assert.equal(analyzeCareer(state, CAREERS[0]).fit, 100);
  const example = createExample();
  for (const career of CAREERS) {
    const result = analyzeCareer(example, career);
    assert.equal(result.fit, Math.round((result.interest! * .5 + result.gap.readiness * .35) / .85));
    assert.ok(result.fit! >= 0 && result.fit! <= 100);
  }
});

test('Task completion belongs to a career; weekly hours change the schedule', () => {
  const state = createExample();
  const llm = CAREERS.find(c => c.id === 'llm')!;
  const cv = CAREERS.find(c => c.id === 'cv')!;
  assert.equal(progress(state, llm).done, 3);
  assert.equal(progress(state, cv).done, 0);
  assert.equal(progress(state, llm).weeks, 12);
  state.profile.hours = 4;
  assert.equal(planTasks(state, llm).at(-1)!.week, 24);
  state.profile.hours = 16;
  assert.equal(planTasks(state, llm).at(-1)!.week, 6);
  assert.equal(progress(state, llm).done, 3);
});

test('Exported profiles round-trip without losing tasks or answers', () => {
  const state = createExample();
  state.reflection = '本周完成了数据清洗，下周验证检索效果。';
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(state))), state);
});

test('Invalid imports cannot fabricate completed assessments or arbitrary IDs', () => {
  assert.throws(() => validateState(null));
  assert.throws(() => validateState({ version: 999, profile: {} }));
  const state = validateState({ version: 1, profile: { hours: 0, skills: { python: 99 }, values: {} },
    responses: { i1: 7, r1: 1.5 }, interestCompleted: true, skillsCompleted: true, valuesCompleted: true,
    target: 'unknown', completed: ['llm-0', 'llm-0', 'llm-99', 'bad'], bookmarks: ['r1', 'r1', 'r99'] });
  assert.equal(state.profile.hours, 2);
  assert.equal(state.profile.skills.python, 4);
  assert.equal(state.interestCompleted, false);
  assert.equal(state.skillsCompleted, false);
  assert.equal(state.valuesCompleted, false);
  assert.equal(state.target, 'llm');
  assert.deepEqual(state.completed, ['llm-0']);
  assert.deepEqual(state.bookmarks, ['r1']);
  assert.equal(analyzeCareer(state, CAREERS[0]).fit, null);
});

console.log(`\n${passed} Zhitu functional checks passed.`);
