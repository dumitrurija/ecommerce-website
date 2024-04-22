fetch('../data.json')
  .then(response => response.json())
  .then(data => {
    registerData(data)
    buyNow(data)
    cartCount()
  })
  .catch(error => {
    console.error('Eroare la JSON:', error);
  });


// adauga continut paginii
function registerData(data) {
  const img = document.querySelector(".product-view-img img")
  const name = document.querySelector(".product-view-description #name")
  const brand = document.querySelector(".product-view-description #brand")
  const price = document.querySelector(".product-view-description #price")
  const breadcrumbsModel = document.querySelector("#breadcrumbs-model-selected")

  const selectedProductPage = JSON.parse(localStorage.getItem("selected-product-to-productpage")) || []

  breadcrumbsModel.textContent = selectedProductPage.name
  document.title = `Store | ${selectedProductPage.name}`
  img.src = selectedProductPage.img
  name.textContent = selectedProductPage.name
  brand.textContent = selectedProductPage.brand
  price.textContent = `$${selectedProductPage.price}`

}

function buyNow(data) {
    // === ADD TO CART ===
    const buyNowBtn = document.querySelector("#buy-now")
    const selectedProductPage = JSON.parse(localStorage.getItem("selected-product-to-productpage")) || []
    const selectedProductCart = JSON.parse(localStorage.getItem("selected-product-to-cart")) || []

    console.log(selectedProductCart);

    buyNowBtn.addEventListener("click", () => {
      let selectedProduct = {
        img: selectedProductPage.img,
        name: selectedProductPage.name,
        brand: selectedProductPage.brand,
        price: selectedProductPage.price
      }

      selectedProductCart.push(selectedProduct)

      localStorage.setItem("selected-product-to-cart", JSON.stringify(selectedProductCart));
  
      window.location.href = "../cart-page/cart.html";
    })
}

// arata cate elemente sunt in cart
function cartCount() {
  const cartCount = document.querySelector("#cart-count")
  const selectedProducts = JSON.parse(localStorage.getItem("selected-product-to-cart")) || []

  cartCount.textContent = selectedProducts.length
}