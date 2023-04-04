import { recipes } from '../data/recipes.js'
import { createAListFactory, createList } from './Factories/listFactories.js'
import { createARecipeFactory } from './Factories/recipefactories.js'
import { filterThroughMainInput, filterThroughAdvancedField, filterAdvancedItemsListFromAdvancedInput , intersection } from './Utils/filters.js'
import { filterDropdownMenu, filterDropdown } from './Utils/dropdown.js'

// ----------------- DOM
const mainInput = document.getElementById('searchBar')
const recipesContainer = document.getElementById('resultRecipes-container')
const noResultsContainer = document.getElementById('noResults')
const selectedTagContainer = document.getElementById('advancedSelectedFilterTags-container')

const tagsMap = new Map()
let mainInputFilled = false

// ----------------- Fonctions
// affiche les recettes une par une à partir d'un array de recettes filtré ou non
function displayRecipes (array) {
  recipesContainer.innerHTML = ''
  // console.log ('array length ds displayRecipes: ', array.length)
  if (array.length !== 0) {
    noResultsContainer.style.display = 'none'
    array.map(recipe => recipesContainer.appendChild(createARecipeFactory(recipe).getRecipeCard()))
  } else {
    noResultsContainer.style.display = 'flex'
  }
}

// affiche les boutons de filtres avec leur titre
function displayListButtons (array) {
  const buttonsEntitled = createList(array)
  buttonsEntitled.forEach(element => createAListFactory().getList(element))
  return buttonsEntitled
}

// il faut d'abord créer les listes des items (à mettre dans les boutons)
// ensuite afficher les items dans les boutons un par un en suivant cette liste d'items (filtrée ou non)
// on récupère la liste d'items filtrés pour ajouter des filtres sur cette liste
function displayItemsInButtonsBlocks (array) {
  const advancedFiltersLists = createAListFactory().makeLists(array)
  // console.log('advancedFiltersLists : ', advancedFiltersLists)
  for (const title in advancedFiltersLists) {
    // console.log("title", title)
    const menuBlock = document.querySelector(`menu #${title}-list`)
    menuBlock.innerHTML = ''
    advancedFiltersLists[title].map(item => createAListFactory().getListTemplate(item, title))
  }
  suppressItemsTaggedFromButtonsLists(tagsMap)
  return advancedFiltersLists
}

// si un item est présent dans les tags alors le supprimer des listes
function suppressItemsTaggedFromButtonsLists (tagsList) {
  if (tagsList.size > 0) {
    const displayedList = document.querySelectorAll('div > menu > li > menu > li > button')
    tagsList.forEach((ListTittle, Item) => {
      for (const button of displayedList) {
        if (button.innerText.includes(Item)) {
          button.parentElement.remove()
        }
      }
    })
  }
}

// affiche le tag cliqué dans le container de tag
function displayTag (item, itemTittleList) {
  selectedTagContainer.appendChild(createAListFactory().getItemTagTemplate(item, itemTittleList))
}

// supprime de l'affichage le tag cliqué
function suppressTag (e) {
  // console.log(e.target.parentNode.parentNode);
  selectedTagContainer.removeChild(e.target.parentNode.parentNode)
}

// ----------------- APPEL des fonctions

displayListButtons(recipes)
displayRecipes(recipes)
let filteredListsAdvancedField = displayItemsInButtonsBlocks(recipes)

// ----------------- EVENTS LISTENERS

// ce selector capte la liste des boutons qui ouvre la dropdown,
// ce selector doit être créé après l'affichage des boutons de listes
const advancedFiltersLi = document.querySelectorAll('div > menu > li')

