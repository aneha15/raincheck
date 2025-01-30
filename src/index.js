import './style.css';
import processData from './weather';

const buttons = (function () {
  const locationInput = document.getElementById('location');
  let unit = 'uk';

  processData('Tokyo', 'uk');

  function searchLocation() {
    const searchIcon = document.getElementById('search-icon');

    // console.log(locationInput.value);
    searchIcon.addEventListener('click', () =>
      processData(locationInput.value, unit),
    );
    locationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchIcon.click();
      }
    });
  }

  function convertTemp() {
    const c = document.getElementById('C');
    const f = document.getElementById('F');

    f.addEventListener('click', () => {
      c.style.cssText = 'color: rgb(157, 81, 160);';
      f.style.cssText = 'color:rgb(93, 33, 204);';
      if(!locationInput.value) return unit = 'us';
      processData(locationInput.value, 'us');
    });
    c.addEventListener('click', () => {
      f.style.cssText = 'color: rgb(157, 81, 160);';
      c.style.cssText = 'color:rgb(93, 33, 204);';
      if(!locationInput.value) return unit = 'uk';
      processData(locationInput.value, 'uk');
    });
  }

  return { searchLocation, convertTemp };
})();

buttons.searchLocation();
buttons.convertTemp();

// searchLocation();
