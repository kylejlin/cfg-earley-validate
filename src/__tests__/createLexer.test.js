import createLexer from '../createLexer';

test('it lexes correctly', () => {
  const tokenTypes = [
    {
      name: 'LPAREN',
      rule: /\(/,
    },
    {
      name: 'RPAREN',
      rule: /\)/,
    },
    {
      name: 'NUMBER',
      rule: /\d+(?:\.\d+)?/,
      value: parseFloat,
    },
    {
      name: 'STRING',
      rule: /"(?:[^"\\]|\\.)*"/,
      value: (value) => value.slice(1, -1),
    },
    {
      name: 'IDENTIFIER',
      rule: /[a-zA-Z_][a-zA-Z_0-9]*/,
    },
    {
      isOmitted: true,
      name: 'WHITESPACE',
      rule: /[ \t\n]+/,
    }
  ];
  const lex = createLexer(tokenTypes);
  const code = '(foo 42 (baz "bar"))';
  expect(lex(code)).toMatchSnapshot();
});
