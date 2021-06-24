//! CONST
const infoElementQuery = "div#info.style-scope ytd-watch-flexy";

// searching for info element for every 100ms until found
const searchElementInt = setInterval(() => {
  const infoElement = document.querySelector(infoElementQuery);

  if (infoElement !== null) {
    // set dummy element for testing
    const element1 = document.createElement("div");
    element1.className = "style-scope ytd-watch-flexy";
    element1.id = "subtitleExt";
    element1.innerText = "HALO";

    infoElement.parentElement.insertBefore(element1, infoElement);
    alert(infoElement);

    //   delete the interval after found the element
    clearInterval(searchElementInt);
  }
}, 100);
