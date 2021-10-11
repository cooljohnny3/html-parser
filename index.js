import Lexer  from './js/lexer.js';

function tokenize() {
    let input = document.getElementById('markup-input').value;
    let lexer = new Lexer();
    lexer.tokenize(input);

    let resultsDiv = document.getElementById('results-content');
    if(resultsDiv.children.length > 0)
        resultsDiv.removeChild(resultsDiv.children[0]);
    let newNode = document.createElement('div');
    newNode.innerHTML = lexer.emitTokens();
    resultsDiv.appendChild(newNode);
}

function expandResults() {
    let resultsDiv = document.getElementById('results-content');

    for(let element of resultsDiv.children[0].children) {
        element.open = true;
    }
}

function collapseResults() {
    let resultsDiv = document.getElementById('results-content');

    for(let element of resultsDiv.children[0].children) {
        element.open = false;
    }
}

document.getElementById('submit-button').addEventListener('click', () => tokenize());
document.getElementById('expand-button').addEventListener('click', expandResults);
document.getElementById('collapse-button').addEventListener('click', collapseResults);