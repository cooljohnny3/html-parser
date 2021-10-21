import * as Tokens from './tokens.js';
import * as Util from './util.js';
import Entities from './entities.js';
import NumericCharacters from './numericCharacters.js';
import TreeConstructor from './treeConstructor.js';

class UnimplimentedTokenizerStateError extends Error {
    constructor(currentState) {
        super(currentState);
        this.name = 'UnimplimentedTokenizerStateError';
    }
}

const TokenizerState = {
    DATA_STATE: 'dataState',
    TAG_OPEN_STATE: 'tagOpenState',
    MARKUP_DECLARATION_OPEN_STATE: 'markupDeclarationOpenState',
    END_TAG_OPEN_STATE: 'endTagOpenState',
    TAG_NAME_STATE: 'tagNameState',
    BOGUS_COMMENT_STATE: 'bogusCommentState',
    BEFORE_ATTRIBUTE_NAME_STATE: 'beforeAttributeNameState',
    SELF_CLOSING_START_TAG_STATE: 'selfClosingStartTagState',
    AFTER_ATTRIBUTE_NAME_STATE: 'afterAttributeNameState',
    ATTRIBUTE_NAME_STATE: 'attributeNameState',
    COMMENT_START_STATE: 'commentStartState',
    DOCTYPE_STATE: 'docTypeState',
    BEFORE_DOCTYPE_NAME_STATE: 'beforeDocTypeNameState',
    DOCTYPE_NAME_STATE: 'docTypeNameState',
    AFTER_DOCTYPE_NAME_STATE: 'afterDocTypeNameState',
    BEFORE_ATTRIBUTE_VALUE_STATE: 'beforeAttributeValueState',
    ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE: 'attributeValueDoubleQuotedState',
    ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE: 'attributeValueSingleQuotedState',
    ATTRIBUTE_VALUE_UNQUOTED_STATE: 'attributeValueUnquotedState',
    AFTER_ATTRIBUTE_VALUE_QUOTED_STATE: 'afterAttributeValueQuotedState',
    CHARACTER_REFERENCE_STATE: 'characterReferenceState',
    NAMED_CHARACTER_REFERENCE_STATE: 'namedCharacterReferenceState',
    NUMERIC_CHARACTER_REFERENCE_STATE: 'numericCharacterReferenceState',
    COMMENT_START_DASH_STATE: 'commentStartDashState',
    COMMENT_STATE: 'commentState',
    COMMENT_LESS_THAN_SIGN_STATE: 'commentLessThanSignState',
    COMMENT_END_DASH_STATE: 'commentEndDashState',
    COMMENT_LESS_THAN_SIGN_BANG_STATE: 'commentLessThanSignBangState',
    COMMENT_END_STATE: 'commentEndState',
    COMMENT_END_BANG_STATE: 'commentEndBangState',
    AMBIGUOUS_AMPERSAND_STATE: 'ambiguousAmpersandState',
    DECIMAL_CHARACTER_REFERENCE_START_STATE: 'decimalCharacterReferenceStartState',
    HEXADECIMAL_CHARACTER_REFERENCE_START_STATE: 'hexadecimalChracterReferenceStartState',
    DECIMAL_CHARACTER_REFERENCE_STATE: 'decimalCharacterReferenceState',
    NUMERIC_CHARACTER_REFERENCE_END_STATE: 'numericCharacterReferenceEndState',
    CDATA_SECTION_STATE: 'cdataSectionState',
};

class Tokenizer {
    currentTokenizerState = TokenizerState.DATA_STATE;
    returnState;
    currentToken;
    temporaryBuffer;
    characterReferenceCode;
    index = 0;
    input;
    treeConstructor;

