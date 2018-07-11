import createLexer from '../createLexer';
import createParser from '../createParser';
import createValidator from '../createValidator';

test('it validates correctly', () => {
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
  const lexer = createLexer(tokenTypes);
  const grammar = [
    'start : exp',
    'exp : NUMBER',
    'exp : STRING',
    'exp : IDENTIFIER',
    'exp : funcCall',
    'funcCall : LPAREN IDENTIFIER optArgs RPAREN',
    'optArgs :',
    'optArgs : exp optArgs'
  ];
  const parser = createParser(grammar);
  const validate = createValidator(lexer, parser);
  const code = '(foo 42 (baz "bar"))';
  expect(validate(code)).toMatchSnapshot();
});
