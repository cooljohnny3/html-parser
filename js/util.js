export function isAlpha(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return (codePoint >= 0x0041 && codePoint <= 0x005A) || (codePoint >= 0x0061 && codePoint <= 0x007A);
}

export function isDigit(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return (codePoint >= 0x0030 && codePoint <= 0x0039);
}

export function isWhiteSpace(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return codePoint === 0x0009 || codePoint === 0x000A || codePoint === 0x000C || codePoint === 0x000D || codePoint === 0x0020;
}

export function isUpperCase(char) {
    if(char === undefined) return false;
    return char.toUpperCase(char) === char;
}

export function isLowerCase(char) {
    if(char === undefined) return false;
    return char.toLowerCase(char) === char;
}

export function isSurrogate(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return codePoint >= 0xD800 && codePoint <= 0xDFFF;
}

export function isNonCharacter(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return (codePoint >= 0xFDD0 && codePoint <= 0xFDEF) ||
    codePoint === 0xFFFE ||
    codePoint === 0xFFFF ||
    codePoint === 0xFFFE ||
    codePoint === 0x1FFFF ||
    codePoint === 0x2FFFE ||
    codePoint === 0x2FFFF ||
    codePoint === 0x3FFFE ||
    codePoint === 0x3FFFF ||
    codePoint === 0x4FFFE ||
    codePoint === 0x4FFFF ||
    codePoint === 0x5FFFE ||
    codePoint === 0x5FFFF ||
    codePoint === 0x6FFFE ||
    codePoint === 0x6FFFF ||
    codePoint === 0x7FFFE ||
    codePoint === 0x7FFFF ||
    codePoint === 0x8FFFE ||
    codePoint === 0x8FFFF ||
    codePoint === 0x9FFFE ||
    codePoint === 0x9FFFF ||
    codePoint === 0xAFFFE ||
    codePoint === 0xAFFFF ||
    codePoint === 0xBFFFE ||
    codePoint === 0xBFFFF ||
    codePoint === 0xCFFFE ||
    codePoint === 0xCFFFF ||
    codePoint === 0xDFFFE ||
    codePoint === 0xDFFFF ||
    codePoint === 0xEFFFE ||
    codePoint === 0xEFFFF ||
    codePoint === 0xFFFFE ||
    codePoint === 0xFFFFF ||
    codePoint === 0x10FFFE ||
    codePoint === 0x10FFFF;
}

export function isC0Control(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return codePoint >= 0x0000 && codePoint <= 0x001F;
}

export function isC0ControlOrSpace(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return isC0Control(char) || codePoint === 0x0020;
}

export function isControl(char) {
    if(char === undefined) return false;
    let codePoint = char.codePointAt(0);
    return isC0Control(char) || (codePoint >= 0x007F && codePoint <= 0x009F);
}