    tokenize(input, treeConstructor) {
        this.input = input;
        this.treeConstructor = treeConstructor;
        while(this.index < this.input.length) {
            console.log('In ' + this.currentTokenizerState + ' Next input char: ' + this.input[this.index]);
            switch(this.currentTokenizerState) {
                case TokenizerState.DATA_STATE:
                    this.handleDataState();
                    break;
                case TokenizerState.TAG_OPEN_STATE:
                    this.handleTagOpenState();
                    break;
                case TokenizerState.MARKUP_DECLARATION_OPEN_STATE:
                    this.handleMarkupDeclarationOpenState();
                    break;
                case TokenizerState.END_TAG_OPEN_STATE:
                    this.handleEndTagOpenState();
                    break;
                case TokenizerState.TAG_NAME_STATE:
                    this.handleTagNameState();
                    break;
                case TokenizerState.BOGUS_COMMENT_STATE:
                    this.handleBogusCommentState();
                    break;
                case TokenizerState.BEFORE_ATTRIBUTE_NAME_STATE:
                    this.handleBeforeAttributeNameState();
                    break;
                case TokenizerState.SELF_CLOSING_START_TAG_STATE:
                    this.handleSelfClosingStartTagState();
                    break;
                case TokenizerState.AFTER_ATTRIBUTE_NAME_STATE:
                    this.handleAfterAttributeNameState();
                    break;
                case TokenizerState.ATTRIBUTE_NAME_STATE:
                    this.handleAttributeNameState();
                    break;
                case TokenizerState.COMMENT_START_STATE:
                    this.handleCommentStartState();
                    break;
                case TokenizerState.DOCTYPE_STATE:
                    this.handleDocTypeState();
                    break;
                case TokenizerState.BEFORE_DOCTYPE_NAME_STATE:
                    this.handleBeforeDocTypeNameState();
                    break;
                case TokenizerState.DOCTYPE_NAME_STATE:
                    this.handleDocTypeNameState();
                    break;
                case TokenizerState.AFTER_DOCTYPE_NAME_STATE:
                    this.handleAfterDocTypeNameState();
                    break;
                case TokenizerState.BEFORE_ATTRIBUTE_VALUE_STATE:
                    this.handleBeforeAttributeValueState();
                    break;
                case TokenizerState.ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE:
                    this.handleAttributeValueDoubleQuotedState();
                    break;
                case TokenizerState.ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE:
                    this.handleAttributeValueSingleQuotedState();
                    break;
                case TokenizerState.ATTRIBUTE_VALUE_UNQUOTED_STATE:
                    this.handleAttributeValueUnquotedState();
                    break;
                case TokenizerState.AFTER_ATTRIBUTE_VALUE_QUOTED_STATE:
                    this.handleAfterAttributeValueQuotedState();
                    break;
                case TokenizerState.CHARACTER_REFERENCE_STATE:
                    this.handleChracterReferenceState();
                    break;
                case TokenizerState.NAMED_CHARACTER_REFERENCE_STATE:
                    this.handleNamedCharacterReferenceState();
                    break;
                case TokenizerState.NUMERIC_CHARACTER_REFERENCE_STATE:
                    this.handleNumericCharacterReferenceState();
                    break;
                case TokenizerState.COMMENT_START_DASH_STATE:
                    this.handleCommentStartDashState();
                    break;
                case TokenizerState.COMMENT_STATE:
                    this.handleCommentState();
                    break;
                case TokenizerState.COMMENT_LESS_THAN_SIGN_STATE:
                    this.handleCommentLessThanSignState();
                    break;
                case TokenizerState.COMMENT_END_DASH_STATE:
                    this.handleCommentEndDashState();
                    break;
                case TokenizerState.COMMENT_LESS_THAN_SIGN_BANG_STATE:
                    this.handleCommentLessThanSignBangState();
                    break;
                case TokenizerState.COMMENT_END_STATE:
                    this.handleCommentEndState();
                    break;
                case TokenizerState.COMMENT_END_BANG_STATE:
                    this.handleCommentEndBangState();
                    break;
                case TokenizerState.AMBIGUOUS_AMPERSAND_STATE:
                    this.handleAmbiguousAmpersandState();
                    break;
                case TokenizerState.DECIMAL_CHARACTER_REFERENCE_START_STATE:
                    this.handleDecimalCharacterReferenceStartState();
                    break;
                case TokenizerState.HEXADECIMAL_CHARACTER_REFERENCE_START_STATE:
                    this.handleHexadecimalCharacterReferenceState();
                    break;
                case TokenizerState.DECIMAL_CHARACTER_REFERENCE_STATE:
                    this.handleDecimaleCharacterReferenceState();
                    break;
                case TokenizerState.NUMERIC_CHARACTER_REFERENCE_END_STATE:
                    this.handleNumericCharacterReferenceEndState();
                    break;
                case TokenizerState.CDATA_SECTION_STATE:
                    this.handleCDATASectionState();
                    break;
                default:
                    console.log("Unknown state " + this.currentTokenizerState);
                    this.unimplimented();
            }
        }
    }

