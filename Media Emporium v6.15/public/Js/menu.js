const header = document.createElement("header");
const LogoCon = document.createElement("div");
const logo = document.createElement("h3");
const DonationsCon = document.createElement("button");
const menuBtn = document.createElement("button");
const sideMenu = document.createElement("div");
const menuOverlay = document.createElement("div");
const Donations = document.createElement("button");
const Advertising = document.createElement("button");
const Settings = document.createElement("button");
const Logout = document.createElement("button");

logo.innerText = "Project Africa";
DonationsCon.innerHTML = "<i class='bx bx-donate-heart'></i>";
menuBtn.innerHTML = "<i class = 'bx bx-menu'></i>";
Donations.innerHTML = "<i class='bx bx-donate-heart'></i> Donate";
Advertising.innerHTML = "<i class='bx bx-tv'></i> Advertising (Coming on full release)";
Settings.innerHTML = "<i class='bx bx-cog'></i> Settings (Under construction)";
Logout.innerHTML = "<i class='bx bx-log-out'></i> Logout";

LogoCon.className = "LogoCon";
logo.className = "logo";
DonationsCon.className = "headerDonationBtn";

menuBtn.id = "menuBtn";
sideMenu.id = "sideMenu";
menuOverlay.id = "menuOverlay";
Logout.id = "logoutBtn";

document.body.append(header);
LogoCon.append(logo);
header.appendChild(LogoCon);
header.appendChild(DonationsCon);
header.appendChild(menuBtn);
document.body.append(sideMenu);
document.body.append(sideMenu);
sideMenu.appendChild(Donations);
sideMenu.appendChild(Advertising);
sideMenu.appendChild(Settings);
sideMenu.appendChild(Logout);
document.body.append(menuOverlay);

LogoCon.onclick = function() {
  window.location.href = "home.html"; 
};

Donations.onclick = function() {
  window.location.href = "donations.html"; 
};

DonationsCon.onclick = function() {
  window.location.href = "donations.html"; 
};

menuBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
  menuOverlay.classList.toggle("show");
});

menuOverlay.addEventListener("click", () => {
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("show");
});

Logout.addEventListener("click", () => {
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
