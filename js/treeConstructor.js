import ParserDocument from "./parserDocument.js";
import * as Tokens from './tokens.js';

const InsertionMode = {
    INITIAL: 'initial',
    BEFORE_HTML: 'beforeHTML',
    BEFORE_HEAD: 'beforeHead',
    IN_HEAD: 'inHead',
    IN_HEAD_NO_SCRIPT: 'inHeadNoScript',
    AFTER_HEAD: 'afterHead',
    IN_BODY: 'inBody',
    TEXT: 'text',
    IN_TABLE: 'inTable',
    IN_TABLE_TEXT: 'inTableText',
    IN_CAPTION: 'inCaption',
    IN_COLUMN_GOUP: 'inColumnGroup',
    IN_TABLE_BODY: 'inTableBody',
    IN_ROW: 'inRow',
    IN_CELL: 'inCell',
    IN_SELECT: 'inSelect',
    IN_SELECT_IN_TABLE: 'inSelectInTable',
    IN_TEMPALATE: 'inTemplate',
    AFTER_BODY: 'afterBody',
    IN_FRAMESET: 'inFramset',
    AFTER_FRAMESET: 'afterFrameset',
    AFTER_AFTER_BODY: 'afterAfterBody',
    AFTER_AFTER_FRAMESET: 'afterAfterFrameset',
};

class UnimplimentedInsertionModeError extends Error {
    constructor(currentState) {
        super(currentState);
        this.name = 'UnimplimentedInsertionModeError';
    }
}

class TreeConstructor {
    openElements = [];
    originalInsertionMode;
    document = new ParserDocument();
    currentInsertionMode = InsertionMode.INITIAL;
    currerntToken;

    constructor() {}

    construct(token) {
        this.currentToken = token;
        if(this.openElements.length === 0 ||
            // this.adjustedCurrentNode in HTML Namespace
            // this.adjustedCurrentNode is a MathML text integration point and the token is a start tag whose tag name is neither "mglyph" nor "malignmark"
            // is a MathML text integration point and the token is a character token
            // is a MathML annotation-xml element and the token is a start tag whose tag name is "svg"
            this.adjustedCurrentNode instanceof Tokens.StartTag ||
            this.adjustedCurrentNode instanceof Tokens.Character ||
            this.currentToken instanceof Tokens.EOF) {
                // Process the token according to the rules given in the section corresponding to the current insertion mode in HTML content.
                switch(this.currentInsertionMode) {
                    case InsertionMode.INITIAL:
                        this.handleInitialInsertionMode();
                        break;
                    default:
                        this.unimplimented();
                }
            } else {
                // Process the token according to the rules given in the section for parsing tokens in foreign content.
            }
    }

    get currentNode() {
        return this.openElements[this.openElements.length-1];
    }

    get adjustedCurrentNode() {
        // context element if the parser was created as part of the HTML fragment parsing algorithm 
        // and the stack of open elements has only one element in it (fragment case)
        if(false) {

        } else {
            return this.currentNode;
        }
    }

    unimplimented() {
        throw new UnimplimentedTokenizerStateError(this.currentState);
    }

    insertAComment(data, position) {
        
    }

    handleInitialInsertionMode() {
        if(this.currentNode instanceof Tokens.Character && (
           this.currentNode.data === '\t' ||
           this.currentNode.data === '\u000A' ||
           this.currentNode.data === '\f' ||
           this.currentNode.data === '\r' ||
           this.currentNode.data === ' ')) {
            // Ignore the token
        } else if(this.currentNode instanceof Tokens.Comment) {
            this.insertAComment(this.currentNode.data);
        }
    }
}

export default TreeConstructor;