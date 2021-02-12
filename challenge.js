(function () {
  const productForm = document.querySelector(".product__form");
  const productFormTop = productForm.offsetTop;
  let isSticky = false;

  /**
   * @description add progress bar on cart
   */
  const handleProgressBar = async () => {
    const cartBanner = await getElementAndHandlePromise(".cart__banner");
    if (!cartBanner) {
      return null;
    }
    cartBanner.insertAdjacentHTML("afterend", `<div class="progress__bar">
      <h2>Build Your Kit & Save</h2>
      <h3>Spend $200, Save $30</h2>
      <ul class="progress__display">
        <li><div></div></li>
        <li><div></div></li>
        <li><div></div></li>
        <li><div></div></li>
      </ul>
      <ul class="progress__save">
        <li>$15% off</li>
        <li>$20% off</li>
        <li>$30% off</li>
        <li>$50% off</li>
      </ul>
    </div>`);
    handleProgressDisplay();
  }

  /**
   * @description The progress bar logic show the progress
   */
  const handleProgressDisplay = async () => {
    const totalPrice = cartManager.getCart().totalPrice;
    const fillProgress = await getElementAndHandlePromise(".progress__display li div", true);
    if (!fillProgress) {
      return null;
    }
    let percentLimit = [100, 150, 200, 300];
    fillProgress.forEach((fillDiv, key) => {
      let fillPercent = 0;
      const previousLimit = percentLimit[key -1] ? percentLimit[key -1] : 0
      if (totalPrice > previousLimit) {
        fillPercent = (totalPrice > percentLimit[key]) ? 100 : ((totalPrice - previousLimit) * 100 / (percentLimit[key] - previousLimit));
      }
      fillDiv.style.width = `${parseInt(fillPercent)}%`;
    })
  }

  /**
   * @description add event to toggle sizes button
   */
  const handleBtnShowSizes = () => {
    const btnSize = document.querySelector(".variant-selector__options-toggle");
    btnSize.onclick = () => handleHideSizes();
  }

  /**
   * @description When the sticky mode is active, the size swatches shown should be visible multiple of 4
   */
  const handleHideSizes = () => {
    const listElements = productForm.querySelectorAll('li');
    let refSize = 0;
    listElements.forEach((liElement) => {
      const toNumber = Number(liElement.innerHTML.trim());
      if (!isNaN(toNumber)) {
        if(refSize === 0) {
          refSize = toNumber;
        } else if (toNumber === refSize + 2) {
          refSize = 0;
          liElement.style.display = "none";
        }
      }
    })
  }

  /*
  * @desc A promise that waits a maximum of 5sec in case the element is created
  */
  const getElementAndHandlePromise = (elementString, ifAll = false) => new Promise((resolve, reject) => {
    const getElementAndHandle = (times = 0) => {
      const element = ifAll ? document.querySelectorAll(elementString) : document.querySelector(elementString);
      if (!element && times < 10) {
        setTimeout(() => getElementAndHandle(times + 1), 500);
      } else if (element) {
        resolve(element);
      } else {
        console.log('Error could not find element');
        reject(null);
      }
    }
    getElementAndHandle();
  })

  /**
   * @description Add and remove styles when toggling sticky
   */
  const handleStickyChange = (isSticky) => {
    const colorWrapper = document.querySelector(".product__form .variant-selector__status");
    if (isSticky) {
      colorWrapper.classList.add("hidden");
      productForm.classList.add("sticky");
    } else {
      colorWrapper.classList.remove("hidden");
      productForm.classList.remove("sticky");
    }
  }

  /**
   * @description Toggle sticky on scroll 
   */
  window.addEventListener("scroll", function(event) {
    const scrollY = this.scrollY;
    const stickyChange = (scrollY > productFormTop);
    if (stickyChange !== isSticky) {
      isSticky = stickyChange;
      handleStickyChange(isSticky);
      handleBtnShowSizes(isSticky);
    }
  });

  /**
   * @description add event to "add to bag" button 
   */
  (function () {
    const allBtnsAddToBag = document.querySelectorAll(".variant-selector__submit");
    allBtnsAddToBag.forEach((btnAddToBag) => {
      btnAddToBag.onclick = function() {
        productForm.classList.remove("sticky");
        handleProgressBar();
        isSticky = false;
      }
    })
  })();

  /**
   * @description add styles
   */
  document.head.insertAdjacentHTML("beforeend", `<style>
    .hidden{
      visibility: hidden;
    }
    .progress__bar{
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      padding: 10px 0;
    }
    .progress__bar h2{
      font-family: 'Circular Std';
      font-size: 15px;
      font-style: normal;
      font-weight: bold;
      line-height: 22px;
      letter-spacing: 0.3px;
      text-align: center;
    }
    .progress__bar h3{
      font-family: 'Circular Std';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0.3px;
      text-align: center;
    }
    .progress__display {
      list-style: none;
      display: flex;
      margin: 10px 20px 0px 20px;
    }
    .progress__display li{
      margin-right: 2px;
      background-color: #FBDAD0;
      height: 6px;
      width: 100%;
    }
    .progress__display li:last{
      margin-right: 0;
    }
    .progress__save{
      list-style: none;
      display: flex;
      margin: 5px 20px 20px 40px;
    }
    .progress__save li{
      font-family: Circular Std;
      font-style: normal;
      font-weight: normal;
      font-size: 11px;
      line-height: 14px;
      text-align: right;
      letter-spacing: 0.3px;
      width: 100%;
    }
    .progress__display li div{
      width: 0;
      height: 100%;
      background-color: #E7A08D;
    }
    section.cart {
      grid-template-rows: auto auto auto 1fr;
    }
    @media(max-width: 768px){
      .product__form.sticky{
        position: sticky;
        top: 50px;
        left: 0;
        background-color: #fff;
        z-index: 999999999;
      }
    }
  </style>`)
})();



