import '../assets/Scroll.css'

export function disableScroll() { 
    document.body.classList.add("remove-scrolling"); 
  } 

export function enableScroll() { 
    document.body.classList.remove("remove-scrolling"); 
  }