document.addEventListener("DOMContentLoaded", () => {
  // Cart settings
  const MAX_PER_PRODUCT = 5;

  // Cart data
  let cart = [];

  // HTML elements
  const cartCount = document.getElementById("cart-count");
  const cartLink = document.querySelector(".cart-link");

  // Create the mini-cart
  const miniCart = document.createElement("div");
  miniCart.id = "mini-cart";
  miniCart.className = "mini-cart";
  miniCart.hidden = true;

  miniCart.innerHTML = `
        <div class="mini-cart-header">
            <h3>Your Cart</h3>
            <button type="button" id="close-cart" aria-label="Close cart">
                &times;
            </button>
        </div>

        <div id="cart-items"></div>

        <div class="mini-cart-footer">
            <div class="cart-total">
                <span>Total</span>
                <strong id="cart-total">$0.00</strong>
            </div>
        </div>
    `;

  document.body.appendChild(miniCart);

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const closeCartButton = document.getElementById("close-cart");

  // Add basic mini-cart styling
  const cartStyles = document.createElement("style");

  cartStyles.textContent = `
        .mini-cart {
            position: fixed;
            top: 80px;
            right: 20px;
            width: min(360px, calc(100vw - 40px));
            max-height: 75vh;
            overflow-y: auto;
            padding: 20px;
            background: #fff;
            color: #222;
            border: 1px solid #ddd;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            z-index: 9999;
        }

        .mini-cart[hidden] {
            display: none;
        }

        .mini-cart-header,
        .mini-cart-footer,
        .cart-total,
        .mini-cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .mini-cart-header {
            margin-bottom: 16px;
        }

        .mini-cart-header h3 {
            margin: 0;
            font-size: 20px;
        }

        #close-cart {
            border: none;
            background: transparent;
            font-size: 28px;
            cursor: pointer;
        }

        .mini-cart-item {
            align-items: flex-start;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }

        .mini-cart-item-info {
            flex: 1;
            min-width: 0;
        }

        .mini-cart-item-info p {
            margin: 4px 0;
            overflow-wrap: anywhere;
        }

        .mini-cart-item-info small {
            color: #666;
        }

        .remove-cart-item {
            border: 1px solid #ccc;
            border-radius: 20px;
            padding: 5px 10px;
            background: white;
            cursor: pointer;
        }

        .mini-cart-footer {
            margin-top: 16px;
            padding-top: 12px;
        }

        .cart-total {
            width: 100%;
            font-size: 17px;
        }

        .cart-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .cart-badge {
            min-width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 12px;
        }

        .limit-reached {
            opacity: 0.6;
            cursor: not-allowed !important;
        }

        .empty-cart {
            padding: 16px 0;
            color: #666;
        }
    `;

  document.head.appendChild(cartStyles);

  // Read product information from a product card
  function getProductInfo(card) {
    const nameElement = card.querySelector(".product-name");
    const priceElement = card.querySelector(".price");

    const name = nameElement?.textContent.trim();
    const priceText = priceElement?.textContent.trim() || "";
    const price = Number(priceText.replace(/[^0-9.]/g, ""));

    if (!name || !priceText || !Number.isFinite(price) || price <= 0) {
      return null;
    }

    return { name, price };
  }

  // Update the cart badge
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount) {
      cartCount.textContent = totalItems;
    }
  }

  // Update product buttons based on their quantities in the cart
  function updateProductButtons() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const product = getProductInfo(card);
      const button = card.querySelector("button");

      if (!product || !button) {
        return;
      }

      const cartItem = cart.find((item) => item.name === product.name);

      const quantity = cartItem ? cartItem.quantity : 0;
      const limitReached = quantity >= MAX_PER_PRODUCT;

      button.disabled = limitReached;
      button.classList.toggle("limit-reached", limitReached);

      if (!button.dataset.originalText) {
        button.dataset.originalText =
          button.textContent.trim() || "Add to Cart";
      }

      button.textContent = limitReached
        ? "Limit reached"
        : button.dataset.originalText;
    });
  }

  // Display the mini-cart contents and total
  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart">Your cart is empty.</p>';
    } else {
      cart.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "mini-cart-item";

        const info = document.createElement("div");
        info.className = "mini-cart-item-info";

        const name = document.createElement("p");
        name.textContent = item.name;

        const details = document.createElement("small");
        details.textContent = `$${item.price.toFixed(2)} × ${item.quantity}`;

        const subtotal = document.createElement("p");
        subtotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        info.append(name, details, subtotal);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-cart-item";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
          "aria-label",
          `Remove ${item.name} from cart`,
        );

        removeButton.addEventListener("click", () => {
          cart = cart.filter((cartItem) => cartItem.name !== item.name);

          updateCartCount();
          renderCart();
          updateProductButtons();
        });

        itemElement.append(info, removeButton);
        cartItemsContainer.appendChild(itemElement);
      });
    }

    // Calculate the total using reduce()
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Add a product to the cart
  document.querySelectorAll(".product-card").forEach((card) => {
    const button = card.querySelector("button");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const product = getProductInfo(card);

      if (!product) {
        alert("Could not read this product's name or price.");
        return;
      }

      const existingItem = cart.find((item) => item.name === product.name);

      if (existingItem) {
        if (existingItem.quantity >= MAX_PER_PRODUCT) {
          return;
        }

        existingItem.quantity++;
      } else {
        cart.push({
          name: product.name,
          price: product.price,
          quantity: 1,
        });
      }

      updateCartCount();
      renderCart();
      updateProductButtons();
    });
  });

  // Open or close the mini-cart using the cart icon
  if (cartLink) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      miniCart.hidden = !miniCart.hidden;
      renderCart();
    });
  }

  // Close button
  closeCartButton.addEventListener("click", () => {
    miniCart.hidden = true;
  });

  // Close the mini-cart when clicking outside it
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (
      !miniCart.hidden &&
      !miniCart.contains(target) &&
      !target.closest(".cart-link")
    ) {
      miniCart.hidden = true;
    }
  });

  // Initial display
  updateCartCount();
  renderCart();
  updateProductButtons();
});
