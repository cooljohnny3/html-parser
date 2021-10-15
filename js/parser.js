import Tokenizer from './tokenizer.js';

class Parser {
    tokenizer = new Tokenizer();

    parse(input) {
        return this.tokenizer.tokenize(input);
    }
}

export default Parser;