import { recipes } from '../data/recipes.js'
import { createAListFactory, createList } from './Factories/listFactories.js'
import { createARecipeFactory } from './Factories/recipefactories.js'

// ----------------- DOM
const recipesContainer = document.getElementById('resultRecipes-container')
const noResultsContainer = document.getElementById('noResults')

// ----------------- Fonctions
// affiche les recettes une par une à partir d'un array de recettes filtré ou non
function displayRecipes (array) {
  recipesContainer.innerHTML = ''
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
  buttonsEntitled.forEach(element => createAListFactory().getListBlock(element))
  console.log(buttonsEntitled)
  return buttonsEntitled
}


// ----------------- APPEL des fonctions

displayListButtons(recipes)
displayRecipes(recipes)
