const createValidator = (lexer, parser) => {
  return (code) => {
    try {
      const tokens = lexer(code);
      try {
        return parser(tokens);
      } catch (_) {
        return false;
      }
    } catch (_) {
      return false;
    }
  };
};

export default createValidator;
