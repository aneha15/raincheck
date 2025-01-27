async function getData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=FP27CE6THAUZJUCC95N5GJA6M`,
      { mode: 'cors' },
    );
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
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

  const processedData = {
    current: pick(data.currentConditions, selectedCurrentData),
    hourly: data.days[0].hours.map((hour) => pick(hour, selectedHourlyData)),
    daily: data.days.map((day) => pick(day, selectedDailyData)),
  };

  console.log(processedData);
  displayData(processedData);
  // return processedData;
}

function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}

function createDisplayElements(child, parent, obj) {
  child.innerHTML = Object.entries(obj)
    .map(
      ([key, value]) =>
        ` <div class="container">
      <div class="key">${key}</div>
      <div class="value">${value}</div>
    </div> `,
    )
    .join(' | ');
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
    console.log(container);
    updateSlide(container);
  }

  return { previousSlide, nextSlide };
}

function displayData(processedData) {
  const currentData = document.createElement('div');
  currentData.id = 'current';

  createDisplayElements(currentData, document.body, processedData.current);

  const hourlyData = document.createElement('div');
  const hourlyDataFrame = document.createElement('div');
  hourlyData.id = 'hourly';
  hourlyDataFrame.className = 'frame';

  processedData.hourly.forEach((hour) => {
    const hourDiv = document.createElement('div');
    hourDiv.className = 'hour';
    createDisplayElements(hourDiv, hourlyData, hour);
  });

  const leftArrowHourly = document.createElement('div');
  leftArrowHourly.className = 'left';
  leftArrowHourly.innerHTML = '&lt';
  const rightArrowHourly = document.createElement('div');
  rightArrowHourly.className = 'right';
  rightArrowHourly.innerHTML = '&gt';
  hourlyDataFrame.append(leftArrowHourly, hourlyData, rightArrowHourly);

  document.body.appendChild(hourlyDataFrame);

  const hourlySlideshow = slideshow(8); 

  leftArrowHourly.addEventListener('click', () => hourlySlideshow.previousSlide(hourlyData));
  rightArrowHourly.addEventListener('click', () => hourlySlideshow.nextSlide(hourlyData));

  const dailyData = document.createElement('div');
  const dailyDataFrame = document.createElement('div');
  dailyData.id = 'daily';
  dailyDataFrame.className = 'frame';

  processedData.daily.forEach((day) => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    createDisplayElements(dayDiv, dailyData, day);
  });

  const leftArrowDaily = document.createElement('div');
  leftArrowDaily.className = 'left';
  leftArrowDaily.innerHTML = '&lt';
  const rightArrowDaily = document.createElement('div');
  rightArrowDaily.className = 'right';
  rightArrowDaily.innerHTML = '&gt';
  dailyDataFrame.append(leftArrowDaily, dailyData, rightArrowDaily);

  document.body.appendChild(dailyDataFrame);

  const dailySlideshow = slideshow(5); 

  leftArrowDaily.addEventListener('click', () => dailySlideshow.previousSlide(dailyData));
  rightArrowDaily.addEventListener('click', () => dailySlideshow.nextSlide(dailyData));

}

const testData = {
  current: {
    conditions: 'Rain, Overcast',
    feelslike: 45.4,
    temp: 45.4,
    humidity: 87.9,
    icon: 'rain',
    sunrise: '06:53:11',
    sunset: '17:18:58',
    uvindex: 0,
    precipprob: 100,
  },
  hourly: [
    {
      datetime: '00:00:00',
      temp: 47.9,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '01:00:00',
      temp: 47.4,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '02:00:00',
      temp: 45.9,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '03:00:00',
      temp: 45.9,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '04:00:00',
      temp: 45,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '05:00:00',
      temp: 45,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '06:00:00',
      temp: 44,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '07:00:00',
      temp: 44,
      icon: 'rain',
      uvindex: 0,
    },
    {
      datetime: '08:00:00',
      temp: 45.9,
      icon: 'rain',
      uvindex: 1,
    },
    {
      datetime: '09:00:00',
      temp: 49.9,
      icon: 'rain',
      uvindex: 3,
    },
    {
      datetime: '10:00:00',
      temp: 51,
      icon: 'partly-cloudy-day',
      uvindex: 4,
    },
    {
      datetime: '11:00:00',
      temp: 54.1,
      icon: 'partly-cloudy-day',
      uvindex: 6,
    },
    {
      datetime: '12:00:00',
      temp: 56,
      icon: 'partly-cloudy-day',
      uvindex: 6,
    },
    {
      datetime: '13:00:00',
      temp: 56.9,
      icon: 'partly-cloudy-day',
      uvindex: 5,
    },
    {
      datetime: '14:00:00',
      temp: 58.9,
      icon: 'partly-cloudy-day',
      uvindex: 5,
    },
    {
      datetime: '15:00:00',
      temp: 58,
      icon: 'partly-cloudy-day',
      uvindex: 4,
    },
    {
      datetime: '16:00:00',
      temp: 58,
      icon: 'partly-cloudy-day',
      uvindex: 3,
    },
    {
      datetime: '17:00:00',
      temp: 54.1,
      icon: 'partly-cloudy-day',
      uvindex: 0,
    },
    {
      datetime: '18:00:00',
      temp: 53,
      icon: 'partly-cloudy-night',
      uvindex: 0,
    },
    {
      datetime: '19:00:00',
      temp: 52.1,
      icon: 'partly-cloudy-night',
      uvindex: 0,
    },
    {
      datetime: '20:00:00',
      temp: 49.9,
      icon: 'partly-cloudy-night',
      uvindex: 0,
    },
    {
      datetime: '21:00:00',
      temp: 49,
      icon: 'partly-cloudy-night',
      uvindex: 0,
    },
    {
      datetime: '22:00:00',
      temp: 47,
      icon: 'partly-cloudy-night',
      uvindex: 0,
    },
    {
      datetime: '23:00:00',
      temp: 47,
      icon: 'partly-cloudy-night',
      uvindex: 0,
    },
  ],
  daily: [
    {
      datetime: '2025-01-27',
      temp: 50.2,
      icon: 'rain',
    },
    {
      datetime: '2025-01-28',
      temp: 49.6,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-01-29',
      temp: 50.7,
      icon: 'clear-day',
    },
    {
      datetime: '2025-01-30',
      temp: 50.6,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-01-31',
      temp: 51.5,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-02-01',
      temp: 54.6,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-02-02',
      temp: 57.2,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-02-03',
      temp: 57.7,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-02-04',
      temp: 58.5,
      icon: 'cloudy',
    },
    {
      datetime: '2025-02-05',
      temp: 48.3,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-02-06',
      temp: 38.8,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-02-07',
      temp: 40.2,
      icon: 'clear-day',
    },
    {
      datetime: '2025-02-08',
      temp: 42.6,
      icon: 'clear-day',
    },
    {
      datetime: '2025-02-09',
      temp: 52.1,
      icon: 'partly-cloudy-day',
    },
    {
      datetime: '2025-02-10',
      temp: 58.6,
      icon: 'partly-cloudy-day',
    },
  ],
};

displayData(testData);
