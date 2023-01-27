export function createARecipeFactory(recipeDatas) {
    const { name, ingredients, time, description } = recipeDatas
    const createRecipeIngredientsList = []
    console.log(createRecipeIngredientsList)

// For/in  boucles dans les propriétés d'un objet
for (const elt in ingredients) {
    const ingre = ingredients[elt].ingredient
    const quant = ingredients[elt].quantity === undefined ? ' ' : ' : ' + ingredients[elt].quantity
    const uni = ingredients[elt].unit === undefined ? ' ' : ingredients[elt].unit
    createRecipeIngredientsList.push(`<li class="font-bold">${ingre} <span class="font-thin">${quant} ${uni}</span></li>`)
  }

  // fabrique l'élément 'carte' d'affichage des recettes
  function getRecipeCard () {
    const recipeWithAllIngredients = createRecipeIngredientsList.join(' ')
    const article = document.createElement('article')
    // article.setAttribute('class',  'rounded-b-lg')
    article.innerHTML = `
      <img class="w-full rounded-t-lg p-16 bg-slate-400" src="/assets/icons/logo.svg" alt="logo les petits plats">
      <div class="container rounded-b-lg bg-slate-200 px-4 pt-3 pb-12">
          <div class="flex justify-between">
            <p class="text-sm pb-2">${name}</p>
            <p class="text-sm font-bold"><i class="far fa-clock"></i> ${time} min</p>
          </div>
          <div class="recipeListAndDescription flex justify-between">
            <ul class="w-2/4 text-xs">
              ${recipeWithAllIngredients} 
            </ul>
            <p class="recipe-description w-5/12 text-xs">
            ${description}
            </p>
          </div>
        </div>`

    return article
  }
  return {
    getRecipeCard
  }
}
