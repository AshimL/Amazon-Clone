import {  getProduct } from "../data/products.js";
import { getOrder, orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';



async function loadTrackingPage() {

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  if (!order) {
    console.error('Order not found!');
    return;
  }


  let productsHTML = '';

  function products () {
    

  order.products.forEach((details) => {
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(details.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  const deliveredMessage = today < deliveryTime ? 'Arriving on' : 'Delivered on';

    const product = getProduct(details.productId);
    if (!product) {
      console.error('Product not found for ID:', details.productId);
      return;
    }

    productsHTML += `

        <div class="delivery-date">
           ${deliveredMessage} ${dayjs(details.estimatedDeliveryTime).format('dddd, MMMM D')}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${details.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${
             percentProgress < 50 ? 'current-status' : ''
          }">
            Preparing
          </div>
          <div class="progress-label ${
            percentProgress >= 50 && percentProgress < 100? 'current-status' : ''
          }">
            Shipped
          </div>
          <div class="progress-label ${
            percentProgress >= 100 ? 'current-status' : ''
          }">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentProgress}%;">
          </div>
        </div>
     
    `;
  });

  return productsHTML;
}

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    ${products()}
  `;
  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

loadTrackingPage();



