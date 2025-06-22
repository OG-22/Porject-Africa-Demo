const container = document.getElementById("donations");

// Header Section
const Conheader = document.createElement("div");
Conheader.className = "donation-header";

const title = document.createElement("h1");
title.className = "donation-title";
title.textContent = "Help grow our project";

const discription = document.createElement("p");
discription.className = "donation-description";
discription.textContent = "Help fund the growth of our project, every single donation makes a big difference whether it is R1 or R100 we are grateful regardless. Our app, codenamed Project Africa, aims to be the first African-made social media platform that empowers Africans and erases the illusion set by western propaganda. The app shows the world as it is — without filters — allowing free speech and expression while maintaining morals and dignity. Each donation goes toward funding these objectives and spreading the message.";

Conheader.appendChild(title);
Conheader.appendChild(discription);

// EFT Section
const EFT = document.createElement("div");
EFT.className = "eft-section";

const EFTtitle = document.createElement("h3");
EFTtitle.className = "eft-title";
EFTtitle.textContent = "EFT Payment";

const bankName = document.createElement("h4");
bankName.textContent = "Bank Name: Capitec Business";

const bussinessName = document.createElement("h4");
bussinessName.textContent = "Account Holder: OG-Media";

const accountNumber = document.createElement("h4");
accountNumber.textContent = "Account Number: 1053765134";

const reference = document.createElement("h4");
reference.textContent = "Reference: 'Your Name'";

EFT.append(EFTtitle, bankName, bussinessName, accountNumber, reference);

const info = document.createElement("h2");
info.textContent = "Card payments will be accepted starting from anywhere between 25 June and 1 July 2025";

// Append to main container
container.append(Conheader, EFT, info);