import { writeFileSync } from 'fs';

// ============================================================
// UTILITIES
// ============================================================
let _id = 0;
const nextId = () => ++_id;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
};
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function makeChoice(cat, diff, q, correct, wrongs, exp) {
  const opts = shuffle([correct, ...wrongs.slice(0, 3)]);
  return { id: nextId(), cat, diff, type: 'choice', q, opts, ans: opts.indexOf(correct), exp };
}

function makeTF(cat, diff, statement, isTrue, exp) {
  return { id: nextId(), cat, diff, type: 'truefalse', q: statement, opts: ['正确', '错误'], ans: isTrue ? 0 : 1, exp };
}

function distributeDiff(counts) {
  const result = [];
  for (const [diff, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i++) result.push(diff);
  }
  return shuffle(result);
}

// Generic category generator
function generateCategory(cat, total, knowledgeBase) {
  const questions = [];
  const easyCount = Math.floor(total * 0.4);
  const medCount = Math.floor(total * 0.4);
  const hardCount = total - easyCount - medCount;
  const diffs = distributeDiff({ easy: easyCount, medium: medCount, hard: hardCount });
  const { concepts, choiceTemplates, tfTrue, tfFalse, extraChoices } = knowledgeBase;
  const usedQ = new Set();
  let generated = 0;

  function addQ(q) {
    if (!usedQ.has(q.q) && generated < total) {
      usedQ.add(q.q);
      questions.push(q);
      generated++;
    }
  }

  // Apply templates to concepts
  for (const tmpl of choiceTemplates) {
    for (const c of concepts) {
      if (generated >= total) break;
      try {
        const q = tmpl(cat, c, concepts, diffs[generated] || 'medium');
        if (q) addQ(q);
      } catch (e) { /* skip invalid combinations */ }
    }
  }

  // Extra choice questions
  for (const eq of extraChoices) {
    if (generated >= total) break;
    addQ(makeChoice(cat, diffs[generated] || 'medium', eq.q, eq.correct, eq.wrongs, eq.exp));
  }

  // True/False
  for (const [stmt, isTrue, exp] of tfTrue) {
    if (generated >= total) break;
    addQ(makeTF(cat, diffs[generated] || 'medium', stmt, isTrue, exp));
  }
  for (const [stmt, isTrue, exp] of tfFalse) {
    if (generated >= total) break;
    addQ(makeTF(cat, diffs[generated] || 'medium', stmt, isTrue, exp));
  }

  // Fill remaining with varied templates
  while (generated < total) {
    const diff = diffs[generated] || 'medium';
    const c = pick(concepts);
    const templates = [
      () => makeChoice(cat, diff, `以下关于${c.name}的描述，正确的是？`, c.desc, pickN(concepts.filter(x => x.name !== c.name), 3).map(x => x.desc), `${c.name}：${c.desc}。`),
      () => makeChoice(cat, diff, `${c.name}属于哪个领域？`, c.field || c.task || c.type || '通用', pickN(concepts.filter(x => (x.field || x.task || x.type) !== (c.field || c.task || c.type)), 3).map(x => x.field || x.task || x.type || '其他'), `${c.name}属于${c.field || c.task || c.type}领域。`),
      () => makeTF(cat, diff, `${c.name}是${c.field || c.task || c.type}领域的重要概念。`, true, `${c.desc}。`),
      () => makeTF(cat, diff, `${c.name}的主要特点是${pick(concepts.filter(x => x.name !== c.name)).desc}。`, false, `${c.name}的实际特点是${c.desc}。`),
    ];
    addQ(pick(templates)());
  }

  console.log(`  ${cat}: ${questions.length}/${total}`);
  return questions;
}

export { generateCategory, makeChoice, makeTF, pick, pickN, shuffle, distributeDiff };
