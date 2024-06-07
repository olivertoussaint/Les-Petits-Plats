import { recipes } from "../data/recipes.js";
import { createFilterFactory, extractListTitles } from "./Factories/listFactories.js";
import { createARecipeFactory } from "./Factories/recipefactories.js";
import {
  filterRecipesByInput,
  filterRecipesByField,
  filterItemsByCategory,
  findArrayIntersection,
} from "./Utils/filters.js";
import { collapseDropdownMenu, toggleDropdownItem } from "./Utils/dropdown.js";

// ----------------- DOM
const mainInput = document.getElementById("searchBar");
const recipesContainer = document.getElementById("resultRecipes-container");
const noResultsContainer = document.getElementById("noResults");
const selectedTagContainer = document.getElementById(
  "advancedSelectedFilterTags-container"
);
const messageAside = document.getElementById("message");

const tagsMap = new Map();
let mainInputFilled = false;

// ----------------- Fonctions
// affiche les recettes une par une à partir d'un array de recettes filtré ou non
function displayRecipes(array) {
  const arrayLength = array.length;

  recipesContainer.innerHTML = "";
  const messageSpan = document.querySelector("#message span");
  messageSpan.innerHTML = "";
  let message;
  messageAside.classList.remove("opened");

  if (arrayLength !== 0) {
    array.map((recipe) =>
      recipesContainer.appendChild(createARecipeFactory(recipe).getRecipeCard())
    );
    noResultsContainer.style.display = "none";
    if (arrayLength > 1 && arrayLength < 10) {
      messageSpan.textContent = `${arrayLength} recettes trouvées à votre recherche.`;
      messageAside.classList.add("opened");
      setTimeout(function () {
        messageAside.classList.remove("opened");
      }, 3000);
    }
    if (arrayLength === 1) {
      messageSpan.textContent = `${arrayLength} recette trouvée à votre recherche.`;
      messageAside.classList.add("opened");
      setTimeout(function () {
        messageAside.classList.remove("opened");
      }, 3000);
    }
  } else {
    message =
      'Aucune recette ne correspond à votre recherche... Vous pouvez chercher "tarte aux pommes", "poisson", etc.';
    messageAside.classList.remove("opened");
    noResultsContainer.textContent = message;
    noResultsContainer.style.display = "flex";
  }
}

// affiche les boutons de filtres avec leur titre
function renderListButtons(array) {
  const listButtons = extractListTitles(array);
  listButtons.forEach((element) => createFilterFactory().createFilterBlock(element));
  return listButtons;
}

function renderItemsInDropdowns(array) {
  const filtersLists = createFilterFactory().generateFilterLists(array);
  for (const title in filtersLists) {
    const menuBlock = document.querySelector(`menu #${title}-list`);
    menuBlock.innerHTML = "";
    filtersLists[title].map((item) =>
      createFilterFactory().getListTemplate(item, title)
    );
  }
  removeTaggedItemsFromLists(tagsMap);
  return filtersLists;
}

// si un item est présent dans les tags alors le supprimer des listes
function removeTaggedItemsFromLists(tagsList) {
  if (tagsList.size > 0) {
    const displayedList = document.querySelectorAll(
      "div > menu > li > menu > li > button"
    );
    tagsList.forEach((_ListTitle, Item) => {
      for (const button of displayedList) {
        if (button.innerText.includes(Item)) {
          button.parentElement.remove();
        }
      }
    });
  }
}

// affiche le tag cliqué dans le container de tag
function displayTag(item, itemTitleList) {
  selectedTagContainer.appendChild(
    createFilterFactory().getItemTagTemplate(item, itemTitleList)
  );
}

// supprime de l'affichage le tag cliqué
function removeClickedTag(e) {
  selectedTagContainer.removeChild(e.target.parentNode.parentNode);
}

// ----------------- APPEL des fonctions

