const createParser = (grammar) => {
  grammar = grammar.map(parseRule);

  return (tokens) => {
    tokens = tokens.concat([{ name: 'END_OF_INPUT' }]);
    const chart = Array(tokens.length).fill(null).map(() => []);
    const startRule = grammar[0];
    const startState = [startRule[0], [], startRule.slice(1), 0];
    chart[0].push(startState);
    for (let i = 0; i < tokens.length; i++) {
      while (true) {
        let changes = false;
        for (const state of chart[i]) {
          const [x, ab, cd, j] = state;
          const nextStates0 = getClosure(grammar, i, x, ab, cd, j);
          for (const nextState of nextStates0) {
            changes = changes || addToChart(chart, i, nextState);
          }
          const nextState = getShift(tokens, i, x, ab, cd, j);
          if (nextState !== null) {
            changes = changes || addToChart(chart, i + 1, nextState);
          }
          const nextStates1 = getReductions(chart, i, x, ab, cd, j);
          for (const nextState of nextStates1) {
            changes = changes || addToChart(chart, i, nextState);
          }
        }
        if (!changes) {
          break;
        }
      }
    }
    const acceptingState = [startRule[0], startRule.slice(1), [], 0];
    console.log(chart.map(states => states.map(state => state[0] + ' -> ' + state[1].join(' ') + ' . ' + state[2].join(' ') + ' from ' + state[3])))
    return !!chart[tokens.length - 1].find((s) => deepEq(s, acceptingState));
  };
};

const parseRule = (rule) => rule.split(/ |:/).filter((s) => s !== '');

const deepEq = (a, b) => {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }
    return a.length === b.length && a.every((x, i) => deepEq(x, b[i]));
  }
  return a === b;
};

const addToChart = (chart, index, elem) => {
  if (!chart[index].find((a) => deepEq(a, elem))) {
    chart[index].push(elem);
    return true;
  }
  return false;
};

const getClosure = (grammar, i, x, ab, cd) => grammar
  .filter((rule) => rule[0] === cd[0])
  .map((rule) => [rule[0], [], rule.slice(1), i]);

const getShift = (tokens, i, x, ab, cd, j) => {
  if (cd.length === 0 || cd[0] !== tokens[i].name) {
    return null;
  }
  return [x, ab.concat(cd.slice(0, 1)), cd.slice(1), j];
};

const getReductions = (chart, i, x, ab, cd, j) => {
  if (cd.length !== 0) {
    return [];
  }
  const reductions = [];
  for (const rule of chart[j]) {
    const [rx, rab, rcd, rj] = rule;
    if (rcd.length === 0 || x !== rcd[0]) {
      continue;
    }
    reductions.push([rx, rab.concat(rcd.slice(0, 1)), rcd.slice(1), rj]);
  }
  return reductions;
};

export default createParser;
