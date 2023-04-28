// pour les suites de caractères, supprimer espaces et mettre en case minuscule
const refit = x => x.trim().toLowerCase()

// renvoie une liste de recettes filtrée avec e de l'event listener, et en array: Recipes
export function filterThroughMainInput (e, array) {
  const filteredArrayDescription = array.filter(recipe => refit(recipe.description).includes(refit(e.target.value)))
  const filteredArrayName = array.filter(recipe => refit(recipe.name).includes(refit(e.target.value)))
  const filteredArrayIngredients = array.filter(recipe => recipe.ingredients.some(ing => refit(ing.ingredient).includes(refit(e.target.value))))
  const setOfMainSearchInput = [...new Set([...filteredArrayDescription, ...filteredArrayName, ...filteredArrayIngredients])]
  return setOfMainSearchInput
}
export function filterAdvancedItemsListThroughAdvancedInput (valeur, tittle, arraydeslistes) {
  if (tittle === 'appliance') {
    const filteredWithInputInAppliance = (arraydeslistes.appliance).filter(item => item.includes(refit(valeur)))
    return filteredWithInputInAppliance
  } else if (tittle === 'ustensils') {
    const filteredWithInputInUstensils = (arraydeslistes.ustensils).filter(item => item.includes(refit(valeur)))
    return filteredWithInputInUstensils
  } else if (tittle === 'ingredients') {
    const filteredWithInputInIngredients = (arraydeslistes.ingredients).filter(item => item.includes(refit(valeur)))
    return filteredWithInputInIngredients
  }
}
export function filterThroughAdvancedField (valeur, array, tittle) {
  if (tittle === 'appliance') {
    const filteredArrayAppliance = array.filter(recipe => refit(recipe.appliance).includes(refit(valeur)))
    return filteredArrayAppliance
  } else if (tittle === 'ustensils') {
    const filteredArrayUstensils = array.filter(recipe => recipe.ustensils.some(app => refit(app).includes(refit(valeur))))
    return filteredArrayUstensils
  } else if (tittle === 'ingredients') {
    const filteredAdvancedArrayIngredients = array.filter(recipe => recipe.ingredients.some(ing => refit(ing.ingredient).includes(refit(valeur))))
    return filteredAdvancedArrayIngredients
  }
}

export function intersection (array) {
  let intersectionArray = array[0]
  for (let i = 0; i < array.length - 1; i++) {
    intersectionArray = array[i + 1].filter(element => intersectionArray.includes(element))
  }
  return intersectionArray
};

export { refit }
