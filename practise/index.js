const button = document.getElementById("search-Button");
const input = document.getElementById("input-City");

const cityName = document.getElementById("city");
const cityTime = document.getElementById("time");
const cityTemp = document.getElementById("temperature");

async function getCityData(cityName) {
  const promise = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=149a40c764bc4a1498a15441241106&q=${cityName}&aqi=yes`
  );
  return await promise.json();
}

button.addEventListener("click", async () => {
  const value = input.value;
  const results = await getCityData(value);
  cityName.innerText = `${results.location.name},${results.location.region},${results.location.country}`;
  cityTime.innerText = results.location.localtime;
  cityTemp.innerText = results.current.temp_c;
  console.log(results);
});
