import { local } from 'wix-storage';

const pageElements = { //Will hold all the elements in the page as arrays
  textElements: [],
  boxContainers: [],
  buttons: []
}

let darkMode = { //Define the color scheme of the dark mode
  textElementFontColor: "white",
  boxContainersBackgroundColor: "#323232",
  buttonsColor: "white"
}

let defaultScheme = { //Will hold the default color scheme without the need to set it manually
  defaultTextElementsHtml: [],
  boxContainersBackgroundColor: [],
  buttonsColor: []
}

$w.onReady(function () {
  saveDefaultColorScheme(); //Save default color scheme
  checkDarkMode(); //Check local whether dark mode is enabled
  addEventListenerToDarkmodeSwitch() //Add the onChange event to the darkmode switch
});

function saveDefaultColorScheme() {
  pageElements.textElements = $w("Text");
  pageElements.boxContainers = $w("Box");
  pageElements.buttons = $w("Button");

  pageElements.textElements.forEach(textElement => {
    defaultScheme.defaultTextElementsHtml.push(textElement.html);
  });
  pageElements.boxContainers.forEach(boxContainer => {
    defaultScheme.boxContainersBackgroundColor.push(boxContainer.style.backgroundColor);
  });
  pageElements.buttons.forEach(button => {
    defaultScheme.buttonsColor.push(button.style.color)
  });
}

function checkDarkMode() {
  darkMode.enabled = JSON.parse(local.getItem('darkmodeEnabled'));
  if (darkMode.enabled === true) {
    switchToDarkMode();
    $w("#darkModeSwitch").checked = true;
  } else {
    switchToDefault();
    $w("#darkModeSwitch").checked = false;
  }
}

function addEventListenerToDarkmodeSwitch() {
  $w("#darkModeSwitch").onChange((event) => {
    if (darkMode.enabled) {
      switchToDefault();
    } else {
      switchToDarkMode();
    }
  })
}

function switchToDarkMode() {
  darkMode.enabled = true;
  local.setItem('darkmodeEnabled', true);
  $w("#swithTooltip").text = "Click to disable dark mode";
  const htmlTagCleanerRegex = /<[^>]*>?/gm; //Regular expression to clean the html tags from the text element.
  pageElements.textElements.forEach(textElement => {
    let text = textElement.html.replace(htmlTagCleanerRegex, '')
    $w(`#${textElement.id}`).html = textElement.html.replace(text, `<span style=color:${darkMode.textElementFontColor}>${text}</span>`)
  });
  pageElements.boxContainers.forEach(boxElement => {
    $w(`#${boxElement.id}`).style.backgroundColor = darkMode.boxContainersBackgroundColor
  });
  pageElements.buttons.forEach(buttonElement => {
    $w(`#${buttonElement.id}`).style.color = darkMode.buttonsColor;
  });
}

function switchToDefault() {
  darkMode.enabled = false;
  local.setItem('darkmodeEnabled', false);
  $w("#swithTooltip").text = "Click to enable dark mode";
  pageElements.textElements.forEach((textElement, index) => {
    $w(`#${textElement.id}`).html = textElement.html.replace(textElement.html, defaultScheme.defaultTextElementsHtml[index])
  });
  pageElements.boxContainers.forEach((boxElement, index) => {
    $w(`#${boxElement.id}`).style.backgroundColor = defaultScheme.boxContainersBackgroundColor[index];
  });
  pageElements.buttons.forEach((buttonElement, index) => {
    $w(`#${buttonElement.id}`).style.color = defaultScheme.buttonsColor[index];
  });
}