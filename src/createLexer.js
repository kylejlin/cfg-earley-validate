const createLexer = (tokenTypes) => {
  tokenTypes = tokenTypes.map((type) => {
    const { name, rule, value, isOmitted } = type;
    const caretRule = new RegExp('^' + rule.source);
    if (caretRule.test('')) {
      throw new TypeError('Rule ' + rule.source + ' for token type ' + name + ' matched the empty string. Rules cannot match the empty string.');
    }
    return {
      name,
      rule: caretRule,
      value: 'function' === typeof value ? value : null,
      isOmitted,
    };
  });

  return (string) => {
    const tokens = [];
    let line = 1;
    let column = 0;
    while (string.length > 0) {
      let hasFoundRule = false;

      for (const type of tokenTypes) {
        const { name, rule, value: valueMapper, isOmitted } = type;
        const match = string.match(rule);
        if (match === null) {
          continue;
        }
        const [firstMatch] = match;

        string = string.slice(firstMatch.length);

        const startLine = line;
        const startColumn = column;
        const newlines = firstMatch.split('\n').length - 1;
        if (newlines > 0) {
          line += newlines;
          column = firstMatch.split('\n').slice(-1)[0].length;
        } else {
          column += firstMatch.length;
        }

        if (!isOmitted) {
          const value = valueMapper === null
            ? firstMatch
            : valueMapper(firstMatch);
          tokens.push({
            name: name,
            value,
            start: [startLine, startColumn],
            end: [line, column],
          });
        }

        hasFoundRule = true;
        break;
      }

      if (!hasFoundRule) {
        throw new SyntaxError('Cannot tokenize: ' + string);
      }
    }
    return tokens;
  };
};

export default createLexer;
