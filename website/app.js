/* Global Variables */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=681b7f5d2e785ccf13939701b6c11065";
const units = "&units=metric";

// entryHolder
const dateHolder = document.querySelector("#date");
const tempHolder = document.querySelector("#temp");
const feelingHolder = document.querySelector("#content");
const errorHolder = document.querySelector("#error");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

const generate = document.querySelector("#generate");

generate.addEventListener("click", performAction);

let updateState = {};

function performAction() {
  const zip = document.querySelector("#zip").value;
  const feelings = document.querySelector("#feelings").value;

  getWeatherData(baseURL, zip, apiKey, units).then((data) => {
    updateState = data;
    // check data before pushing it to server
    if (data.cod == "200") {
      postWeatherData("/add", { newDate, data, feelings });
      updateUI();
      return;
    }
    updateUI();
  });
}

// getting weather data from api
const getWeatherData = async (baseURL, zip, apiKey, units) => {
  const weatherData = await fetch(baseURL + zip + apiKey + units);
  try {
    return await weatherData.json();
  } catch (error) {
    // Handling Error
    console.log(`Error: ${error}`);
  }
};

// posting or pushing data to our server
const postWeatherData = async (url = "", data = {}) => {
  const pushData = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    return await pushData.json();
  } catch (error) {
    // Handling Error
    console.log(`Error: ${error}`);
  }
};

// getting data from server and showing it to user
const updateUI = async () => {
  if (updateState.cod == 200) {
    const response = await fetch("/all");
    try {
      const data = await response.json();

      dateHolder.textContent = "Date: " + data.date;
      tempHolder.textContent = "Temp: " + data.weather.main.temp;
      feelingHolder.textContent = "Feelings: " + data.feelings;
      errorHolder.textContent = "";
    } catch (error) {
      // Handling Error
      console.log(`Error: ${error}`);
    }
  } else {
    resetHolder();
    if (updateState.cod == 404) {
      errorHolder.textContent =
        updateState.message + ", please enter zip-code for city in usa";
      return;
    }
    errorHolder.textContent = updateState.message;
  }
};

// reset holder
function resetHolder() {
  dateHolder.textContent = "";
  tempHolder.textContent = "";
  feelingHolder.textContent = "";
}