// fait d'abord la gestion des inputs
// ensuite la gestion des clicks:
//    - avec le main Input vide
//    - avec le main Input plein
//    - click et gestion de la suppression de tag
function search () {
  let arrayFromMainInput = []
  mainInput.addEventListener('input', (event) => {
    event.stopPropagation()
    // console.log('main input event', event.target.value)
    selectedTagContainer.innerHTML = ''
    tagsMap.clear()
    if (event.target.value.length > 2) {
      mainInput.parentElement.removeAttribute('data-error-visible', true)
      mainInputFilled = true
      arrayFromMainInput = filterThroughMainInput(event, recipes)
      displayRecipes(arrayFromMainInput)
      filteredListsAdvancedField = displayItemsInButtonsBlocks(arrayFromMainInput)
    } else if (event.target.value.length < 3 && event.target.value.length > 0) {
      mainInput.parentElement.setAttribute('data-error-visible', true)
      mainInputFilled = false
      displayRecipes(recipes)
      filteredListsAdvancedField = displayItemsInButtonsBlocks(recipes)
    } else if (event.target.value.length === 0) {
      mainInput.parentElement.removeAttribute('data-error-visible')
    }
  })

  const advancedFiltersInput = document.querySelectorAll('div > menu > li > button > input')
  advancedFiltersInput.forEach(input => {
    input.addEventListener('input', (event) => {
      event.preventDefault()
      const listTittle = (event.target).getAttribute('data-advanced-filter')
      const lists = filteredListsAdvancedField
      const listFiltered = filterAdvancedItemsListFromAdvancedInput (event.target.value, listTittle, lists)
      const tittledMenuBlock = document.querySelector(`menu #${listTittle}-list`)
      tittledMenuBlock.innerHTML = '' // vide le menu des items
      listFiltered.map(item => createAListFactory().getListTemplate(item, listTittle)) // rempli le menu des items
    })
  })

  advancedFiltersLi.forEach(li => {
    li.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      filterDropdown(li, e, advancedFiltersLi)
      suppressItemsTaggedFromButtonsLists(tagsMap)
      if (mainInputFilled === false) {
        if (((e.target).toString().indexOf('Menu') === -1) &&
        (!e.target.contains(li.firstChild)) &&
        (!e.target.contains(li.firstChild.firstChild)) &&
        (!e.target.contains(li.firstChild.firstChild.nextSibling))) {
          const itemTittleList = (e.target).getAttribute('data-advanced-filter')
          const item = e.target.innerText
          tagsMap.set(item, itemTittleList)
          selectedTagContainer.innerHTML = ''
          tagsMap.forEach((itemTittL, ItM) => displayTag(ItM, itemTittL))
          document.getElementById(`search-${itemTittleList}`).value = '' 
          if (tagsMap.size === 1) {
            
            tagsMap.forEach((itemTittleList, item) => { filteredListsAdvancedField = displayItemsInButtonsBlocks(filterThroughAdvancedField(item, recipes, itemTittleList)) })
          } else if (tagsMap.size > 1) {
            const multipleTagsArray = []
            for (const [key, value] of tagsMap) {
              multipleTagsArray.push(filterThroughAdvancedField(key, recipes, value))
            }
            displayRecipes(intersection(multipleTagsArray))
            filteredListsAdvancedField = displayItemsInButtonsBlocks(intersection(multipleTagsArray))
          }
        }
      } else if (mainInputFilled === true) {
        if (((e.target).toString().indexOf('Menu') === -1) &&
          (!e.target.contains(li.firstChild)) &&
          (!e.target.contains(li.firstChild.firstChild)) &&
          (!e.target.contains(li.firstChild.firstChild.nextSibling))) {
          const itemListTittle = (e.target).getAttribute('data-advanced-filter')
          const itemName = e.target.innerText
          tagsMap.set(itemName, itemListTittle)
          selectedTagContainer.innerHTML = ''
          tagsMap.forEach((itemTittL, ItM) => displayTag(ItM, itemTittL))
          document.getElementById(`search-${itemListTittle}`).value = ''
          if (tagsMap.size === 1) {
            displayRecipes(filterThroughAdvancedField(itemName, arrayFromMainInput, itemListTittle))
            filteredListsAdvancedField = displayItemsInButtonsBlocks(filterThroughAdvancedField(itemName, arrayFromMainInput, itemListTittle))
          } else if (tagsMap.size > 1) {
            const multipleTagsArray = []
            for (const [key, value] of tagsMap) {
              multipleTagsArray.push(filterThroughAdvancedField(key, arrayFromMainInput, value))
            }
            displayRecipes(intersection(multipleTagsArray))
            filteredListsAdvancedField = displayItemsInButtonsBlocks(intersection(multipleTagsArray))
          }
        }
      }
    })
  })
  window.addEventListener('click', () => {
    filterDropdownMenu(advancedFiltersLi)
  })
  window.addEventListener('click', (e) => {
    if (e.target.className.includes('far fa-times-circle')) {
      suppressTag(e)
      tagsMap.delete(e.target.parentNode.parentNode.innerText)
      if (mainInputFilled === false) {
        if (tagsMap.size === 0) {
          displayRecipes(recipes)
          displayItemsInButtonsBlocks(recipes)
        } else if (tagsMap.size === 1) {
          tagsMap.forEach((itemTittleList, item) => displayRecipes(filterThroughAdvancedField(item, recipes, itemTittleList)))
          tagsMap.forEach((itemTittleList, item) => { filteredListsAdvancedField = displayItemsInButtonsBlocks(filterThroughAdvancedField(item, recipes, itemTittleList)) })
        } else if (tagsMap.size > 1) {
          const multipleTagsArray = []
          for (const [key, value] of tagsMap) {
            multipleTagsArray.push(filterThroughAdvancedField(key, recipes, value))
          }
          displayRecipes(intersection(multipleTagsArray))
          filteredListsAdvancedField = displayItemsInButtonsBlocks(intersection(multipleTagsArray))
        }
      } else if (mainInputFilled === true) {
        if (tagsMap.size === 0) {
          displayRecipes(arrayFromMainInput)
          displayItemsInButtonsBlocks(arrayFromMainInput)
        } else if (tagsMap.size === 1) {
          tagsMap.forEach((itemTittleList, item) => displayRecipes(filterThroughAdvancedField(item, arrayFromMainInput, itemTittleList)))
          tagsMap.forEach((itemTittleList, item) => { filteredListsAdvancedField = displayItemsInButtonsBlocks(filterThroughAdvancedField(item, arrayFromMainInput, itemTittleList)) })
        } else if (tagsMap.size > 1) {
          const multipleTagsArray = []
          for (const [key, value] of tagsMap) {
            multipleTagsArray.push(filterThroughAdvancedField(key, arrayFromMainInput, value))
          }
          displayRecipes(intersection(multipleTagsArray))
          filteredListsAdvancedField = displayItemsInButtonsBlocks(intersection(multipleTagsArray))
        }
      }
    }
  })
}

search()
