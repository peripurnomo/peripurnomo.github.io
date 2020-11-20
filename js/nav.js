document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".sidenav");

  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status !== 200) return;
          document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        document
          .querySelectorAll(".sidenav a, .topnav a")
          .forEach(function(elm) {
            elm.addEventListener("click", function(event) {
              let sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });
      }
    };
    xhttp.open("GET", "/pages/templates/nav.html", true);
    xhttp.send();
  }

  let page = window.location.hash.substr(1);

  if (page === "") page = "standing";
  loadPage(page);

  function loadPage(page) {
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        let content = document.querySelector("#body-content");
        
        if (page === "standing") {
          getStanding();
        } else if (page === "favorite") {
          getSavedTeams();
        }

        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status === 404) {
          content.innerHTML = "<p>Page not found!</p>";
        } else {
          content.innerHTML = "<p>Ups.. Page not found!</p>";
        }
      }
    };
    xhttp.open("GET", `pages/${page}.html`, true);
    xhttp.send();
  }
});
