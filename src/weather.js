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
    return null;
  }
}

export default async function processData() {
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

  const data = await getData('dhaka');

  console.log(data);

  if (!data) {
    return;
  }

  const processedData = {
    current: {},
    hourly: [],
    daily: [],
  };

  const current = processedData['current'];
  const daily = processedData['daily'];
  const hourly = processedData['hourly'];

  const unprocessedCurrentData = data['currentConditions'];
  const unprocessedDays = data['days'];
  const unprocessedHours = unprocessedDays[0]['hours'];

  Object.entries(unprocessedCurrentData).forEach(([key, value]) => {
    if (selectedCurrentData.includes(key)) {
      current[key] = value;
    }
  });
  console.log(current);

  unprocessedDays.forEach((day) => {
    daily.push({});
    Object.entries(day).forEach(([key, value]) => {
      if (selectedDailyData.includes(key)) {
        daily[daily.length - 1][key] = value;
      }
    });
  });

  unprocessedHours.forEach((hour) => {
    hourly.push({});
    Object.entries(hour).forEach(([key, value]) => {
      if (selectedHourlyData.includes(key)) {
        hourly[hourly.length - 1][key] = value;
      }
    });
  });

  console.log(processedData);
}
