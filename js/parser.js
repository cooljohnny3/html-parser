import Tokenizer from './tokenizer.js';
import TreeConstructor from './treeConstructor.js';

class Parser {
    tokenizer = new Tokenizer();
    treeConstructor = new TreeConstructor();

    parse(input) {
        this.tokenizer.tokenize(input);
        return this.treeConstructor.parserDocument;
    }
}

export default Parser;