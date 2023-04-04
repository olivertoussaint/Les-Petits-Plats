// pour les suites de caractères, supprimer espaces et mettre en case minuscule
const refit = alias => alias.trim().toLowerCase()

// renvoie une liste de recettes filtrée avec e de l'event listener, et en array: Recipes
export function filterThroughMainInput (e, array) {
    const filteredArrayDescription = array.filter(recipe => refit(recipe.description).includes(refit(e.target.value)))
    const filteredArrayName = array.filter(recipe => refit(recipe.name).includes(refit(e.target.value)))
    const filteredArrayIngredients = array.filter(recipe => recipe.ingredients.some(ing => refit(ing.ingredient).includes(refit(e.target.value))))
    const setOfMainSearchInput = [...new Set([...filteredArrayDescription, ...filteredArrayName, ...filteredArrayIngredients])]
    // console.log("ensemble des results de mainInput : ", setOfMainSearchInput)
    return setOfMainSearchInput
  }
  
  // du tableau de listes,
  // recherche une suite de caractère venant d'un input dit value (e.target.value)
  // et renvoie une liste filtrée d'items
  export function filterAdvancedItemsListThroughAdvancedInput (value, tittle, arraydeslistes) {
    if (tittle === 'appliance') {
      const filteredWithInputInAppliance = (arraydeslistes.appliance).filter(item => item.includes(refit(value)))
      return filteredWithInputInAppliance
    } else if (tittle === 'ustensils') {
      const filteredWithInputInUstensils = (arraydeslistes.ustensils).filter(item => item.includes(refit(value)))
      return filteredWithInputInUstensils
    } else if (tittle === 'ingredients') {
      const filteredWithInputInIngredients = (arraydeslistes.ingredients).filter(item => item.includes(refit(value)))
      return filteredWithInputInIngredients
    }
  }
  
  // à partir d'un tableau (array) de recettes (filtrées ou non), cherche une value dans sa liste (tittle)
  // filtre le tableau en gardant les recette ayant cette value,
  // renvoie la liste des recette contenant la value
  export function filterThroughAdvancedField (value, array, tittle) {
    if (tittle === 'appliance') {
      const filteredArrayAppliance = array.filter(recipe => refit(recipe.appliance).includes(refit(value)))
      // console.log("filter appliance : ", filteredArrayAppliance)
      return filteredArrayAppliance
    } else if (tittle === 'ustensils') {
      const filteredArrayUstensils = array.filter(recipe => recipe.ustensils.some(app => refit(app).includes(refit(value))))
      // console.log("filter ustensils : ", filteredArrayUstensils)
      return filteredArrayUstensils
    } else if (tittle === 'ingredients') {
      const filteredAdvancedArrayIngredients = array.filter(recipe => recipe.ingredients.some(ing => refit(ing.ingredient).includes(refit(value))))
      // console.log("filter recipe through ingredients : ", filteredAdvancedArrayIngredients);
      return filteredAdvancedArrayIngredients
    }
  }
  
  //  Dans un tableau de tableaux filtrés,(au moins 2 index)
  //  cette fonction va vérifier l'intersection entre chaque index (chaque index contient un tableau)
  //  et la renvoyer (tableau de recettes filtrées sur intersection)
  export function intersection (array) {
    // initialisation de l'intersection sur l'array[0]
    let intersectionArray = array[0]
    // pour chaque index, je compare l'index suivant avec le premier index,
    // ensuite je compare l'index suivant avec l'intersection précédente, j'obtiens les intersections entre tous les tags
    for (let i = 0; i < array.length - 1; i++) {
      intersectionArray = array[i + 1].filter(element => intersectionArray.includes(element))
      // console.log('intersection', intersectionArray)
    }
    return intersectionArray
  };


export { refit }
