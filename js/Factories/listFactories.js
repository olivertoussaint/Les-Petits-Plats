// ----------------- DOM
const advancedFiltersMenu = document.getElementById('advancedFilters-list')

// crée un tableau des titres des listes pour affichage en tête de liste
export function createList (array) {
  const headerIngredientList = (Object.keys(array[0]))[3]
  const headerApplianceList = (Object.keys(array[0]))[6]
  const headerUstensilList = (Object.keys(array[0]))[7]
  console.log(array.flat())
  const headersList = [headerIngredientList, headerApplianceList , headerUstensilList]
  return headersList
}

// fabrique plusieurs éléments visuel des filtres avancés
export function createAListFactory () {

  function getListBlock (element) {
    function translate (elt) {
      if (elt === 'ingredients') {
        elt = 'Ingrédients'
        return elt
      } else if (element === 'appliance') {
        elt = 'Appareil'
        return elt
      } else if (element === 'ustensils') {
        elt = 'Ustensiles'
        return elt
      }
    }
    const $li = document.createElement('li')
    $li.className = 'advancedFilters'
    const $button = document.createElement('button')
    $button.setAttribute('class', `text-white text-base font-bold py-6 px-6 rounded ${element}-color`)
    const $i = document.createElement('i')
    $i.setAttribute('class', 'fa-solid fa-chevron-down px-4')
    const $buttonName = document.createElement('span')
    $buttonName.setAttribute('id', `span-${element}`)
    $buttonName.innerText = translate(element)
    const menuBlock = document.createElement('menu')
    menuBlock.setAttribute('class', `${element}-color`)
    menuBlock.setAttribute('id', `${element}-list`)

    advancedFiltersMenu.appendChild($li)
    $li.appendChild($button)
    $buttonName.appendChild($i)
    $button.appendChild($buttonName)
    $li.appendChild(menuBlock)
  }

  return {
    getListBlock
  }
}
