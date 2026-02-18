function updateClock(){
  document.getElementById("clock").innerText =
    new Date().toLocaleString();
}
setInterval(updateClock,1000);
updateClock();

async function fetchJSON(url,headers={}){
  const res=await fetch(url,{headers});
  return res.json();
}

async function loadWeather(){
  const data = await fetchJSON(config.proxyMetar);

  document.getElementById("weather").innerHTML=
    `Temp ${data.temperature?.value}°C<br>
     Vent ${data.wind_direction?.value}°/${data.wind_speed?.value}kt<br>
     ${data.raw}`;
}

}

function updateRunwayIndicator(runway){
  const box=document.getElementById("runwayIndicator");
  box.className="runway-box";

  if(runway?.includes("22")){
    box.classList.add("runway-22");
  }else if(runway?.includes("04")){
    box.classList.add("runway-04");
  }

  box.innerText=runway || "--";
}

function renderFlights(data,containerId){
  const flights=Object.values(data);
  document.getElementById(containerId).innerHTML=
  `<table>
    <tr>
      <th>Vol</th>
      <th>Op</th>
      <th>Heure</th>
      <th>Piste</th>
      <th>Type</th>
    </tr>
    ${flights.map(f=>`
      <tr>
        <td>${f.flightNumber}</td>
        <td>${f.operator}</td>
        <td>${new Date(f.date).toLocaleTimeString()}</td>
        <td>${f.runway||"-"}</td>
        <td>${f.aircraftType}</td>
      </tr>`).join("")}
  </table>`;

  if(flights[0]?.runway){
    updateRunwayIndicator(flights[0].runway);
  }
}

async function loadFIDS(){
  const arrivals=await fetchJSON(config.proxyArrivals);
  const departures=await fetchJSON(config.proxyDepartures);

  renderFlights(arrivals,"arrivals");
  renderFlights(departures,"departures");
}

async function loadMap(){
  const map=L.map('map').setView([50.637,5.443],13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© OpenStreetMap'
  }).addTo(map);

  const sonos=await fetchJSON("sonometres.json");

  sonos.forEach(s=>{
    L.marker([s.lat,s.lon])
      .addTo(map)
      .bindPopup(`${s.name}<br>Seuil ${s.thresholdDB} dB`);
  });
}

async function init(){
  await loadWeather();
  await loadFIDS();
  await loadMap();

  setInterval(loadFIDS,60000);
  setInterval(loadWeather,300000);
}

init();

