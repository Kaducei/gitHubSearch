const requestURL = "https://api.github.com/search/repositories?q=";
const searchInput = document.querySelector(".search__input");
const searchDropdown = document.querySelector(".search__dropdown");
const collection = document.querySelector(".repos");

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
      repositories.forEach((repositoriy) => {
        const newElement = document.createElement("li");
        newElement.textContent = repositoriy.full_name;
        newElement.addEventListener("click", () => {
          createSelectElement(
            repositoriy.name,
            repositoriy.owner.login,
            repositoriy.stargazers_count,
            repositoriy.html_url
          );
          searchDropdown.innerHTML = "";
          searchInput.value = "";
        });
        repFragment.appendChild(newElement);
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
  const elementFragment = document.createDocumentFragment();
  const newRepository = document.createElement("li");
  const repoLink = document.createElement("a");

  repoLink.setAttribute("href", link);
  repoLink.setAttribute("target", "_blank");
  repoLink.textContent = name;

  const elementName = document.createElement("h4");
  elementName.appendChild(repoLink);
  newRepository.appendChild(elementName);

  const elementOwner = document.createElement("div");
  elementOwner.textContent = owner;
  newRepository.appendChild(elementOwner);

  const elementStars = document.createElement("div");
  elementStars.textContent = "☆" + stars;
  newRepository.appendChild(elementStars);

  const deleteButton = document.createElement("button");
  newRepository.appendChild(deleteButton);
  deleteButton.addEventListener("click", () => {
    newRepository.onclick = null;
    newRepository.remove();
    newElement.removeEventListener();
  });

  elementFragment.appendChild(newRepository);
  collection.appendChild(elementFragment);
}
