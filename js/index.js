document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsList = document.getElementById("results-list");
  const reposList = document.getElementById("repos-list");
  const toggleBtn = document.getElementById("toggle-mode");

  let mode = "user"; // or "repo"

  toggleBtn.addEventListener("click", () => {
    mode = mode === "user" ? "repo" : "user";
    toggleBtn.textContent = mode === "user" ? "Switch to Repo Search" : "Switch to User Search";
    input.placeholder = mode === "user" ? "Search GitHub users" : "Search GitHub repos";
    resultsList.innerHTML = "";
    reposList.innerHTML = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    resultsList.innerHTML = "";
    reposList.innerHTML = "";

    if (mode === "user") {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
        .then(res => res.json())
        .then(data => {
          data.items.forEach(user => {
            const li = document.createElement("li");
            li.innerHTML = `
              <img src="${user.avatar_url}" width="50" />
              <a href="${user.html_url}" target="_blank">${user.login}</a>
              <button data-user="${user.login}">View Repos</button>
            `;
            resultsList.appendChild(li);
          });
        });
    } else {
      // Repo search 
      fetch(`https://api.github.com/search/repositories?q=${query}`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
        .then(res => res.json())
        .then(data => {
          data.items.forEach(repo => {
            const li = document.createElement("li");
            li.innerHTML = `
              <a href="${repo.html_url}" target="_blank">${repo.full_name}</a>
              <p>${repo.description || "No description"}</p>
            `;
            resultsList.appendChild(li);
          });
        });
    }
  });

  // event to handle repo fetch on button click
  resultsList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.user) {
      const username = e.target.dataset.user;
      reposList.innerHTML = `<li>Loading ${username}'s repos...</li>`;

      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
        .then(res => res.json())
        .then(repos => {
          reposList.innerHTML = "";
          repos.forEach(repo => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            reposList.appendChild(li);
          });
        });
    }
  });
});
