const lex = (rules, string) => {
  const tokens = [];
  let line = 1;
  let column = 0;
  while (string.length > 0) {
    for (const rule of rules) {
      const [regex, tokenizer] = rule;
      const match = string.match(regex);
      if (match === null || match.index !== 0 || match[0] === '') {
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

      if (tokenizer === null) {
        break;
      }
      if ('string' === typeof tokenizer) {
        tokens.push({
          type: tokenizer,
          value: firstMatch,
          start: [startLine, startColumn],
          end: [line, column],
        });
        break;
      }
      if ('function' === typeof tokenizer) {
        tokens.push(tokenizer({
          type: null,
          value: firstMatch,
          start: [startLine, startColumn],
          end: [line, column],
        }));
        break;
      }
      throw new TypeError('Illegal tokenizer: ' + tokenizer);
    }
  }
  return tokens;
};

export default lex;
