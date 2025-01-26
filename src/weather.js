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
    current: pick(data.currentConditions, selectedCurrentData),
    hourly: data.days[0].hours.map((hour) => pick(hour, selectedHourlyData)),
    daily: data.days.map((day) => pick(day, selectedDailyData)),
  };

  console.log(processedData);
}

function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}
