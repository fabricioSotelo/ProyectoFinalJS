let carrito = localStorage.getItem("carrito");

try {
    carrito = JSON.parse(carrito);
}
catch (error) {
    showErrorAlert("Surgio un error al cargar el carrito de compras: " + error.message);
}

function renderCarrito() {
    let carritoBody = document.getElementById("carrito-body");
    let totalPrice = document.getElementById("total-price");
    let checkoutButton = document.getElementById("checkout-btn");
    
    if (!carrito || carrito.length === 0) {
        document.getElementById("empty-perifericos-message").style.display = "block";
        checkoutButton.disabled = true;
    }

    let total = 0;
    carritoBody.innerHTML = ""; 
    carrito.forEach((perifericoItem) => {
        const subTotal = perifericoItem.price * perifericoItem.quantity;
        total += subTotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="../assets/img/${perifericoItem.image}" alt="${perifericoItem.name}" style="max-width: 70px;"/></td>
            <td>${perifericoItem.name}</td>
            <td>$${perifericoItem.price.toFixed(2)}</td>
            <td>
                <input type="number" class="form-control quantity-input text-center" id="${perifericoItem.id}" value="${perifericoItem.quantity}" min="1" style="width: 80px; margin: auto;">
            </td>
            <td>$${subTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-btn" id="${perifericoItem.id}">Eliminar</button>
            </td>
        `;

        carritoBody.appendChild(row);
        addEventsItem(row);
    });

    totalPrice.textContent = total.toFixed(2);
}

renderCarrito();

function addEventsItem(carritoItem) {
    let changeQuantityInput = carritoItem.querySelector(".quantity-input");
    let deleteButton = carritoItem.querySelector(".delete-btn");

    changeQuantityInput.onchange = (e) => {
        let perifericoId = parseInt(e.target.id);
        let newQuantity = parseInt(e.target.value);
        
        if (newQuantity < 1 || isNaN(newQuantity)) {
            newQuantity = 1;
        }
        
        carrito[getPerifericoIndex(perifericoId)].quantity = newQuantity;
        updateCarrito();
    }

    changeQuantityInput.onkeydown = (e) => {
        if(["e", "E", "+", "-", ".", ","].includes(e.key)) {
            e.preventDefault();
        }
    }

    deleteButton.onclick = (e) => {
      let perifericoId = parseInt(e.target.id);
      carrito.splice(getPerifericoIndex(perifericoId), 1);
      updateCarrito();

      const toast = Toastify({
        text: `Se eliminó ${perifericoItem.name} del carrito`,
        duration: 1200,
        close: false,
        stopOnFocus: false,
        style: {
          background: "red",
        },
        onClick: function () {
          toast.hideToast();
        },
      }).showToast();
    };
}

function getPerifericoIndex(perifericoId) {
    return carrito.findIndex((item) => item.id === perifericoId);
}

function updateCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}

function showErrorAlert(message) {
  Swal.fire({
    title: "Error",
    text: message,
    icon: "error",
  });
}

function showDeletePerifericosAlert() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Quieres vaciar el carrito de compras?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteCarrito();
    }
  });
}

function deleteCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
  Swal.fire("Carrito vaciado", "", "success");
}

let deletePerifericoButton = document.getElementById("delete-carrito");

deletePerifericoButton.onclick = () => {
    showDeletePerifericosAlert();
}

function checkout() {
  if (carrito.length === 0) {
    showErrorAlert("El carrito está vacío. Agrega productos antes de proceder.");
    return;
  }

  Swal.fire({
        title: "Confirmación de Compra",
        text: "¿Estás seguro de que deseas proceder con la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, proceder",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "checkout.html";
        }
    });
}

let checkoutButton = document.getElementById("checkout-btn");
checkoutButton.onclick = () => {
    checkout();
}