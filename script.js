// Defining the constants and applying javascript DOM manipulation
const submitButton = document.querySelector('#submit');
const input = document.querySelector('#input');
const errorSpan = document.querySelector('#error');
const resultsContainer = document.querySelector('#results');

const endPoint = 'https://en.wikipedia.org/w/api.php?';

// Here we DEFINE the params
const params = {
    origin: '*',
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exchars: 250,
    exintro: true,
    explaintext: true,
    generator: 'search',
    gsrlimit: 20,
};

// Disabled is a boolean attribute that is used to disable an element.
const disableUi = () => {
    input.disabled = true;
    submitButton.disabled = true;
};

const enableUi = () => {
    input.disabled = false;
    submitButton.disabled = false;
};

// With innerHTML we can modify the content of an element.
const clearPreviousResults = () => {
    resultsContainer.innerHTML = '';
    errorSpan.innerHTML = '';
};

// !(NOT) and || (OR)
const isInputEmpty = input => {
    if (!input || input === '') return true;
    return false;
};

// ${} Is used to call one or more variables, in this case we use to call the errorSpan.
const showError = error => {
    errorSpan.innerHTML = `🚨 ${error} 🚨`;
};

// Show Results using forEach, we use forEach for iterating over an array.
const showResults = results => {
    results.forEach(result => {
        resultsContainer.innerHTML += `
        <div class="results__item">
            <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                <h2 class="results__item__title">${result.title}</h2>
                <p class="results__item__intro">${result.intro}</p>
            </a>
        </div>
    `;
    });
};

// Here we use .map, .map is used to iterate over an array and return a new array.
const gatherData = pages => {
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));

    showResults(results);
};

// Here we use async - await to make the code wait for the response from the server.
const getData = async () => {
    const userInput = input.value;
    if (isInputEmpty(userInput)) return;

    params.gsrsearch = userInput;
    clearPreviousResults();
    disableUi();

    // Here we use: try, catch and finally. try is used to execute a code block and catch is used to catch an error.
    try {
        const { data } = await axios.get(endPoint, { params });
        // Throw is used to explicitly throw an exception.
        // New allows developers to create an instance of a user-defined object type.
        if (data.error) throw new Error(data.error.info);
        gatherData(data.query.pages);
        // If there were no errors then the catch is ignored.
    } catch (error) {
        showError(error);
        // After all finally is used to execute a code block.
    } finally {
        enableUi();
    }
};

const handleKeyEvent = e => {
    if (e.key === 'Enter') {
        getData();
    }
};

// addEventListener Register an event to a specific object
const registerEventHandlers = () => {
    input.addEventListener('keydown', handleKeyEvent);
    submitButton.addEventListener('click', getData);
};

registerEventHandlers();
