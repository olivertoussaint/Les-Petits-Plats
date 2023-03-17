export function filterDropdownMenu (elementMenu) {
    for (let i = 0; i < elementMenu.length; i++) {
      elementMenu[i].classList.remove('active')
    }
  }
  
  // sur li il y a un addEventListener "click"
  export function filterDropdown (li, e, list) {
    if (li.classList.contains('active') && (li.firstChild === e.target)) {
      li.classList.remove('active')
    } else {
      list.forEach(currentLi => { currentLi.classList.remove('active') })
      li.classList.add('active')
    }
  }
  