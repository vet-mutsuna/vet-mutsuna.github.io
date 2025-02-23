// DARK MODE
let darkMode         = localStorage.getItem("darkMode");
let darkenLogo       = localStorage.getItem("darkenLogo");
const darkModeToggle = document.querySelector("#dark-mode-toggle");
let siteUrlImg       = document.querySelector("#site-url-img");

// DARK MODE BUTTON
const body           = document.querySelector('body');
const darkModeBtn    = document.querySelector('.dark-mode-btn');
const darkModeIcon   = document.querySelector('.dark-mode--icon');

/**
 * 
 * @returns 
 */
const isInDarkMode = () => {

    const darmodeValue = localStorage.getItem("darkmode");
    return darmodeValue == 'true';
};

/**
 * 
 * @returns 
 */
const isInLightMode = () => {
    return !isInDarkMode();
}

/**
 * 
 */
const toggleDarkMode = () => {

    const darkmodeValue = JSON.parse(localStorage.getItem("darkmode"));
    localStorage.setItem("darkmode", !darkmodeValue);
}

/**
 * 
 */
const loadState = () => {

    if(isInDarkMode()) {

        body.classList.add('darkmode');
        body.classList.add('darkMode');
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');        
    }

    if(isInLightMode()) {

        body.classList.remove('darkmode');
        body.classList.remove('darkMode');
        darkModeIcon.classList.remove('fa-moon')
        darkModeIcon.classList.add('fa-sun');        
    }
}


darkModeBtn.addEventListener('click', () => {

    toggleDarkMode();

    darkModeIcon.classList.add('animated');
    loadState();

    setTimeout( () => {
        darkModeIcon.classList.remove('animated');
    }, 500)
})


loadState();