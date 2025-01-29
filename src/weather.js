import { format } from 'date-fns';

async function getData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=FP27CE6THAUZJUCC95N5GJA6M`,
      { mode: 'cors' },
    );
    const data = await response.json();
     console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    alert('Retry! Enter correct location.');
    return null;
  }
}

function transformSelectedData(obj) {
  const changes = {
    icon: (value) => {
      const source = require(`./assets/${value}.svg`);
      return `<img src="${source}" alt="icon" id="icon">`;
    },
    datetime: (value) => {
      return value.substr(value.length - 2) === '00'
        ? value.slice(0, -3)
        : format(value, 'iii');
    },
    temp: (value) => `${value}°`,
    precipprob: (value) => `Chance of rain ${value}%`,
    humidity: (value) => `Humidity ${value}%`,
    sunrise: (value) => `Sunrise ${value.slice(0, -3)}`,
    sunset: (value) => `Sunset ${value.slice(0, -3)}`,
    feelslike: (value) => `Real feel ${value}°`,
    uvindex: (value) => `UV index ${value}`,
  };

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (key in changes) {
      acc[key] = changes[key](value);
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

export default async function processData(location = 'dhaka') {
  const selectedCurrentData = [
    'conditions',
    'feelslike',
    'temp',
    'humidity',
    'icon',
    'sunrise',
    'sunset',
    'uvindex',
    'precipprob',
  ];
  const selectedHourlyData = ['datetime', 'temp', 'icon', 'uvindex'];
  const selectedDailyData = ['datetime', 'temp', 'icon'];

  const data = await getData(location);

  // console.log(data);

  if (!data) return;

  const selectedData = {
    current: pickSelectedData(data.currentConditions, selectedCurrentData),
    hourly: data.days[0].hours.map((hour) =>
      pickSelectedData(hour, selectedHourlyData),
    ),
    daily: data.days.map((day) => pickSelectedData(day, selectedDailyData)),
  };

  console.log(selectedData);
  const processedData = {
    current: transformSelectedData(selectedData.current),
    hourly: selectedData.hourly.map((hour) => transformSelectedData(hour)),
    daily: selectedData.daily.map((day) => transformSelectedData(day)),
  };

  console.log(processedData);
  displayData(processedData);
  // return processedData;
}

function pickSelectedData(obj, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}

function createDisplayElements(child, parent, obj) {
  child.innerHTML = Object.values(obj)
    .map((value) => `<div class="value">${value}</div>`)
    .join('  ');
  parent.appendChild(child);
}

function slideshow(totalPages) {
  let currentPage = 1;

  function updateSlide(container) {
    const offset = -(currentPage - 1) * 228 * 3;
    container.style.transform = `translateX(${offset}px)`;
  }

  function previousSlide(container) {
    if (currentPage > 1) {
      currentPage--;
    } else {
      currentPage = totalPages;
    }
    updateSlide(container);
  }

  function nextSlide(container) {
    if (currentPage < totalPages) {
      currentPage++;
    } else {
      currentPage = 1;
    }
    updateSlide(container);
  }

  return { previousSlide, nextSlide };
}

function createSlideArrow(dir) {
  const arrow = document.createElement('div');
  arrow.className = dir;
  arrow.innerHTML = dir === 'left' ? '&lt' : '&gt';
  return arrow;
}

function createSlideFrame(id) {
  const frame = document.createElement('div');
  const dataContainer = document.createElement('div');
  dataContainer.id = id;
  frame.className = 'frame';

  return { dataContainer, frame };
}

function setupSlide(data, info) {
  const { dataContainer, frame } = createSlideFrame(info.id);

  data.forEach((set) => {
    const child = document.createElement('div');
    child.className = info.childClass;
    createDisplayElements(child, dataContainer, set);
  });

  const leftArr = createSlideArrow('left');
  const rightArr = createSlideArrow('right');

  const createSlideshow = slideshow(info.totalPages);

  leftArr.addEventListener('click', () =>
    createSlideshow.previousSlide(dataContainer),
  );
  rightArr.addEventListener('click', () =>
    createSlideshow.nextSlide(dataContainer),
  );

  frame.append(leftArr, dataContainer, rightArr);

  return frame;
}

function displayData(processedData) {
  const weatherData = document.getElementById('weather-data');
  const currentData = document.createElement('div');
  currentData.id = 'current';
weatherData.innerHTML = '';
  // console.log(new Date().toLocaleTimeString(undefined, {hour12: false,   hour: '2-digit',
  //   minute: '2-digit'}))

  createDisplayElements(currentData, document.body, processedData.current);

  const hourlyData = setupSlide(processedData.hourly, {
    id: 'hourly',
    childClass: 'hour',
    totalPages: 8,
  });

  const dailyData = setupSlide(processedData.daily, {
    id: 'daily',
    childClass: 'day',
    totalPages: 5,
  });

  weatherData.append(currentData, hourlyData, dailyData);
}

