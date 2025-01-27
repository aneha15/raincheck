import './style.css';
import processData from './weather';

function handleSearch(location) {
  console.log(location);
  processData(location);
}

function searchLocation() {
  // const form = document.getElementById('search-location');
  const locationInput = document.getElementById('location');
  const searchIcon = document.getElementById('search-icon');

  // console.log(locationInput.value);
  searchIcon.addEventListener('click', () => handleSearch(locationInput.value));
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchIcon.click();
    }
  });
}

searchLocation();

// getData('switzerland');
// processData();
