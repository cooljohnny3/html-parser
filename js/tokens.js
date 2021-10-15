class Token {}

class DocType extends Token {
    name = '';
    publicIdentifier;
    systemIdentifier;
    forceQuirks = false;

    constructor() {
        super();
    }

    toString() {
        return `<details><summary>DocType</summary><div class="child">name=${this.name}</div></details>`;
    }
}

class Attribute {
    name = '';
    value = '';

    constructor(name='') {
        this.name = name;
    }

    toString() {
        return `<div>Attribute [name="${this.name}", value="${this.value}"]</div>`;
    }
}

class StartTag extends Token {
    name = '';
    selfClosing = false;
    attributes = [];

    constructor() {
        super();
    }

    toString() {
        let attributeString = '';
        for(let attribute of this.attributes) {
            attributeString += '<div class="child">' + attribute.toString() + '</div>';
        }
        return `<details><summary>StartTag</summary><div class="child">name="${this.name}"</div><details class="child"><summary>attributes:</summary>${attributeString}</details></details>`;
    }
}

class EndTag extends Token {
    name = '';
    selfClosing = false;
    attributes = [];
    
    constructor() {
        super();
    }

    toString() {
        let attributeString = '';
        for(let attribute of this.attributes) {
            attributeString += '<div class="child">' + attribute.toString() + '</div>';
        }
        return `<details><summary>EndTag</summary><div class="child">name="${this.name}"</div><details class="child"><summary>attributes:</summary>${attributeString}</details></details>`;
    }
}

class Comment extends Token {
    data = '';

    constructor() {
        super();
    }

    toString() {
        return `<div>Comment[data="${this.data}"]</div>`;
    }
}

class Character extends Token {
    data = '';

    constructor(data='') {
        super();
        this.data = data;
    }

    toString() {
        return `<div>Character[data="${this.data}"]</div>`;
    }
}

class EOF extends Token {
    toString() {
        return 'EOF';
    }
}

export {Token, DocType, Attribute, StartTag, EndTag, Comment, Character, EOF};