    unimplimented() {
        throw new UnimplimentedTokenizerStateError(this.currentTokenizerState);
    }

    partOfAttribute() {
        return this.returnState === TokenizerState.ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE || 
               this.returnState === TokenizerState.ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE ||
               this.returnState === TokenizerState.ATTRIBUTE_VALUE_UNQUOTED_STATE;
    }

    emitToken(token) {
        this.treeConstructor.construct(token);

        // Start tag self-closing flag was not acknowleged in Tree Construction
        if(token instanceof Tokens.StartTag && !true) {
            // non-void-html-element-start-tag-with-trailing-solidus parse error
        }
        if(token instanceof Tokens.EndTag) {
            if(token.attributes.length > 0) {
                // end-tag-with-attributes parse error
            }
            if(token.selfClosing) {
                // end-tag-with-trailing-solidus parse error
            }
        }
    }

    flushCodePoints() {
        for(let codePoint of this.temporaryBuffer) {
            if(this.partOfAttribute()) {
                this.currentToken.attributes[this.currentToken.attributes.length-1].value += codePoint;
            } else {
                this.emitToken(new Tokens.Character(codePoint));
            }
        }
    }

    handleDataState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '&') {
            this.returnState = TokenizerState.DATA_STATE;
            this.currentTokenizerState = TokenizerState.CHARACTER_REFERENCE_STATE;
        } else if(currentInputCharacter === '<') {
            this.currentTokenizerState = TokenizerState.TAG_OPEN_STATE;
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.emitToken(new Tokens.Character(currentInputCharacter));
        } else if(currentInputCharacter === undefined) {
            this.emitToken(new Tokens.EOF());
        } else {
            this.emitToken(new Tokens.Character(currentInputCharacter));
        }
    }

    handleTagOpenState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '!') {
            this.currentTokenizerState = TokenizerState.MARKUP_DECLARATION_OPEN_STATE;
        } else if(currentInputCharacter === '/') {
            this.currentTokenizerState = TokenizerState.END_TAG_OPEN_STATE;
        } else if(Util.isAlpha(currentInputCharacter)) {
            this.currentToken = new Tokens.StartTag();
            this.index--;
            this.currentTokenizerState = TokenizerState.TAG_NAME_STATE;
        } else if(currentInputCharacter === '?') {
            // unexpected-question-mark-instead-of-tag-name parse error
            this.currentToken = new Tokens.Comment();
            this.index--;
            this.currentTokenizerState = TokenizerState.BOGUS_COMMENT_STATE;
        } else if(currentInputCharacter === undefined) {
            // eof-before-tag-name parse error
            this.emitToken(new Tokens.Character('<'));
            this.emitToken(new Tokens.EOF());
        } else {
            // invalid-first-character-of-tag-name parse error
            this.emitToken(new Tokens.Character('<'));
            this.index--;
            this.currentTokenizerState = TokenizerState.DATA_STATE;
        }
    }

    handleMarkupDeclarationOpenState() {
        if(this.input.substr(this.index, 2) === '--') {
            this.index += 2;
            this.currentToken = new Tokens.Comment();
            this.currentTokenizerState = TokenizerState.COMMENT_START_STATE;
        } else if(this.input.substr(this.index, 7).toLowerCase() === 'doctype') {
            this.index += 7;
            this.currentTokenizerState = TokenizerState.DOCTYPE_STATE;
        } else if(this.input.substr(this.index, 7) === '[CDATA[') {
            this.index += 5;
            // If there is an adjusted current node and it is not an element in the HTML namespace
            if(false) {
                this.currentTokenizerState = TokenizerState.CDATA_SECTION_STATE;
            } else {
                // cdata-in-html-content parse error
                this.currentToken = new Tokens.Comment('[CDATA[');
                this.currentToken = TokenizerState.BOGUS_COMMENT_STATE;
            }
        } else {
            // incorrectly-opened-comment parse error
            this.currentToken = new Tokens.Comment();
            this.currentTokenizerState = TokenizerState.BOGUS_COMMENT_STATE;
        }
    }

    handleEndTagOpenState() {
        let currentInputCharacter = this.input[this.index++];

        if(Util.isAlpha(currentInputCharacter)) {
            this.currentToken = new Tokens.EndTag();
            this.index--;
            this.currentTokenizerState = TokenizerState.TAG_NAME_STATE;
        } else if(currentInputCharacter === '>') {
            // missing-end-tag-name parse error
            this.currentTokenizerState = TokenizerState.DATA_STATE;
        } else if(currentInputCharacter === undefined) {
            // eof-before-tag-name parse error
            this.emitToken(new Tokens.Character('<'));
            this.emitToken(new Tokens.Character('/'));
            this.emaitToken(new Tokens.EOF());
        } else {
            // invalid-first-character-of-tag-name parse error
            this.currentToken = new Comment();
            this.index--;
            this.currentTokenizerState = TokenizerState.BOGUS_COMMENT_STATE;
        }
    }

    handleTagNameState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            this.currentTokenizerState = TokenizerState.BEFORE_ATTRIBUTE_NAME_STATE;
        } else if(currentInputCharacter === '/') {
            this.currentTokenizerState = TokenizerState.SELF_CLOSING_START_TAG_STATE;
        } else if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(Util.isAlpha(currentInputCharacter) && Util.isUpperCase(currentInputCharacter)) {
            this.currentToken.name += currentInputCharacter.toLowerCase();
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.name += String.fromCodePoint(0xFFFD);
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.name += currentInputCharacter;
        }
    }

    handleBogusCommentState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(currentInputCharacter === undefined) {
            this.emitToken(this.currentToken);
            this.emitToken(new Tokens.EOF());
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.name += String.fromCodePoint(0xFFFD);
        } else {
            this.currentToken.name += currentInputCharacter;
        }
    }

    handleBeforeAttributeNameState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            // Ignore the character
        } else if(currentInputCharacter === '/' ||
                  currentInputCharacter === '>' ||
                  currentInputCharacter === undefined) {
            this.index--;
            this.currentTokenizerState = TokenizerState.AFTER_ATTRIBUTE_NAME_STATE;
        } else if(currentInputCharacter === '=') {
            // unexpected-equals-sign-before-attribute-name parse error
            this.currentToken.attributes.push(new Tokens.Attribute(currentInputCharacter));
        } else {
            this.currentToken.attributes.push(new Tokens.Attribute());
            this.index--;
            this.currentTokenizerState = TokenizerState.ATTRIBUTE_NAME_STATE;
        }
    }

    handleSelfClosingStartTagState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '>') {
            this.currentToken.selfClosing = true;
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            this.emitToken(new Tokens.EOF());
        } else {
            // unexpected-solidus-in-tag parse error
            this.index--;
            this.currentTokenizerState = TokenizerState.BEFORE_ATTRIBUTE_NAME_STATE;
        }
    }

    handleAfterAttributeNameState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            // Ignore the character
        } else if(currentInputCharacter === '/') {
            this.currentTokenizerState = TokenizerState.SELF_CLOSING_START_TAG_STATE;
        } else if(currentInputCharacter === '=') {
            this.currentTokenizerState = TokenizerState.BEFORE_ATTRIBUTE_VALUE_STATE;
        } else if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.attributes.push(new Tokens.Attribute());
            this.index--;
            this.currentTokenizerState = TokenizerState.ATTRIBUTE_NAME_STATE;
        }
    }

    handleAttributeNameState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ' ||
           currentInputCharacter === '/' ||
           currentInputCharacter === '>' ||
           currentInputCharacter === undefined) {
            this.index--;
            this.currentTokenizerState = TokenizerState.AFTER_ATTRIBUTE_NAME_STATE;
        } else if(currentInputCharacter === '=') {
            this.currentTokenizerState = TokenizerState.BEFORE_ATTRIBUTE_VALUE_STATE;
        } else if(Util.isAlpha(currentInputCharacter) && Util.isUpperCase(currentInputCharacter)) {
            this.currentToken.attributes[this.currentToken.attributes.length-1].name += currentInputCharacter.toLowerCase();
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.name += String.fromCodePoint(0xFFFD);
        } else if(currentInputCharacter === '"' ||
                  currentInputCharacter === '\'' ||
                  currentInputCharacter === '<') {
            // unexpected-character-in-attribute-name parse error
            this.currentToken.attributes[this.currentToken.attributes.length-1].name += currentInputCharacter;
        } else {
            this.currentToken.attributes[this.currentToken.attributes.length-1].name += currentInputCharacter;
        }

        /*
        When the user agent leaves the attribute name state (and before emitting the tag token, if appropriate), the complete attribute's name must be compared to the other attributes on the same token; if there is already an attribute on the token with the exact same name, then this is a duplicate-attribute parse error and the new attribute must be removed from the token.
        */
    }

    handleCommentStartState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '-') {
            this.currentTokenizerState = TokenizerState.COMMENT_START_DASH_STATE;
        } else if(currentInputCharacter === '>') {
            // abrupt-closing-of-empty-comment parse error
            this.currentTokenizerState = TokenizerState.DATA_STATE;
        } else {
            this.index--;
            this.currentTokenizerState = TokenizerState.COMMENT_STATE;
        }
    }

    handleDocTypeState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            this.currentTokenizerState = TokenizerState.BEFORE_DOCTYPE_NAME_STATE;
        } else if(currentInputCharacter === '>') {
            this.index--;
            this.currentTokenizerState = TokenizerState.BEFORE_DOCTYPE_NAME_STATE;
        } else if(currentInputCharacter === undefined) {
            // eof-in-doctype parse error
            this.unimplimented();
        } else {
            // missing-whitespace-before-doctype-name parse error
            this.index--;
            this.currentTokenizerState = TokenizerState.BEFORE_DOCTYPE_NAME_STATE;
        }
    }

    handleBeforeDocTypeNameState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            // Ignore the character
        } else if(Util.isAlpha(currentInputCharacter) && Util.isUpperCase(currentInputCharacter)) {
            let docTypeToken = new Tokens.DocType();
            docTypeToken.name = currentInputCharacter.toLowerCase(); 
            this.currentToken = docTypeToken;
            this.currentTokenizerState = TokenizerState.DOCTYPE_NAME_STATE;
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            let docTypeToken = new Tokens.DocType();
            docTypeToken.name = String.fromCodePoint(0xFFFD); 
            this.currentToken = docTypeToken;
            this.currentTokenizerState = TokenizerState.DOCTYPE_NAME_STATE;
        } else if(currentInputCharacter === '>') {
            // missing-doctype-name parse error
            let docTypeToken = new Tokens.DocType();
            docTypeToken.forceQuirks = true;
            this.currentToken = docTypeToken;
            this.currentTokenizerState = TokenizerState.DATA_STATE;
        } else if(currentInputCharacter === undefined) {
            // eof-in-doctype parse error
            let docTypeToken = new Tokens.DocType();
            docTypeToken.forceQuirks = true;
            this.emitToken(docTypeToken);
            this.emitToken(new Tokens.EOF());
        } else {
            let docTypeToken = new Tokens.DocType();
            docTypeToken.name = currentInputCharacter;
            this.currentToken = docTypeToken;
            this.currentTokenizerState = TokenizerState.DOCTYPE_NAME_STATE;
        }
    }

    handleDocTypeNameState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            this.currentTokenizerState = TokenizerState.AFTER_DOCTYPE_NAME_STATE;
        } else if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(Util.isAlpha(currentInputCharacter) && Util.isUpperCase(currentInputCharacter)) {
            this.currentToken.name += currentInputCharacter.toLowerCase(); 
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.name += String.fromCodePoint(0xFFFD);
        } else if(currentInputCharacter === undefined) {
            // eof-in-doctype parse error
            this.currentToken.forceQuirks = true;
            this.emitToken(this.currentToken);
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.name += currentInputCharacter; 
        }
    }

    handleAfterDocTypeNameState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            // Ignore the character
        } else if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(currentInputCharacter === undefined) {
            // eof-in-doctype parse error
            this.currentToken.forceQuirks = true;
            this.emitToken(this.currentToken);
            this.emitToken(new Tokens.EOF());
        } else {
            this.unimplimented();
        }
    }

    handleBeforeAttributeValueState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            // Ignore the character
        } else if(currentInputCharacter === '"') {
            this.currentTokenizerState = TokenizerState.ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;
        } else if(currentInputCharacter === '\'') {
            this.currentTokenizerState = TokenizerState.ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE;
        } else if(currentInputCharacter === '>') {
            // missing-attribute-value parse error
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else {
            this.index--;
            this.currentTokenizerState = TokenizerState.ATTRIBUTE_VALUE_UNQUOTED_STATE;
        }
    }

    handleAttributeValueDoubleQuotedState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '"') {
            this.currentTokenizerState = TokenizerState.AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;
        } else if(currentInputCharacter === '&') {
            this.returnState = TokenizerState.ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;
            this.currentTokenizerState = TokenizerState.CHARACTER_REFERENCE_STATE;
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.attributes[this.currentToken.attributes.length-1].value += String.fromCodePoint(0xFFFD);
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            thie.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.attributes[this.currentToken.attributes.length-1].value += currentInputCharacter;
        }
    }

    handleAttributeValueSingleQuotedState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\'') {
            this.currentTokenizerState = TokenizerState.AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;
        } else if(currentInputCharacter === '&') {
            this.returnState = TokenizerState.ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE;
            this.currentToken = TokenizerState.CHARACTER_REFERENCE_STATE;
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.attributes[this.currentToken.attributes.length-1].value += String.fromCodePoint(0xFFFD);
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            thie.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.attributes[this.currentToken.attributes.length-1].value += currentInputCharacter;
        }
    }

    handleAttributeValueUnquotedState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            this.currentTokenizerState = TokenizerState.BEFORE_ATTRIBUTE_NAME_STATE;
        } else if(currentInputCharacter === '&') {
            this.returnState = TokenizerState.ATTRIBUTE_VALUE_UNQUOTED_STATE;
            this.currentTokenizerState = TokenizerState.CHARACTER_REFERENCE_STATE;
        } else if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.attributes[this.currentToken.attributes.length-1].value += String.fromCodePoint(0xFFFD);
        } else if(currentInputCharacter === '"' ||
                  currentInputCharacter === '\'' ||
                  currentInputCharacter === '<' ||
                  currentInputCharacter === '=' ||
                  currentInputCharacter === '`') {
            // unexpected-character-in-unquoted-attribute-value parse error
            this.currentToken.attributes[this.currentToken.attributes.length-1].value += currentInputCharacter;
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.attributes[this.currentToken.attributes.length-1].value += currentInputCharacter;
        }
    }

    handleAfterAttributeValueQuotedState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '\t' ||
           currentInputCharacter === '\u000A' ||
           currentInputCharacter === '\f' ||
           currentInputCharacter === ' ') {
            this.currentTokenizerState = TokenizerState.BEFORE_ATTRIBUTE_NAME_STATE;
        } else if(currentInputCharacter === '/') {
            this.currentTokenizerState = TokenizerState.SELF_CLOSING_START_TAG_STATE;
        } else if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            this.emitToken(this.currentToken);
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            this.emitToken(new Tokens.EOF());
        } else {
            // missing-whitespace-between-attributes parse error
            this.index--;
            this.currentTokenizerState = TokenizerState.BEFORE_ATTRIBUTE_NAME_STATE;
        }
    }

    handleChracterReferenceState() {
        this.temporaryBuffer = '';
        this.temporaryBuffer += '&';
        let currentInputCharacter = this.input[this.index++];

        if(Util.isAlpha(currentInputCharacter) || Util.isDigit(currentInputCharacter)) {
            this.index--;
            this.currentTokenizerState = TokenizerState.NAMED_CHARACTER_REFERENCE_STATE;
        } else if(currentInputCharacter === '#') {
            this.temporaryBuffer += currentInputCharacter;
            this.currentTokenizerState = TokenizerState.NUMERIC_CHARACTER_REFERENCE_STATE;
        } else {
            this.flushCodePoints();
            this.index--;
            this.currentTokenizerState = this.returnState;
        }
    }

    handleNamedCharacterReferenceState() {
        // Hacky. assumes a semicolon is not ommited
        let semiColonIndex = this.input.indexOf(';', this.index);
        let entity = Entities['&' + this.input.substring(this.index, semiColonIndex)];
        if(entity) {
            this.temporaryBuffer += String.fromCodePoint(entity.codepoints[0]);
            // Flush code points consumed as a character reference
            this.currentTokenizerState = this.returnState;
        } else {
            this.flushCodePoints();
            this.currentTokenizerState = TokenizerState.AMBIGUOUS_AMPERSAND_STATE;
        }    
    }

    handleNumericCharacterReferenceState() {
        this.characterReferneceCode = 0;
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === 'x' || currentInputCharacter === 'X') {
            this.temporaryBuffer += currentInputCharacter;
            this.currentTokenizerState = TokenizerState.HEXADECIMAL_CHARACTER_REFERENCE_START_STATE;
        } else {
            this.index--;
            this.currentTokenizerState = TokenizerState.DECIMAL_CHARACTER_REFERENCE_START_STATE;
        }
    }

    handleCommentStartDashState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '-') {
            this.currentTokenizerState = TokenizerState.COMMENT_END_STATE;
        } else if(currentInputCharacter === '>') {
            // abrupt-closing-of-empty-comment parse error
            this.currentTokenizerState = TokenizerState.DATA_STATE
            // Emit the current comment token
        } else if(currentInputCharacter === undefined) {
            // eof-in-comment parse error
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.data += '-';
            this.index--;
            this.currentTokenizerState = TokenizerState.COMMENT_STATE;
        }
    }

    handleCommentState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '<') {
            this.currentToken.data += currentInputCharacter;
            this.currentTokenizerState = TokenizerState.COMMENT_LESS_THAN_SIGN_STATE;
        } else if(currentInputCharacter === '-') {
            this.currentTokenizerState = TokenizerState.COMMENT_END_DASH_STATE;
        } else if(currentInputCharacter === '\0') {
            // unexpected-null-character parse error
            this.currentToken.name += String.fromCodePoint(0xFFFD);
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.data += currentInputCharacter;
        }
    }

    handleCommentLessThanSignState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '!') {
            this.currentToken.data += currentInputCharacter;
            this.currentTokenizerState = TokenizerState.COMMENT_LESS_THAN_SIGN_BANG_STATE;
        } else if(currentInputCharacter === '<') {
            this.currentToken.data += currentInputCharacter;
        } else {
            this.index--;
            this.currentTokenizerState = TokenizerState.COMMENT_STATE;
        }
    }

    handleCommentEndDashState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '-') {
            this.currentTokenizerState = TokenizerState.COMMENT_END_STATE;
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            // Emit the current comment token
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.data += '-';
            this.index--;
            this.currentTokenizerState = TokenizerState.COMMENT_STATE;
        }
    }

    handleCommentLessThanSignBangState() {
        this.unimplimented();
    }

    handleCommentEndState() {
        let currentInputCharacter = this.input[this.index++];

        if(currentInputCharacter === '>') {
            this.currentTokenizerState = TokenizerState.DATA_STATE;
            // Emit the current comment token
        } else if(currentInputCharacter === '!') {
            this.currentTokenizerState = TokenizerState.COMMENT_END_BANG_STATE;
        } else if(currentInputCharacter === '-') {
            this.currentToken.data += '-';
        } else if(currentInputCharacter === undefined) {
            // eof-in-tag parse error
            // Emit the current comment token
            this.emitToken(new Tokens.EOF());
        } else {
            this.currentToken.data += '--';
            this.index--;
            this.currentTokenizerState = TokenizerState.COMMENT_STATE;
        }
    }

    handleCommentEndBangState() {
        this.unimplimented();
    }

    handleAmbiguousAmpersandState() {
        let currentInputCharacter = this.input[this.index++];

        if(Util.isAlpha(currentInputCharacter) || Util.isDigit(currentInputCharacter)) {
            if(this.partOfAttribute()) {
                this.currentToken.attributes[this.currentToken.attributes.length-1].value += currentInputCharacter;
            } else {
                this.emitToken(new Tokens.Character(currentInputCharacter));
            }
        } else if(currentInputCharacter === ';') {
            // unknown-named-character-reference parse error
            this.index--;
            this.currentTokenizerState = this.returnState;
        } else {
            this.index--;
            this.currentTokenizerState = this.returnState;
        }
    }

    handleDecimalCharacterReferenceStartState() {
        let currentInputCharacter = this.input[this.index++];

        if(Util.isDigit(currentInputCharacter)) {
            this.index--;
            this.currentTokenizerState = TokenizerState.DECIMAL_CHARACTER_REFERENCE_STATE;
        } else {
            // absence-of-digits-in-numeric-character-reference parse error
            this.flushCodePoints();
            this.index--;
            this.currentTokenizerState = this.returnState;
        }
    }

    handleHexadecimalCharacterReferenceState() {
        this.unimplimented();
    }

    handleDecimaleCharacterReferenceState() {
        let currentInputCharacter = this.input[this.index++];

        if(Util.isDigit(currentInputCharacter)) {
            this.characterReferenceCode *= 10;
            this.characterReferenceCode += currentInputCharacter;
        } else if(currentInputCharacter === ';') {
            this.currentTokenizerState = TokenizerState.NUMERIC_CHARACTER_REFERENCE_END_STATE;
        } else {
            // missing-semicolon-after-character-reference parse error
            this.index--;
            this.currentTokenizerState = TokenizerState.NUMERIC_CHARACTER_REFERENCE_END_STATE;
        }
    }

    handleNumericCharacterReferenceEndState() {
        if(this.characterReferenceCode === 0x00) {
            // null-character-reference parse error
            this.characterReferneceCode = 0xFFFD;
        } else if(this.characterReferenceCode > 0x10FFFF) {
            // character-reference-outside-unicode-range parse error
            this.characterReferneceCode = 0xFFFD;
        } else if(Util.isSurrogate(this.characterReferenceCode)) {
            // surrogate-character-reference parse error
            this.currentTokenizerState = 0xFFFD;
        } else if(Util.isNonCharacter(this.characterReferenceCode)) {
            // noncharacter-character-reference parse error
        } else if(this.characterReferenceCode === 0x0D || (Util.isControl(this.characterReferenceCode) && !Util.isWhiteSpace(this.characterReferenceCode))) {
            // control-character-reference parse error
        } else if(NumericCharacters[this.characterReferenceCode] !== undefined) {
            this.characterReferneceCode = NumericCharacters[this.characterReferenceCode];
        }
        // Always happens?
        this.temporaryBuffer = '';
        this.temporaryBuffer += String.fromCodePoint(this.characterReferenceCode);
        this.flushCodePoints();
        this.currentTokenizerState = this.returnState;
    }

    handleCDATASectionState() {
        this.unimplimented();
    }
}

export default Tokenizer;