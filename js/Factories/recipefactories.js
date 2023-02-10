export function createARecipeFactory(data) {
    const { name, ingredients, time, description } = data
    const createRecipeIngredientsList = []
    
    const truncateString = (string = ' ... ', maxLength = 50) => 
  string.length > maxLength 
    ? `${string.substring(0, maxLength)}…`
    : string

for (const elt in ingredients) {
    const $ingredient = ingredients[elt].ingredient
    const $quantity = ingredients[elt].quantity === undefined ? ' ' : ' : ' + ingredients[elt].quantity
    const $unit = ingredients[elt].unit === undefined ? ' ' : ingredients[elt].unit
    createRecipeIngredientsList.push(`<li class="font-bold">${$ingredient} <span class="font-thin">${$quantity} ${$unit}</span></li>`)
  }
  

  // fabrique l'élément 'carte' d'affichage des recettes
  function getRecipeCard () {
    const recipeWithAllIngredients = createRecipeIngredientsList.join(' ')
    const article = document.createElement('article')
    const $recipeDescription =  document.createElement('ul')
    $recipeDescription.setAttribute('class', 'recipe__description')
    const $bottomRecipeDescription = document.createElement('div')
    $bottomRecipeDescription.setAttribute('class', 'recipe__description__bottom')
    article.setAttribute('class', 'recipe-card')
    let process = document.createElement('p');
    process.setAttribute('class', 'process');
    article.innerHTML = `
      <img class="w-full rounded-t-lg p-16 bg-slate-400" src="/assets/icons/logo.svg" alt="logo les petits plats">
          <div class="recipe text-lg">
            <p class="font-medium truncate">${name}</p>
            <p class="font-bold"><i class="far fa-clock"></i>${time} min</p>`

        if (description.length >=200) {
          process.innerHTML = truncateString(description, 200);
        } else {
          process.innerHTML = description;
        }
        let descBottom = document.createElement('div');
        descBottom.setAttribute('class', 'recipes__description__bottom');
        $recipeDescription.innerHTML = recipeWithAllIngredients

        article.appendChild($bottomRecipeDescription)
        $bottomRecipeDescription.appendChild($recipeDescription)
        $bottomRecipeDescription.appendChild(process);

    return article
  }
  return {
    getRecipeCard
  }
}
