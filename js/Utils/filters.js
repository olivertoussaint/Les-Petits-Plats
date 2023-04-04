// pour les suites de caractères, supprimer espaces et mettre en case minuscule
const refit = alias => alias.trim().toLowerCase()

export function filterThroughMainInput (e, array) {
    const filteredArrayDescription = array.filter(recipe => refit(recipe.description).includes(refit(e.target.value)))
    const filteredArrayName = array.filter(recipe => refit(recipe.name).includes(refit(e.target.value)))
    const filteredArrayIngredients = array.filter(recipe => recipe.ingredients.some(ing => refit(ing.ingredient).includes(refit(e.target.value))))
    const setOfMainSearchInput = [...new Set([...filteredArrayDescription, ...filteredArrayName, ...filteredArrayIngredients])]
    return setOfMainSearchInput
  }
  
  export function filterAdvancedItemsListFromAdvancedInput (value, tittle, arrayslists) {
    if (tittle === 'appliance') {
      const filteredWithInputInAppliance = (arrayslists.appliance).filter(item => item.includes(refit(value)))
      return filteredWithInputInAppliance
    } else if (tittle === 'ustensils') {
      const filteredWithInputInUstensils = (arrayslists.ustensils).filter(item => item.includes(refit(value)))
      return filteredWithInputInUstensils
    } else if (tittle === 'ingredients') {
      const filteredWithInputInIngredients = (arrayslists.ingredients).filter(item => item.includes(refit(value)))
      return filteredWithInputInIngredients
    }
  }
  
  export function filterThroughAdvancedField (value, array, tittle) {
    if (tittle === 'appliance') {
      const filteredArrayAppliance = array.filter(recipe => refit(recipe.appliance).includes(refit(value)))
      return filteredArrayAppliance
    } else if (tittle === 'ustensils') {
      const filteredArrayUstensils = array.filter(recipe => recipe.ustensils.some(app => refit(app).includes(refit(value))))
      return filteredArrayUstensils
    } else if (tittle === 'ingredients') {
      const filteredAdvancedArrayIngredients = array.filter(recipe => recipe.ingredients.some(ing => refit(ing.ingredient).includes(refit(value))))
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
