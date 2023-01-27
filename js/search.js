import { recipes } from './../data/recipes.js'
import { createARecipeFactory } from './Factories/recipefactories.js'

// ----------------- DOM
const recipesContainer = document.getElementById('recipes-container')
const noResultsContainer = document.getElementById('noResults')

// ----------------- Fonctions
function displayRecipes (array) {
  recipesContainer.innerHTML = ''
  if (array.length !== 0) {
    noResultsContainer.style.display = 'none'
    array.map(recipe => recipesContainer.appendChild(createARecipeFactory(recipe).getRecipeCard()))
  } else {
    noResultsContainer.style.display = 'flex'
  }
}

// ----------------- APPEL des fonctions
displayRecipes(recipes)
