const issueContainerEl = document.getElementById("issues-container");
const limitWarningEl = document.getElementById("limit-warning");

function getRepoIssues(repo) {
    const apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            })
        } else {
            alert("There was a problem");
        }
    })
}

function displayIssues(issues) {

    if (issues.length === 0) {
        issueContainerEl.textContent = "No open issues were found.";
        return;
    }

    for (let i=0; i<issues.length; i++) {
        // create link el to take users to issue on github
        const issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        const titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create type el
        const typeEl = document.createElement("span");

        // check if issue is actual issue or pr
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
}

function displayWarning(repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    const linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", `https://github.com/${repo}/issues`);
    linkEl.setAttribute("target", "_blank");

    limitWarningEl.appendChild(linkEl);
}

getRepoIssues("facebook/react");