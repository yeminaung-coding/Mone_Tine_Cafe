/* =========================================================
   MONE TINE COFFEE
   JavaScript
   ========================================================= */


/* ==================== CART DATA ==================== */

let cart = [];


/* ==================== HELPER FUNCTIONS ==================== */

function formatPrice(price) {
    return price.toLocaleString("en-US") + " MMK";
}


function getCartCount() {

    let count = 0;

    cart.forEach(function(item) {
        count += item.quantity;
    });

    return count;
}


function getCartTotal() {

    let total = 0;

    cart.forEach(function(item) {
        total += item.price * item.quantity;
    });

    return total;
}


/* ==================== UPDATE CART BAR ==================== */

function updateCartBar() {

    const orderBar = document.getElementById("orderBar");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const count = getCartCount();
    const total = getCartTotal();

    if (count > 0) {

        orderBar.classList.add("show");

        cartCount.textContent =
            count + (count === 1 ? " item" : " items");

        cartTotal.textContent = formatPrice(total);

    } else {

        orderBar.classList.remove("show");

        cartCount.textContent = "0 items";

        cartTotal.textContent = "0 MMK";
    }
}


/* ==================== ADD TO CART ==================== */

const addButtons = document.querySelectorAll(".add-to-cart");

addButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingItem = cart.find(function(item) {
            return item.name === name;
        });

        if (existingItem) {

            existingItem.quantity += 1;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCartBar();

        showToast(name + " added to your order.");

    });

});


/* ==================== SHOW TOAST ==================== */

function showToast(message) {

    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;

    const toastElement = document.getElementById("successToast");

    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);

    toast.show();
}


/* ==================== DISPLAY CART ==================== */

function displayCart() {

    const cartItems = document.getElementById("cartItems");
    const modalTotal = document.getElementById("modalTotal");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="text-center py-4">
                <p class="mb-0">Your order is empty.</p>
            </div>
        `;

        modalTotal.textContent = "0 MMK";

        return;
    }


    cart.forEach(function(item, index) {

        const row = document.createElement("div");

        row.className = "cart-row";

        row.innerHTML = `
            <div class="cart-row-info">
                <strong>${item.name}</strong>
                <span>${formatPrice(item.price)} each</span>
            </div>

            <div class="quantity-controls">

                <button
                    class="minus-btn"
                    data-index="${index}"
                >
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    class="plus-btn"
                    data-index="${index}"
                >
                    +
                </button>

                <button
                    class="remove-item"
                    data-index="${index}"
                    title="Remove item"
                >
                    <i class="bi bi-trash"></i>
                </button>

            </div>
        `;

        cartItems.appendChild(row);
    });


    modalTotal.textContent = formatPrice(getCartTotal());


    /* Quantity minus */

    document.querySelectorAll(".minus-btn").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            cart[index].quantity -= 1;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            displayCart();
            updateCartBar();
        });

    });


    /* Quantity plus */

    document.querySelectorAll(".plus-btn").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            cart[index].quantity += 1;

            displayCart();
            updateCartBar();
        });

    });


    /* Remove item */

    document.querySelectorAll(".remove-item").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            cart.splice(index, 1);

            displayCart();
            updateCartBar();
        });

    });

}


/* ==================== OPEN ORDER MODAL ==================== */

const viewOrderBtn = document.getElementById("viewOrderBtn");

viewOrderBtn.addEventListener("click", function() {

    displayCart();

    const modalElement = document.getElementById("orderModal");

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();

});


/* ==================== PLACE ORDER ==================== */

const placeOrderBtn = document.getElementById("placeOrderBtn");

placeOrderBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Please add something to your order first.");

        return;
    }


    const customerName =
        document.getElementById("customerName").value.trim();


    if (customerName === "") {

        alert("Please enter your name.");

        document.getElementById("customerName").focus();

        return;
    }


    const total = getCartTotal();


    alert(
        "Thank you, " +
        customerName +
        "!\n\n" +
        "Your order has been received.\n" +
        "Total: " +
        formatPrice(total) +
        "\n\n" +
        "This demo does not process real payments."
    );


    cart = [];

    updateCartBar();

    displayCart();

    document.getElementById("customerName").value = "";
    document.getElementById("orderNote").value = "";


    const modalElement = document.getElementById("orderModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.hide();

});


/* ==================== MENU FILTER ==================== */

const filterButtons = document.querySelectorAll(".filter-btn");

const menuItems = document.querySelectorAll(".menu-item");


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        const selectedCategory = button.dataset.filter;


        menuItems.forEach(function(item) {

            const itemCategory = item.dataset.category;


            if (
                selectedCategory === "all" ||
                selectedCategory === itemCategory
            ) {

                item.style.display = "block";

            } else {

                item.style.display = "none";

            }

        });

    });

});


/* ==================== CONTACT FORM ==================== */

const contactForm = document.getElementById("contactForm");


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const message =
        document.getElementById("message").value.trim();


    if (
        name === "" ||
        phone === "" ||
        email === "" ||
        message === ""
    ) {

        alert("Please complete all fields.");

        return;
    }


    /*
        This is a frontend demo.

        A real website would send this information
        to a backend/server here.
    */

    alert(
        "Thanks, " +
        name +
        "!\n\n" +
        "Your message has been submitted.\n" +
        "We will contact you at " +
        phone +
        "."
    );


    contactForm.reset();

});


/* ==================== NAVBAR ACTIVE LINK ==================== */

const navLinks = document.querySelectorAll(".nav-link");


navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        navLinks.forEach(function(navLink) {
            navLink.classList.remove("active");
        });

        link.classList.add("active");

    });

});


/* ==================== INITIAL CART STATE ==================== */

updateCartBar();
