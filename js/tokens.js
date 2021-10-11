class Token {}

class StartTag extends Token {
    name;
    properties = [];

    constructor(name, properties) {
        super();
        this.name = name;
        this.properties = properties;
    }

    emit() {
        let htmlString;
        if(this.properties.length > 0) {
            htmlString = `<details><summary>StartTag [${this.name}]</summary>`;
            let propertiesString = '';
            for(let property of this.properties) {
                propertiesString += property.emit();
            }
            htmlString += `<div class="child">${propertiesString}</div></details>`
        } else {
            htmlString = `<div class="empty-parent">StartTag [${this.name}]</div>`
        }
        return htmlString;
    }
}

class EndTag extends Token {
    name;
    
    constructor(name) {
        super();
        this.name = name;
    }
    
    emit() {
        return `<div class="empty-parent">EndTag [${this.name}]</div>`
    }
}

class Property extends Token {
    name;
    value;

    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
    
    emit() {
        return `<div>Property [${this.name}=${this.value}]</div>`
    }
}

class TextContent extends Token {
    content;

    constructor(content) {
        super();
        this.content = content;
    }
    
    emit() {
        return `<details><summary>TextContent</summary><div class="child">"${this.content}"</div></details>`
    }
}

export {Token, StartTag, EndTag, Property, TextContent};