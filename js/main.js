const URL = "./db/perifericos.json";
let perifericos = [];
let weeklyPerifericos = [];

function getPerifericos() {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      perifericos = data;
      weeklyPerifericos = data.filter((periferico) => periferico.is_weekly);
      renderWeeklyPerifericos(weeklyPerifericos);
    })
    .catch((error) => {
      showErrorAlert("Surgio un error al cargar los perifericos: " + error);
    });
}

getPerifericos();

let carouselPerifericos = document.getElementById("carousel-inner");

function renderWeeklyPerifericos(perifericos) {
  perifericos.forEach((periferico, index) => {
    let perifericoItem = document.createElement("div");
    perifericoItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

    perifericoItem.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-sm-8 col-md-6 col-lg-4">
        <div class="card h-100 shadow">
          <img src="../assets/img/${periferico.image}" class="card-img mt-4" alt="${periferico.name} Picture"/>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${periferico.name}</h5>
            <p class="card-text mb-1">Marca: <strong>${periferico.marca}</strong></p>
            <p class="card-text mb-3 text-success card-price">Precio: <strong>$${periferico.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></p>
            
            <div class="counter d-flex mb-3">
              <button class="btn btn-outline-secondary me-2 card-minus-btn">−</button>
              <input type="number" class="form-control text-center quantity" value="1" min="1" readonly style="max-width: 80px"/>
              <button class="btn btn-outline-secondary ms-2 card-plus-btn">+</button>
              <button class="btn btn-secondary ms-2 card-refresh-btn"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
            <button class="btn card-add-btn btn-primary mt-auto" id="${periferico.id}">Añadir al carrito</button>
          </div>
        </div>
      </div>
    </div>`;

    carouselPerifericos.appendChild(perifericoItem);
    addPerifericoEvent(perifericoItem);
  });
}

renderWeeklyPerifericos(weeklyPerifericos);

function addPerifericoEvent(perifericoElement) {
  let plusBtn = perifericoElement.querySelector(".card-plus-btn");
  let minusBtn = perifericoElement.querySelector(".card-minus-btn");
  let quantityInput = perifericoElement.querySelector(".quantity");
  let refreshBtn = perifericoElement.querySelector(".card-refresh-btn");
  let addPerifericoBtn = perifericoElement.querySelector(".card-add-btn");

  plusBtn.onclick = () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  };

  minusBtn.onclick = () => {
    if (parseInt(quantityInput.value) > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  };

  refreshBtn.onclick = () => {
    quantityInput.value = 1;
  };

  addPerifericoBtn.onclick = (e) => {
    let perifericoId = e.currentTarget.id;
    console.log(`Añadiendo periférico con ID: ${perifericoId} al carrito`);

    const selectedPeriferico = weeklyPerifericos.find((p) => p.id === parseInt(perifericoId));

    if (selectedPeriferico) {
      const quantity = parseInt(quantityInput.value);
      addPerifericoToShoppingCart(selectedPeriferico, quantity);
      console.log(`Periférico añadido: ${selectedPeriferico.name}, Cantidad: ${quantity}`);
    } else {
      console.error(`Periférico con ID: ${perifericoId} no encontrado`);
    }
  };
}

function addPerifericoToShoppingCart(perifericoObject, quantity) {
  try {
    let currentCarrito = localStorage.getItem("carrito");
    currentCarrito = JSON.parse(currentCarrito);

    if (!currentCarrito) {
      currentCarrito = [];
      currentCarrito.push(buildPerifericoItem(perifericoObject, quantity));
    } else {
      const existingIndex = currentCarrito.findIndex(
        (item) => item.id === perifericoObject.id
      );
      if (existingIndex !== -1) {
        currentCarrito[existingIndex].quantity += quantity;
      } else {
        currentCarrito.push(buildPerifericoItem(perifericoObject, quantity));
      }
    }

    localStorage.setItem("carrito", JSON.stringify(currentCarrito));
    console.log("Carrito de compras actualizado:", currentCarrito);

    Toastify({
      text: `Se añadió ${quantity} periférico(s) al carrito`,
      duration: 1200,
      close: false,
      stopOnFocus: false,
      style: { background: "green" },
      onClick: function () {
        this.hideToast();
      },
    }).showToast();
  } catch {
    showErrorAlert("Surgio un error al añadir al carrito");
  }
}

function buildPerifericoItem(periferico, quantity) {
  return {
    id: periferico.id,
    name: periferico.name,
    image: periferico.image,
    price: periferico.price,
    quantity: quantity
  };
}

function showErrorAlert(message) {
  Swal.fire({
    title: "Error",
    text: message,
    icon: "error",
  });
}