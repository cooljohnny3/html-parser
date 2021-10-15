import Parser  from './js/parser.js';

async function tokenize() {
    let resultsDiv = document.getElementById('results-content');
    clearResults(resultsDiv);
    await toggleLoading();


    let input = document.getElementById('markup-input').value;
    let parser = new Parser();
    let tokens;
    try {
        tokens = parser.parse(input);
    }  catch(e) {
        toggleLoading();
        console.error(e);
        return;
    }

    let tempString = '';
    for(let token of tokens) {
        tempString += token.toString();
    }
    
    let newNode = document.createElement('div');
    newNode.innerHTML += tempString;
    resultsDiv.appendChild(newNode);
    await toggleLoading();
}

function updateDOM() {
    // "Update"
    return new Promise(r => setTimeout(r, 0));
}

async function toggleLoading() {
    let lodaingIcon = document.getElementById("loader");
    if(lodaingIcon.style.display === "none") {
        lodaingIcon.style.display = "block"
    } else {
        lodaingIcon.style.display = "none";
    }
    await updateDOM();
}

function clearResults(resultsDiv) {
    if(resultsDiv.children.length > 1)
        resultsDiv.removeChild(resultsDiv.children[1]);
}

function expandResults() {
    let detailsElements = document.getElementsByTagName('details');

    for(let element of detailsElements) {
        element.open = true;
    }
}

function collapseResults() {
    let detailsElements = document.getElementsByTagName('details');

    for(let element of detailsElements) {
        element.open = false;
    }
}

document.getElementById('submit-button').addEventListener('click', () => tokenize());
document.getElementById('expand-button').addEventListener('click', expandResults);
document.getElementById('collapse-button').addEventListener('click', collapseResults);
document.getElementById('markup-input').value = document.documentElement.outerHTML;