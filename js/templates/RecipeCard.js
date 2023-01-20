class RecipeCard {
    constructor(recipe) {
        this._recipe = recipe
    }

    createRecipeCard() {
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('recipe-card-wrapper')

        const recipeCard = `
        <h3>${this._recipe.name}
        ` 
        $wrapper.innerHTML = recipeCard
        return $wrapper 
    }
}