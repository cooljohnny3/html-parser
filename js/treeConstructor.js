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
    currentInsertionMode = InsertionMode.INITIAL;
    parserDocument = new ParserDocument();
    currentToken;

    construct(token) {
        this.currentToken = token;
        if(this.openElements.length === 0 ||
            true || // this.adjustedCurrentNode in HTML Namespace 
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
                    case InsertionMode.BEFORE_HTML:
                        this.handleBeforeHtmlInsertionMode();
                        break;
                    case InsertionMode.BEFORE_HEAD:
                        this.handleBeforeHeadInsertionMode();
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
        this.unimplimented();
    }

    handleInitialInsertionMode() {
        if(this.currentToken instanceof Tokens.Character && (
           this.currentToken.data === '\t' ||
           this.currentToken.data === '\u000A' ||
           this.currentToken.data === '\f' ||
           this.currentToken.data === '\r' ||
           this.currentToken.data === ' ')) {
            // Ignore the token
        } else if(this.currentToken instanceof Tokens.Comment) {
            this.insertAComment(this.currentToken.data);
        } else if(this.currentToken instanceof Tokens.DocType) {
            this.handleInitialDocTypeToken();
            this.currentInsertionMode = InsertionMode.BEFORE_HTML;
        } else {
            // TODO
            // If the document is not an iframe srcdoc document, then this is a parse error; 
            // if the parser cannot change the mode flag is false, set the Document to quirks mode.
            this.currentInsertionMode = InsertionMode.BEFORE_HTML;
        }
    }

    handleInitialDocTypeToken() {
        this.unimplimented();
    }

    handleBeforeHtmlInsertionMode() {
        if(this.currentToken instanceof Tokens.DocType) {
            // Parse error. Ignore the token.
        } else if(this.currentToken instanceof Tokens.Comment) {
            this.insertAComment(this.currentToken.data);
        } else if(this.currentToken instanceof Tokens.Character && (
            this.currentToken.data === '\t' ||
            this.currentToken.data === '\u000A' ||
            this.currentToken.data === '\f' ||
            this.currentToken.data === '\r' ||
            this.currentToken.data === ' ')) {
             // Ignore the token
        } else if(this.currentToken instanceof Tokens.StartTag &&
            this.currentToken.name === 'html') {
            // TODO
            // Create an element for the token in the HTML namespace, with the Document as the intended parent. 
            // Append it to the Document object. 
            // Put this element in the stack of open elements.
            this.currentInsertionMode = InsertionMode.BEFORE_HEAD;
        } else if(this.currentToken instanceof Tokens.EndTag &&
            (this.currentToken.name === 'head' ||
            this.currentToken.name === 'body' ||
            this.currentToken.name === 'html' ||
            this.currentToken.name === 'br')) {
            // TODO
            // Create an html element whose node document is the Document object. 
            // Append it to the Document object. 
            // Put this element in the stack of open elements.
            this.currentInsertionMode = InsertionMode.BEFORE_HEAD;
        } else if(this.currentToken instanceof Tokens.EndTag) {
            // Parse error. Ignore the token.
        } else {
            // TODO
            // Create an html element whose node document is the Document object. 
            // Append it to the Document object. 
            // Put this element in the stack of open elements.
            this.currentInsertionMode = InsertionMode.BEFORE_HEAD;
        }
    }

    handleBeforeHeadInsertionMode() {
        if(this.currentToken instanceof Tokens.Character && (
            this.currentToken.data === '\t' ||
            this.currentToken.data === '\u000A' ||
            this.currentToken.data === '\f' ||
            this.currentToken.data === '\r' ||
            this.currentToken.data === ' ')) {
             // Ignore the token
        } else if(this.currentToken instanceof Tokens.Comment) {
            this.insertAComment(this.currentToken.data);
        } else if(this.currentToken instanceof Tokens.DocType) {
            // Parse error. Ignore the token.
        } else if(this.currentToken instanceof Tokens.StartTag &&
            this.currentToken.name === 'html') {
            this.handleInBodyInsertionMode();
        } else if(this.currentToken instanceof Tokens.StartTag &&
            this.currentToken.name === 'head') {
            // TODO
            // Insert an HTML element for the token.
            // Set the head element pointer to the newly created head element.
            this.currentInsertionMode = InsertionMode.IN_HEAD;
        }
    }

    handleInHeadInsertionMode() {
        this.unimplimented();
    }

    handleInBodyInsertionMode() {
        this.unimplimented();
    }
}

export default TreeConstructor;