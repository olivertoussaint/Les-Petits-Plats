// pour les suites de caractères, supprimer espaces et mettre en case minuscule
const normalizeString = (str) => str.trim().toLowerCase();

// renvoie une liste de recettes filtrée avec e de l'event listener, et en array: Recipes
export function filterRecipesByInput(e, array) {
  const filteredArrayDescription = array.filter((recipe) =>
    normalizeString(recipe.description).includes(
      normalizeString(e.target.value)
    )
  );
  const filteredArrayName = array.filter((recipe) =>
    normalizeString(recipe.name).includes(normalizeString(e.target.value))
  );
  const filteredArrayIngredients = array.filter((recipe) =>
    recipe.ingredients.some((ing) =>
      normalizeString(ing.ingredient).includes(normalizeString(e.target.value))
    )
  );
  const setOfMainSearchInput = [
    ...new Set([
      ...filteredArrayDescription,
      ...filteredArrayName,
      ...filteredArrayIngredients,
    ]),
  ];
  return setOfMainSearchInput;
}
export function filterItemsByCategory(value, title, listArray) {
  if (title === "appliance") {
    const filteredWithInputInAppliance = listArray.appliance.filter((item) =>
      item.includes(normalizeString(value))
    );
    return filteredWithInputInAppliance;
  } else if (title === "ustensils") {
    const filteredWithInputInUstensils = listArray.ustensils.filter((item) =>
      item.includes(normalizeString(value))
    );
    return filteredWithInputInUstensils;
  } else if (title === "ingredients") {
    const filteredWithInputInIngredients = listArray.ingredients.filter(
      (item) => item.includes(normalizeString(value))
    );
    return filteredWithInputInIngredients;
  }
}
export function filterRecipesByField(value, array, title) {
  if (title === "appliance") {
    const filteredArrayAppliance = array.filter((recipe) =>
      normalizeString(recipe.appliance).includes(normalizeString(value))
    );
    return filteredArrayAppliance;
  } else if (title === "ustensils") {
    const filteredArrayUstensils = array.filter((recipe) =>
      recipe.ustensils.some((app) =>
        normalizeString(app).includes(normalizeString(value))
      )
    );
    return filteredArrayUstensils;
  } else if (title === "ingredients") {
    const filteredAdvancedArrayIngredients = array.filter((recipe) =>
      recipe.ingredients.some((ing) =>
        normalizeString(ing.ingredient).includes(normalizeString(value))
      )
    );
    return filteredAdvancedArrayIngredients;
  }
}

export function findArrayIntersection(array) {
  let intersectionArray = array[0];
  for (let i = 0; i < array.length - 1; i++) {
    intersectionArray = array[i + 1].filter((element) =>
      intersectionArray.includes(element)
    );
  }
  return intersectionArray;
}

export { normalizeString };
