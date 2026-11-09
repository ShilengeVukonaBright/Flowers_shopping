# BRT Flowers & Bouquet

A lightweight, responsive flower-shop front end built with HTML, CSS, and vanilla JavaScript. No build step or package installation is required.

## Run the project

Open `index.html` in a browser, or serve this folder with a local static web server. The home page links to the bouquet catalog, sign-up form, and demo checkout.

## Features

- Responsive home, catalog, sign-up, and checkout pages.
- Catalog search and add-to-bag controls.
- Shopping bag shared between the catalog and checkout using browser `sessionStorage`.
- Demo checkout order summary and order confirmation.
- Mobile navigation menu and mobile-friendly layouts.

## Demo limitations

This project is a front-end demonstration. It has no server, user accounts, order fulfillment, or payment provider. Checkout only displays and clears the local demo bag; **no payment is collected**. Do not enter real payment details. The sign-up form does not create or store accounts.

Product illustrations use emoji because the project does not include local product image files. Replace these with licensed product photography when available.

## Main files

- `index.html` and `style.css` — home page
- `flower.html` and `flowers.css` — product catalog
- `payment.html` and `payment.css` — demo checkout
- `signUP.html` and `sign.css` — demo sign-up form
- `app.js` — responsive navigation, catalog search, cart, checkout, and sign-up interactions
