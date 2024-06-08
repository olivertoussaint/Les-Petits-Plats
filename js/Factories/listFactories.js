// ----------------- import
import { normalizeString } from "../Utils/filters.js";

// ----------------- DOM
const advancedFiltersMenu = document.getElementById("advancedFilters-list");

// ----------------- functions

// Fonction pour extraire les titres des listes (ingrédients, appareils, ustensiles) à partir du premier objet du tableau
export function extractListTitles(array) {
  const listTitleIng = Object.keys(array[0])[4];
  const listTitleApp = Object.keys(array[0])[7];
  const listTitleUst = Object.keys(array[0])[8];
  const listTitles = [listTitleIng, listTitleApp, listTitleUst];
  return listTitles;
}

// fabrique plusieurs éléments visuel des filtres avancés
export function createFilterFactory() {
  // Avec recipes, fait les listes des différents items et renvoie un objet destructurer
  function generateFilterLists(array) {
    const ingredientsItems = [
      ...new Set(
        array
          .flatMap((recipe) =>
            recipe.ingredients.map((ingred) => ingred.ingredient)
          )
          .map((e) => normalizeString(e))
      ),
    ].sort((a, b) => a.localeCompare(b));
    const applianceItems = [
      ...new Set(
        array
          .flatMap((recipe) => recipe.appliance)
          .map((e) => normalizeString(e))
      ),
    ].sort((a, b) => a.localeCompare(b));
    const ustensilsItems = [
      ...new Set(
        array.flatMap((recipe) =>
          recipe.ustensils.map((e) => normalizeString(e))
        )
      ),
    ].sort((a, b) => a.localeCompare(b));

    const filtersLists = {
      ingredients: ingredientsItems,
      appliance: applianceItems,
      ustensils: ustensilsItems,
    };
    return filtersLists;
  }

  function createFilterBlock(element) {
    function translate(elt) {
      switch (elt) {
        case "ingredients":
          return "Ingrédients";
        case "appliance":
          return "Appareil";
        case "ustensils":
          return "Ustensiles";
        default:
          return elt;
      }
    }
    const liBlock = document.createElement("li");
    liBlock.className = "advancedFilters";
    const divButton = document.createElement("button");
    divButton.setAttribute("class", `advancedFilters-button ${element}-color`);
    const divButtonName = document.createElement("span");
    divButtonName.setAttribute("id", `span-${element}`);
    divButtonName.innerText = translate(element);
    const divButtonSearchBar = document.createElement("input");
    divButtonSearchBar.setAttribute("class", `${element}-color advancedSearch`);
    divButtonSearchBar.setAttribute("type", "search");
    divButtonSearchBar.setAttribute("data-advanced-filter", element);
    divButtonSearchBar.setAttribute("id", `search-${element}`);
    divButtonSearchBar.setAttribute(
      "placeholder",
      `Rechercher dans ${element}`
    );
    const menuBlock = document.createElement("menu");
    menuBlock.setAttribute("class", `${element}-color`);
    menuBlock.setAttribute("id", `${element}-list`);

    advancedFiltersMenu.appendChild(liBlock);
    liBlock.appendChild(divButton);
    divButton.appendChild(divButtonName);
    divButton.appendChild(divButtonSearchBar);
    liBlock.appendChild(menuBlock);
  }

  // fabrique la partie liste des filtres avancés
  function getListTemplate(item, itemTitleList) {
    const listElement = document.createElement("li");
    listElement.setAttribute("class", "list");
    const listElementButton = document.createElement("button");
    listElementButton.setAttribute("data-advanced-filter", itemTitleList);
    listElementButton.innerText = item;

    const menuBlock = document.querySelector(`menu #${itemTitleList}-list`);
    menuBlock.appendChild(listElement);
    listElement.appendChild(listElementButton);
  }

  // fabrique la partie tag des items sélectionnés des filtres avancés
  function getItemTagTemplate(item, itemTitleList) {
    const selectedTag = document.createElement("div");
    selectedTag.className = "advancedSelectedFilterTag";
    selectedTag.classList.add(`${itemTitleList}-color`);
    const textItem = document.createElement("p");
    textItem.innerText = item;
    const closeIconTagButton = document.createElement("button");
    const closeIconTag = document.createElement("i");
    closeIconTag.className = "far fa-times-circle";
    selectedTag.appendChild(textItem);
    selectedTag.appendChild(closeIconTagButton);
    closeIconTagButton.appendChild(closeIconTag);
    return selectedTag;
  }

  return {
    generateFilterLists,
    createFilterBlock,
    getListTemplate,
    getItemTagTemplate,
  };
}
