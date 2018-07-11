import createParser from '../createParser';

test('it parses correctly', () => {
  const productionRules = [
    'start : exp',
    'exp : NUMBER',
    'exp : STRING',
    'exp : IDENTIFIER',
    'exp : funcCall',
    'funcCall : LPAREN IDENTIFIER optArgs RPAREN',
    'optArgs :',
    'optArgs : exp optArgs'
  ];
  const parse = createParser(productionRules, options);
  const tokens = [
    { name: 'LPAREN', value: '(', start: [ 1, 0 ], end: [ 1, 1 ] },
    { name: 'IDENTIFIER', value: 'foo', start: [ 1, 1 ], end: [ 1, 4 ] },
    { name: 'NUMBER', value: 42, start: [ 1, 5 ], end: [ 1, 7 ] },
    { name: 'LPAREN', value: '(', start: [ 1, 8 ], end: [ 1, 9 ] },
    { name: 'IDENTIFIER', value: 'baz', start: [ 1, 9 ], end: [ 1, 12 ] },
    { name: 'STRING', value: 'bar', start: [ 1, 13 ], end: [ 1, 18 ] },
    { name: 'RPAREN', value: ')', start: [ 1, 18 ], end: [ 1, 19 ] },
    { name: 'RPAREN', value: ')', start: [ 1, 19 ], end: [ 1, 20 ] }
  ];
  expect(parse(tokens)).toMatchSnapshot();
});
