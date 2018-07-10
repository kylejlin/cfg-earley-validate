import lex from '../lex';

test('it lexes correctly', () => {
  const rules = [
    [
      /\(/,
      'LPAREN'
    ],
    [
      /\)/,
      'RPAREN'
    ],
    [
      /\d*(?:\.\d+)?/,
      (token) => ({
        ...token,
        type: 'NUMBER',
        value: parseFloat(token.value),
      })
    ],
    [
      /"(?:[^"\\]|\\.)*"/,
      (token) => ({
        ...token,
        type: 'STRING',
        value: token.value.slice(1, -1),
      })
    ],
    [
      /[a-zA-Z_][a-zA-Z_0-9]*/,
      'IDENTIFIER'
    ],
    [
      /[ \t\n]+/,
      null
    ]
  ];
  const code = '(foo 42 (baz "bar"))';
  expect(lex(rules, code)).toMatchSnapshot();
});
