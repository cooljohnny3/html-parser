import {StartTag, EndTag, Property, TextContent} from './tokens.js';

class Lexer {
    tokens =  [];
    index = 0;

    constructor() {

    }

    tokenize(input) {
        while(input[this.index]) {
            if(this.checkWhiteSpace(input[this.index])) {
                this.consumewhiteSpace(input);
            }
            if(input[this.index] === '<') {
                this.index++;
                this.consumewhiteSpace(input);
                let tagName;
                if(input[this.index] === '/') {
                    this.index++;
                    tagName = this.consumeTagName(input);
                    this.tokens.push(new EndTag(tagName));
                } else {
                    tagName = this.consumeTagName(input);
                    let properties = this.consumeProperties(input);
                    this.tokens.push(new StartTag(tagName, properties));
                }
                this.index++;
            } else {
                let textContent = this.consumeTextContent(input);
                this.tokens.push(new TextContent(textContent));
            }
        }
        return this.tokens;
    }

    consumewhiteSpace(input) {
        while(this.checkWhiteSpace(input[this.index])) {
            this.index++;
        }
    }

    checkWhiteSpace(char) {
        return /\s/.test(char);
    }

    consumeTagName(input) {
        let tagName = '';
        while(input[this.index] && input[this.index] !== ' ' && input[this.index] !== '>') {
            tagName += input[this.index];
            this.index++;
        }
        if(input[this.index] !== '>') this.consumewhiteSpace(input);
        return tagName;
    }

    consumeProperties(input) {
        let properties = [];
        let propertyName, propertyValue;
        while(input[this.index] && input[this.index] !== '>') {
            this.consumewhiteSpace(input);
            propertyName = this.consumePropertyName(input);
            this.index++;   // =
            this.consumewhiteSpace(input);
            let startingQuote = input[this.index];
            this.index++;   // " or '
            this.consumewhiteSpace(input);
            propertyValue = this.consumePropertyValue(input, startingQuote);
            properties.push(new Property(propertyName, propertyValue));
            this.index++;   // " or '
            this.consumewhiteSpace(input);
        }
        return properties;
    }

    consumePropertyName(input) {
        let propertyName = '';
        while(input[this.index] && input[this.index] !== '=') {
            propertyName += input[this.index];
            this.index++;
        }
        return propertyName.trim();
    }

    consumePropertyValue(input, startingQuote) {
        let propertyValue = '';
        while(input[this.index] && input[this.index] !== startingQuote) {
            propertyValue += input[this.index];
            this.index++;
        } 
        return propertyValue.trimEnd();
    }

    consumeTextContent(input) {
        this.consumewhiteSpace(input);
        let content = '';
        while(input[this.index] && input[this.index] !== '<') {
            content += input[this.index];
            this.index++;
            // TODO: consume extra whitespace
        }
        return content;
    }

    emitTokens() {
        let tokenHTML = '';
        for(let token of this.tokens) {
            tokenHTML += token.emit();
        }
        return tokenHTML;
    }
}

export default Lexer;