fetch('../data.json')
  .then(response => response.json())
  .then(data => {
    addProductFromCartPage(data)
    removeProductFromCart(data)
    calculatePrice(data)
    cartCount()
    pressCheckout()
  })
  .catch(error => {
    console.error('Eroare la JSON:', error);
  });


// creaza si adauga producturile din cart
function addProductFromCartPage(data) {
  const totalProducts = document.querySelector(".total-products")
  const selectedProductsCart = JSON.parse(localStorage.getItem("selected-product-to-cart"));

  for (let i = 0; i < selectedProductsCart.length; i++) {
    const totalProductDiv = document.createElement("div")
    totalProductDiv.classList.add("total-product")
    totalProducts.appendChild(totalProductDiv)

    const img = document.createElement("img")
    img.src = `../imgs/${selectedProductsCart[i].img}`

    const div = document.createElement("div")

    const groupImgDesc = document.createElement("div")
    groupImgDesc.classList.add("group-img-desc")
    groupImgDesc.appendChild(img)
    groupImgDesc.appendChild(div)
    totalProductDiv.appendChild(groupImgDesc)

    const title = document.createElement("h2")
    title.textContent = selectedProductsCart[i].name
    div.appendChild(title)

    const brand = document.createElement("small")
    brand.textContent = selectedProductsCart[i].brand
    div.appendChild(brand)
    
    const price = document.createElement("h2")
    price.textContent = `$${selectedProductsCart[i].price}`
    div.appendChild(price)

    const trashLogo = document.createElement("i")
    trashLogo.classList.add("fa-solid")
    trashLogo.classList.add("fa-trash")
    totalProductDiv.appendChild(trashLogo)
  }
}

// scoate producturile cu ajutorul trash icon
function removeProductFromCart(data) {
  const removeIcons = document.querySelectorAll(".fa-trash")

  removeIcons.forEach((removeIcon) => {
    removeIcon.addEventListener("click", () => {
      const productId = removeIcon.parentElement.dataset.productId

      let selectedProductToCart = JSON.parse(localStorage.getItem("selected-product-to-cart")) || []

      const index = selectedProductToCart.findIndex(product => product.id === productId)

      removeIcon.parentElement.remove()

      const removedProduct = selectedProductToCart.splice(index, 1)[0]

      localStorage.setItem("selected-product-to-cart", JSON.stringify(selectedProductToCart))

      calculatePrice()
      cartCount()
    })
  })
}

// calculeaza pretul final
function calculatePrice() {
  const totalPriceDOM = document.querySelector("#total-price")
  const taxPriceDOM = document.querySelector("#tax-price")
  const priceAfterTaxDOM = document.querySelector("#price-after-tax")

  let totalPrice = 0
  let taxPrice = 25
  let priceAfterTax = 0

  const selectedProductToCart = JSON.parse(localStorage.getItem("selected-product-to-cart")) || []

  for (let i = 0; i < selectedProductToCart.length; i++) {
    totalPrice += selectedProductToCart[i].price
  }
  totalPriceDOM.textContent = `$${totalPrice}`

  taxPriceDOM.textContent = `$${taxPrice}`

  priceAfterTaxDOM.textContent = `$${totalPrice + taxPrice}`
}

// arata cate elemente sunt in cart
function cartCount() {
  const cartCount = document.querySelector("#cart-count")
  const selectedProducts = JSON.parse(localStorage.getItem("selected-product-to-cart")) || []

  cartCount.textContent = selectedProducts.length
}

// cand apasa checkout button
function pressCheckout() {
  const checkoutBtn = document.querySelector("#checkout-btn")

  checkoutBtn.addEventListener("click", () => {
    localStorage.removeItem("selected-product-to-cart");
    document.body.style.cssText = "height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 25px;"
    document.body.innerHTML = `
      <div class="successful">
        <h1>Comanda a fost plasata cu success.</h1>
      </div>
    `

    setTimeout(() => {
      location.reload()
    }, 5000)
  })
}