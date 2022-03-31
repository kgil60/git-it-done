let userFormEl = document.getElementById("user-form");
let nameInputEl = document.getElementById("username");
let repoContainerEl = document.getElementById("repos-container");
let repoSearchTerm = document.getElementById("repo-search-term");
let languageButtonsEl = document.getElementById("language-buttons");

function getUserRepos(user) {
    const apiUrl = `https://api.github.com/users/${user}/repos`
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            })
        } else {
            alert("Error: GitHub user not found");
        }
    })
    .catch(function(error) {
        alert("Error: unable to connect to GitHub");
    })
};

function formSubmitHandler(event) {
    event.preventDefault();
    
    // get value from input el
    const username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
}

function displayRepos(repos, searchTerm) {

    if(repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    for (let i=0; i<repos.length; i++) {
        // format repo name
        const repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repo
        const repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create span el to hold repo name
        const titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create status el
        const statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to dom
        repoContainerEl.appendChild(repoEl);
    }
}

function getFeaturedRepos(language) {
    const apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language)
            })
        } else {
            alert("Error: GitHub user not found");
        }
    })
}

function buttonClickHandler(event) {
    const language = event.target.getAttribute("data-language");

    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }

}

userFormEl.addEventListener("submit", formSubmitHandler);

languageButtonsEl.addEventListener("click", buttonClickHandler);