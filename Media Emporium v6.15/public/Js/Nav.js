const Sidenav = document.getElementById("Sidenav");

const nav = document.createElement("div");
nav.className = "container";
nav.id = "nav";

const searchBar = document.createElement("input");
searchBar.type = "search";
searchBar.placeholder = "   search";
searchBar.id = "searchBar";

const buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";

const home = document.createElement("button");
home.innerHTML = "<i class='bx bx-home'></i>Home";
home.id = "home";
home.className = "button";
home.onclick = function () {
  window.location.href = "home.html"; 
};

const explore = document.createElement("button");
explore.innerHTML = "<i class='bx bx-compass'></i>Explore";
explore.id = "explore";
explore.className = "button";
explore.onclick = function () {
  window.location.href = "explore.html";
};

const reels = document.createElement("button");
reels.innerHTML = "<i class='bx bx-video'></i>Videos";
reels.id = "reels";
reels.className = "button";
reels.onclick = function () {
  window.location.href = "reels.html";
};

const profile = document.createElement("button");
profile.innerHTML = "<i class='bx bx-user'></i>Profile";
profile.id = "profile";
profile.className = "button";
profile.onclick = function () {
  window.location.href = "profile.html";
};

const logoutB = document.createElement("button");
logoutB.innerHTML = "Logout";
logoutB.id = "SideLogout";

logoutB.addEventListener("click", () => {
  fetch("/logout", {
    method: "GET",
    credentials: "same-origin" // ensure cookies/session are sent
  })
  .then(() => {
    window.location.href = "/"; // redirect to home after logout
  })
  .catch(err => {
    console.error("Logout failed:", err);
  });
});

const copyright = document.createElement("p");
copyright.id = "c";
copyright.textContent = "Copyright &copy;2025; Project Africa";


buttonContainer.appendChild(home);
buttonContainer.appendChild(explore);
buttonContainer.appendChild(reels);
buttonContainer.appendChild(profile);
buttonContainer.appendChild(logoutB);
nav.append(searchBar, buttonContainer, copyright);
Sidenav.appendChild(nav);