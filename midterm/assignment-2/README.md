# Midterm Lab

Name: Ibrahim
Roll no: FA24-BCS-071
N = 71 | BP = 671px | H = 137 | K = 5
Cart limit per product = (71 mod 4) + 2 = 5 | Delivery window = exam date + 71 days

## Files changed

index.html, style.css, checkout.html (new), script.js (new), README.md, FA24-BCS-071-midterm.pdf

## Task 1

Added a "Shop by Category" item with a 5 column mega panel using :hover and :focus-within, with absolute positioning and a high z-index so it overlays the page without pushing it. Below 671px the same 5 groups appear as <details> accordions inside a CSS-only hamburger menu.

## Task 2

Created checkout.html with two fieldsets. Errors are shown with :user-invalid so nothing is red on load. Grid layout switches at 671px.

## Task 3

script.js stores cart items in an array, reads name/price from each card, updates the badge, renders the mini-cart, totals with reduce(), and caps each product at 5 additions.

## AI tools used

Claude and chatgpt
