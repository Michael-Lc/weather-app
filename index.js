function getWeather(location) {
  const api = `https://api.weatherapi.com/v1/current.json?key=d2282deb52c74c0691013155210302&q=${location}`;

  fetch(api)
    .then((response) => response.json())
    .then((data) => setWeather(data))
    .catch((err) => console.log(err));
}

getWeather("Accra");

function setWeather(data) {
  const locationData = data.location;
  const weatherData = data.current;

  const container = document.getElementsByClassName("container")[0];
  container.classList.remove("light-theme", "dark-theme");

  const bg = document.getElementById("bg-video");
  const location = document.getElementById("location");
  const date = document.getElementById("date");
  const temp = document.getElementById("temp");
  const icon = document.getElementById("icon");
  const condition = document.getElementById("condition");

  location.innerText = locationData.name;
  const currentDate = new Date(weatherData.last_updated).toDateString();
  const currentTime = new Date(weatherData.last_updated).getHours();
  let hour;

  if (currentTime === 0) {
    hour = 12;
  } else if (currentTime > 12) {
    hour = currentTime - 12;
  } else {
    hour = currentTime;
  }

  date.innerText = `${currentDate.split(" ")[0]}, ${hour}${
    currentTime > 11 ? "PM" : "AM"
  }`;

  temp.innerText = weatherData.temp_c;
  icon.src = weatherData.condition.icon;
  condition.innerText = weatherData.condition.text;

  switch (weatherData.is_day) {
    case 0:
      container.classList.add("light-theme");
      if (
        condition.innerText.match(/cloudy/gi) ||
        condition.innerText.match(/overcast/gi)
      ) {
        bg.src = "./videos/Cloudy-Night.mp4";
      } else if (condition.innerText.match(/rain/gi)) {
        bg.src = "./videos/Rainy-Night.mp4";
      } else if (condition.innerText.match(/clear/gi)) {
        bg.src = "./videos/Clear-Night.mp4";
      } else if (condition.innerText.match(/wind/gi)) {
        bg.src = "./videos/Windy-Night.mp4";
      }
      return;
    case 1:
      container.classList.add("dark-theme");
      if (
        condition.innerText.match(/cloudy/gi) ||
        condition.innerText.match(/overcast/gi)
      ) {
        bg.src = "./videos/Cloudy-Day.mp4";
      } else if (condition.innerText.match(/rain/gi)) {
        bg.src = "./videos/Rainy-Day.mp4";
      } else if (condition.innerText.match(/sun/gi)) {
        bg.src = "./videos/Sunny.mp4";
      } else if (condition.innerText.match(/wind/gi)) {
        bg.src = "./videos/Windy-Day.mp4";
      } else if (condition.innerText.match(/snow/gi)) {
        bg.src = "./videos/Snowy-Day.mp4";
      }
      return;
  }
}

const search = document.getElementById("search");
const list = document.getElementById("auto-complete");

search.addEventListener("input", function (event) {
  const value = this.value;

  if (!value) return false;

  const query = `https://api.weatherapi.com/v1/search.json?key=d2282deb52c74c0691013155210302&q=${value}`;
  fetch(query)
    .then((response) => response.json())
    .then((cities) => {
      // create array of list items and append them to ul under search
      let items = ``,
        count = 0;
      for (const city of cities) {
        if (count > 3) break;
        items += `<li class="auto-complete-item">${city.name}</li>`;
        count += 1;
      }
      list.innerHTML = items;

      const listItems = document.getElementsByClassName("auto-complete-item");

      for (const item of listItems) {
        item.addEventListener("click", function (event) {
          getWeather(event.target.innerText);
          search.value = "";
          list.innerHTML = "";
        });
      }
    })
    .catch((err) => console.log(err));
});
