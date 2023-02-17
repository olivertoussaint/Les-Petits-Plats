export function filterDropdownMenu (elementMenu) {
    for (let i = 0; i < elementMenu.length; i++) {
      elementMenu[i].classList.remove('show')
    }
  }
  
  // sur li il y a un addEventListener "click"
  export function filterDropdown (li, e, list) {
    if (li.classList.contains('show') && (li.firstChild === e.target)) {
      li.classList.remove('show')
    } else {
      list.forEach(currentLi => { currentLi.classList.remove('show') })
      li.classList.add('show')
    }
  }
  