const baseUrl = "https://api.football-data.org/v2/";
const token   = '95dd5a15d9334bb5aafa1d61daf42947';

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function getStanding() {
  fetch(`${baseUrl}competitions/2014/standings?standingType=TOTAL`, {headers: {'X-Auth-Token': token}})
  .then(status)
  .then(json)
  .then(function(data) {
    let html = '';

    data.standings.forEach(function(standing) {
      standing.table.forEach(function(table) {
        html +=  `
          <tr class="hoverable">
            <td>${table.position}</td>
            <td>
              <a href="./team.html?id=${table.team.id}">
                <img src="${table.team.crestUrl}" class="avatar">
                <span>${table.team.name}</span>
              </a>
            </td>
            <td>${table.playedGames}</td>
            <td>${table.goalDifference}</td>
            <td>${table.points}</td>
          </tr>
        `;
      })
    })

    document.getElementById("teams").innerHTML = html;
  })
  .catch(error);
}

function getTeamById() {
  return new Promise(function(resolve, reject) {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam   = urlParams.get("id");
        
    fetch(`${baseUrl}teams/${idParam}`, {headers: {'X-Auth-Token': token}})
      .then(status)
      .then(json)
      .then(function(data) {
        
        let html = `
          <div class="card purple lighten-5">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              <p><i class="material-icons">location_on</i>${data.address}</p>
              <p><i class="material-icons">phone</i>${data.phone}</p>
              <p><i class="material-icons">email</i>${data.email}</p>
              <p><i class="material-icons">laptop</i>${data.website}</p>
            </div>
          </div>
        `;
        
        document.getElementById("body-content").innerHTML = html;
        
        resolve(data);
      });
  });
}

function getSavedTeams() {
  getAll().then(function(data) {
    let html = '';
    data.forEach(function(data) {
      html += `
        <div class="card hoverable purple lighten-5">
          <a href="./team.html?id=${data.id}&saved=true">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
            </div>
          </a>
        </div>
      `;
    });
    document.getElementById("body-content").innerHTML = html;
  });
}

function getSavedTeamById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam   = urlParams.get("id");
  
  getById(idParam).then(function(data) {
    let html = `
      <div class="card purple lighten-5">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${data.crestUrl}" />
          <div class="fixed-action-btn">
            <a class="btn-floating btn-large red hoverable" onclick="deleteTeamById()">
              <i class="large material-icons">thumb_down</i>
            </a>
          </div>
        </div>
        <div class="card-content">
          <span class="card-title">${data.name}</span>
          <p><i class="material-icons">location_on</i>${data.address}</p>
          <p><i class="material-icons">phone</i>${data.phone}</p>
          <p><i class="material-icons">email</i>${data.email}</p>
          <p><i class="material-icons">laptop</i>${data.website}</p>
        </div>
      </div>
    `;

  document.getElementById("body-content").innerHTML = html;
  });
}

function deleteTeamById() {
  let item = getTeamById();

  item.then(function(team) {
    deleteTeam(team.id);
  });
}