renderListButtons(recipes);
displayRecipes(recipes);
let filteredListsAdvancedField = renderItemsInDropdowns(recipes);

// ----------------- EVENTS LISTENERS
const dropdownMenuItems = document.querySelectorAll("div > menu > li");

function search() {
  let arrayFromMainInput = [];
  mainInput.addEventListener("input", (event) => {
    event.stopPropagation();
    selectedTagContainer.innerHTML = "";
    tagsMap.clear();
    if (event.target.value.length > 2) {
      mainInput.parentElement.removeAttribute("data-error-visible", true);
      mainInputFilled = true;
      arrayFromMainInput = filterRecipesByInput(event, recipes);
      displayRecipes(arrayFromMainInput);
      filteredListsAdvancedField = renderItemsInDropdowns(arrayFromMainInput);
    } else if (event.target.value.length < 3 && event.target.value.length > 0) {
      mainInput.parentElement.setAttribute("data-error-visible", true);
      mainInputFilled = false;
      displayRecipes(recipes);
      filteredListsAdvancedField = renderItemsInDropdowns(recipes);
    } else if (event.target.value.length === 0) {
      mainInput.parentElement.removeAttribute("data-error-visible");
    }
  });

  const dropdownFilterInputs = document.querySelectorAll(
    "div > menu > li > button > input"
  );
  dropdownFilterInputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      event.preventDefault();
      const listTitle = event.target.getAttribute("data-advanced-filter");
      const lists = filteredListsAdvancedField;
      const listFiltered = filterItemsByCategory(
        event.target.value,
        listTitle,
        lists
      );
      const tittledMenuBlock = document.querySelector(
        `menu #${listTitle}-list`
      );
      tittledMenuBlock.innerHTML = ""; // vide le menu des items
      listFiltered.map((item) =>
        createFilterFactory().getListTemplate(item, listTitle)
      ); // rempli le menu des items
    });
  });

  dropdownMenuItems.forEach((li) => {
    li.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdownItem(li, e, dropdownMenuItems);
      removeTaggedItemsFromLists(tagsMap);
      if (mainInputFilled === false) {
        if (
          e.target.toString().indexOf("Menu") === -1 &&
          !e.target.contains(li.firstChild) /* button */ &&
          !e.target.contains(li.firstChild.firstChild) /* son span */ &&
          !e.target.contains(
            li.firstChild.firstChild.nextSibling
          ) /* son input */
        ) {
          const itemTittleList = e.target.getAttribute("data-advanced-filter");
          const item = e.target.innerText;
          tagsMap.set(item, itemTittleList);
          selectedTagContainer.innerHTML = "";
          tagsMap.forEach((itemTitle, item) => displayTag(item, itemTitle));
          document.getElementById(`search-${itemTittleList}`).value = ""; // vide l'input
          if (tagsMap.size === 1) {
            tagsMap.forEach((itemTitleList, item) =>
              displayRecipes(
                filterRecipesByField(item, recipes, itemTitleList)
              )
            );
            tagsMap.forEach((itemTitleList, item) => {
              filteredListsAdvancedField = renderItemsInDropdowns(
                filterRecipesByField(item, recipes, itemTitleList)
              );
            });
          } else if (tagsMap.size > 1) {
            const multipleTagsArray = [];
            for (const [key, value] of tagsMap) {
              multipleTagsArray.push(filterRecipesByField(key, recipes, value));
            }
            displayRecipes(findArrayIntersection(multipleTagsArray));
            filteredListsAdvancedField = renderItemsInDropdowns(
              findArrayIntersection(multipleTagsArray)
            );
          }
        }
      } else if (mainInputFilled === true) {
        // si le champs de recherche principal est renseigné
        if (
          e.target.toString().indexOf("Menu") === -1 &&
          !e.target.contains(li.firstChild) /* button */ &&
          !e.target.contains(li.firstChild.firstChild) /* son span */ &&
          !e.target.contains(
            li.firstChild.firstChild.nextSibling
          ) /* son input */
        ) {
          const itemListTittle = e.target.getAttribute("data-advanced-filter");
          const itemName = e.target.innerText;
          tagsMap.set(itemName, itemListTittle);
          selectedTagContainer.innerHTML = ""; // vide le container avant de le remplir
          tagsMap.forEach((itemTitle, item) => displayTag(item, itemTitle));
          document.getElementById(`search-${itemListTittle}`).value = ""; // vide l'input
          if (tagsMap.size === 1) {
            // il y a un tag sélectionné
            displayRecipes(
              filterRecipesByField(itemName, arrayFromMainInput, itemListTittle)
            );
            filteredListsAdvancedField = renderItemsInDropdowns(
              filterRecipesByField(itemName, arrayFromMainInput, itemListTittle)
            );
          } else if (tagsMap.size > 1) {
            // s'il y a plus de deux tags sélectionnés
            const multipleTagsArray = [];
            for (const [key, value] of tagsMap) {
              multipleTagsArray.push(
                filterRecipesByField(key, arrayFromMainInput, value)
              );
            }
            displayRecipes(findArrayIntersection(multipleTagsArray));
            filteredListsAdvancedField = renderItemsInDropdowns(
              findArrayIntersection(multipleTagsArray)
            );
          }
        }
      }
    });
  });
  window.addEventListener("click", () => {
    collapseDropdownMenu(dropdownMenuItems);
  });

  // si on supprime des tags, filtrer à nouveau les tableaux avec les tags restants
  window.addEventListener("click", (e) => {
    if (e.target.className.includes("far fa-times-circle")) {
      removeClickedTag(e);
      tagsMap.delete(e.target.parentNode.parentNode.innerText);
      if (mainInputFilled === false) {
        if (tagsMap.size === 0) {
          displayRecipes(recipes);
          renderItemsInDropdowns(recipes);
        } else if (tagsMap.size === 1) {
          tagsMap.forEach((itemTitleList, item) =>
            displayRecipes(filterRecipesByField(item, recipes, itemTitleList))
          );
          tagsMap.forEach((itemTitleList, item) => {
            filteredListsAdvancedField = renderItemsInDropdowns(
              filterRecipesByField(item, recipes, itemTitleList)
            );
          });
        } else if (tagsMap.size > 1) {
          // si dans le reste, il y a au moins deux tags sélectionnés
          const multipleTagsArray = [];
          for (const [key, value] of tagsMap) {
            multipleTagsArray.push(filterRecipesByField(key, recipes, value));
          }
          displayRecipes(findArrayIntersection(multipleTagsArray));
          filteredListsAdvancedField = renderItemsInDropdowns(
            findArrayIntersection(multipleTagsArray)
          );
        }
      } else if (mainInputFilled === true) {
        if (tagsMap.size === 0) {
          displayRecipes(arrayFromMainInput);
          renderItemsInDropdowns(arrayFromMainInput);
        } else if (tagsMap.size === 1) {
          tagsMap.forEach((itemTitleList, item) =>
            displayRecipes(
              filterRecipesByField(item, arrayFromMainInput, itemTitleList)
            )
          );
          tagsMap.forEach((itemTitleList, item) => {
            filteredListsAdvancedField = renderItemsInDropdowns(
              filterRecipesByField(item, arrayFromMainInput, itemTitleList)
            );
          });
        } else if (tagsMap.size > 1) {
          // si dans le reste, il y a au moins deux tags sélectionnés
          const multipleTagsArray = [];
          for (const [key, value] of tagsMap) {
            multipleTagsArray.push(
              filterRecipesByField(key, arrayFromMainInput, value)
            );
          }
          displayRecipes(findArrayIntersection(multipleTagsArray));
          filteredListsAdvancedField = renderItemsInDropdowns(
            findArrayIntersection(multipleTagsArray)
          );
        }
      }
    }
  });
}

search();