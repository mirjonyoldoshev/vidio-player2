const apiUrl =
  "https://6662ac4162966e20ef097175.mockapi.io/api/products/products";

document.addEventListener("DOMContentLoaded", () => {
  const addProductBtn = document.getElementById("addProductBtn");
  const productFormPopup = document.getElementById("productFormPopup");
  const productForm = document.getElementById("productForm");
  const closePopupBtn = document.getElementById("closePopupBtn");
  const productContainer = document.getElementById("productContainer");

  let isUpdate = false;
  let updateId = null;

  addProductBtn.addEventListener("click", () => {
    isUpdate = false;
    updateId = null;
    productForm.reset();
    document.getElementById("formTitle").textContent = "Add Product";
    productFormPopup.style.display = "block";
  });

  closePopupBtn.addEventListener("click", () => {
    productFormPopup.style.display = "none";
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const image = document.getElementById("productImage").value;
    const description = document.getElementById("productDescription").value;

    const product = { name, image, description };

    if (isUpdate) {
      await updateProduct(updateId, product);
    } else {
      await addProduct(product);
    }

    productFormPopup.style.display = "none";
    loadProducts();
  });

  async function loadProducts() {
    const response = await fetch(apiUrl);
    const products = await response.json();
    productContainer.innerHTML = "";

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <button onclick="editProduct('${product.id}')">Edit</button>
            `;
      productContainer.appendChild(productCard);
    });
  }

  window.editProduct = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    const product = await response.json();

    document.getElementById("productName").value = product.name;
    document.getElementById("productImage").value = product.image;
    document.getElementById("productDescription").value = product.description;

    isUpdate = true;
    updateId = id;
    document.getElementById("formTitle").textContent = "Update Product";
    productFormPopup.style.display = "block";
  };

  async function addProduct(product) {
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  }

  async function updateProduct(id, product) {
    await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  }

  loadProducts();
});
