fetch('../data.json')
  .then(response => response.json())
  .then(data => {
    addProductsToCatalog(data)
    searchProducts()
    filterByBrandName(data)
    totalProducts(data)
    priceRange(data)
    filterElsAppearance()
    addProductToProductPage(data)
    addProductsToCart(data)
    cartCount()
  })
  .catch(error => {
    console.error('Eroare la JSON:', error);
  });

// create catalog products
function addProductsToCatalog(data) {
  const catalogProducts = document.querySelector(".catalog-products");
  const paginationContainer = document.querySelector(".pagination");

  const productsPerPage = 6;
  const totalPages = Math.ceil(data.length / productsPerPage);

  for (let i = 0; i < data.length; i++) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    catalogProducts.appendChild(productDiv);

    const img = document.createElement("img");
    img.setAttribute("src", data[i].img);
    productDiv.appendChild(img);

    const productTitleDiv = document.createElement("div");
    productTitleDiv.classList.add("product-title");
    productDiv.appendChild(productTitleDiv);

    const brandName = document.createElement("h3");
    productTitleDiv.appendChild(brandName);
    brandName.textContent = data[i].name;
    brandName.classList.add("product-name");

    const brandPrice = document.createElement("h3");
    productTitleDiv.appendChild(brandPrice);
    brandPrice.textContent = `$${data[i].price}`;

    const brandBrand = document.createElement("p");
    productDiv.appendChild(brandBrand);
    brandBrand.textContent = data[i].brand;

    const addToCartBtn = document.createElement("i");
    addToCartBtn.classList.add("fa-solid");
    addToCartBtn.classList.add("fa-cart-plus");
    productDiv.appendChild(addToCartBtn);

    if ((i + 1) % productsPerPage === 0 || i === data.length - 1) {
      const pageNumber = Math.ceil((i + 1) / productsPerPage);
      const paginationBtn = document.createElement("button");
      paginationBtn.textContent = pageNumber;
      paginationBtn.addEventListener("click", function () {
        showPage(pageNumber);
      });
      paginationContainer.appendChild(paginationBtn);
    }
  }

  function showPage(pageNumber) {
    const products = document.querySelectorAll(".product");
    const startIndex = (pageNumber - 1) * productsPerPage;
    const endIndex = pageNumber * productsPerPage;

    products.forEach((product, index) => {
      if (index >= startIndex && index < endIndex) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  }

  showPage(1);
}

// search products from header
function searchProducts() {
  const searchProduct = document.querySelector("#search-product");
  const productsTitle = document.querySelectorAll(".product-name");
  const products = document.querySelectorAll(".product");

  searchProduct.addEventListener("input", () => {
    let lowercaseSearch = searchProduct.value.toLowerCase().trim();

    productsTitle.forEach((title, index) => {
      let lowercaseTitle = title.textContent.toLowerCase().trim();

      if (lowercaseTitle.includes(lowercaseSearch)) {
        products[index].style.display = "block";
      } else {
        products[index].style.display = "none";
      }
    });
  });
}

// filter by brand name by checkbox
function filterByBrandName(data) {
  const filterBrandsCheckbox = document.querySelectorAll("#filter-by-brand input[type=checkbox]")
  const products = document.querySelectorAll(".product")

  filterBrandsCheckbox.forEach((filterBrand) => {
    filterBrand.addEventListener("click", () => {
      const selectedBrands = Array.from(filterBrandsCheckbox).filter(checkbox => checkbox.checked).map(checkbox => checkbox.id.toLowerCase())

      if (selectedBrands.length > 0) {
        products.forEach((product, productIndex) => {
          const productBrand = data[productIndex].brand.toLowerCase()
          if (selectedBrands.includes(productBrand)) {
            product.style.display = "block"
          } else {
            product.style.display = "none"
          }
        })
      } else {
        products.forEach((product) => {
          product.style.display = "block"
        })
      }
    })
  })
}

// showing how many products in page (showing 1 - `data.length` products)
function totalProducts(data) {
  const productsTotal = document.querySelector(".showing-product p")

  productsTotal.textContent = `Showing 1 - ${data.length} Products`
}

// min & max price criteria range
function priceRange(data) {
  const priceInputs = document.querySelectorAll(".filter-price input")
  const products = document.querySelectorAll(".product")

  document.querySelector(".filter-price button").addEventListener("click", () => {
    let minPrice = priceInputs[0].value || 0
    let maxPrice = priceInputs[1].value || Infinity

    for (let i = 0; i < data.length; i++) {
      if (data[i].price >= minPrice && data[i].price <= maxPrice) {
        products[i].style.display = "block"
      } else {
        products[i].style.display = "none"
      }
    }
  })
}

// filter hide/show elements
function filterElsAppearance() {
  const chevrons = document.querySelectorAll(".filter-title i");
  const filterToggle = document.querySelectorAll(".filter-toggle");

  let isOpen = [true, true];

  chevrons.forEach((chevron, chevronIndex) => {
    chevron.style.cursor = "pointer";

    chevron.addEventListener("click", () => {
      if (isOpen[chevronIndex]) {
        chevron.classList.add("fa-chevron-down");
        chevron.classList.remove("fa-chevron-up");

        filterToggle[chevronIndex].style.display = "none";
        isOpen[chevronIndex] = false;
      } else {
        chevron.classList.remove("fa-chevron-down");
        chevron.classList.add("fa-chevron-up");

        filterToggle[chevronIndex].style.display = "block";
        isOpen[chevronIndex] = true;
      }
    });
  });
}

//  ========== SORT ============
document.getElementById("sort-products-order").addEventListener("change", function(event) {
  const selectedOption = event.target.value;
  
  if (selectedOption === "ascending") {
    orderByNameAscending();
  } else if (selectedOption === "descending") {
    orderByNameDescending();
  } else {
    location.reload()
  }
});

// sorteaza ascending
function orderByNameAscending() {
  const productNames = document.querySelectorAll(".product-name");
  const productsContainer = document.querySelector(".catalog-products");

  let productsArray = [];
  productNames.forEach((productName, index) => {
    productsArray.push({
      name: productName.textContent,
      element: productName.closest(".product")
    });
  });

  productsArray.sort((a, b) => a.name.localeCompare(b.name));

  productsContainer.innerHTML = "";

  productsArray.forEach(product => {
    productsContainer.appendChild(product.element);
  });
}

// sorteaza descending
function orderByNameDescending() {
  const productNames = document.querySelectorAll(".product-name");
  const productsContainer = document.querySelector(".catalog-products");

  let productsArray = [];
  productNames.forEach((productName, index) => {
    productsArray.push({
      name: productName.textContent,
      element: productName.closest(".product")
    });
  });

  productsArray.sort((a, b) => b.name.localeCompare(a.name));

  productsContainer.innerHTML = "";

  productsArray.forEach(product => {
    productsContainer.appendChild(product.element);
  });
}

// ========= LOCAL STORAGE =========
// seteaza localStorage productul si il duce la product-view.html
function addProductToProductPage(data) {
  const products = document.querySelectorAll(".product")
  const productImgs = document.querySelectorAll(".product img")

  products.forEach((product, index) => {
    product.addEventListener("click", () => {
      let selectedProductPage = {
        img: data[index].img,
        name: data[index].name,
        brand: data[index].brand,
        price: data[index].price
      }

      localStorage.setItem("selected-product-to-productpage", JSON.stringify(selectedProductPage))
    })
  })

  productImgs.forEach((productImg) => {
    productImg.addEventListener("click", () => {
      window.location.href = "../product-page/product-view.html"
    })
  })
}

// adauga produsele in localStorage si cart
function addProductsToCart(data) {
  const addToCartIcons = document.querySelectorAll(".fa-cart-plus")
  const productImgs = document.querySelectorAll(".product img")

  let selectedProductToCart = JSON.parse(localStorage.getItem("selected-product-to-cart")) || [];

  addToCartIcons.forEach((addToCartIcon, productIndex) => {
    addToCartIcon.addEventListener("click", () => {
      let selectedProduct = {
        img: data[productIndex].img,
        name: data[productIndex].name,
        brand: data[productIndex].brand,
        price: data[productIndex].price
      }

      selectedProductToCart.push(selectedProduct)

      localStorage.setItem("selected-product-to-cart", JSON.stringify(selectedProductToCart))
      
      cartCount()
    })
  })

}

// arata cate elemente sunt in cart
function cartCount() {
  const cartCount = document.querySelector("#cart-count")
  const selectedProducts = JSON.parse(localStorage.getItem("selected-product-to-cart")) || []

  cartCount.textContent = selectedProducts.length
}