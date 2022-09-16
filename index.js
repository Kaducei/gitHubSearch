const requestURL = "https://api.github.com/search/repositories?q=";
const searchInput = document.querySelector(".search__input");
const searchDropdown = document.querySelector(".search__dropdown");
const repos = document.querySelector(".repos");

const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, arguments), delay);
  };
};

async function fetchData(value) {
  return fetch(requestURL + value + "&per_page=5").then((data) => {
    data.json().then((response) => {
      const repositories = response.items;
      const repFragment = document.createDocumentFragment();
      repositories.forEach((repo) => {
        const newElem = document.createElement("li");
        newElem.textContent = repo.full_name;
        newElem.addEventListener("click", () => {
          createSelectElement(
            repo.name,
            repo.owner.login,
            repo.stargazers_count,
            repo.html_url
          );
          searchDropdown.innerHTML = "";
          searchInput.value = "";
        });
        repFragment.appendChild(newElem);
      });
      searchDropdown.innerHTML = "";
      searchDropdown.appendChild(repFragment);
    });
  });
}

function inputChange(event) {
  fetchData(event.target.value);
}
inputChange = debounce(inputChange, 500);

searchInput.addEventListener("input", inputChange);

function createSelectElement(name, owner, stars, link) {
  const elemFragment = document.createDocumentFragment();
  const newRep = document.createElement("li");
  const repoLink = document.createElement("a");

  repoLink.setAttribute("href", link);
  repoLink.setAttribute("target", "_blank");
  repoLink.textContent = name;

  const elemName = document.createElement("h4");
  elemName.appendChild(repoLink);
  newRep.appendChild(elemName);

  const elemOwner = document.createElement("div");
  elemOwner.textContent = owner;
  newRep.appendChild(elemOwner);

  const elemStars = document.createElement("div");
  elemStars.textContent = "☆" + stars;
  newRep.appendChild(elemStars);

  const deleteBtn = document.createElement("button");
  newRep.appendChild(deleteBtn);
  deleteBtn.addEventListener("click", () => {
    newRep.classList.add("cancel");
  });

  elemFragment.appendChild(newRep);
  repos.appendChild(elemFragment);
}
