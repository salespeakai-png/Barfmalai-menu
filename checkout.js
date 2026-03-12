const params = new URLSearchParams(window.location.search);

const slug = params.get("slug") || "barfmalai";

const API_URL =
"https://script.google.com/macros/s/AKfycby_7KW_sT6qOCsRtgpVTx_U32UsEUg4R3buCSuCjwaeeYZ9wIzGmL0I1EsK44eAsbAy/exec";

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const itemsDiv = document.getElementById("orderItems");

const totalDiv = document.getElementById("orderTotal");


function renderItems(){

let total = 0;

itemsDiv.innerHTML = "";

cart.forEach(i=>{

const row = document.createElement("div");

row.innerText = i.name+" × "+i.qty+" = ₹"+(i.qty*i.price);

itemsDiv.appendChild(row);

total += i.qty*i.price;

});

totalDiv.innerText = "Total ₹"+total;

}

renderItems();


document.getElementById("placeOrderBtn").onclick = ()=>{

const order = {

name:document.getElementById("custName").value,

phone:document.getElementById("custPhone").value,

address:document.getElementById("custAddress").value,

delivery:document.getElementById("deliveryDate").value,

items:cart,

total:cart.reduce((a,b)=>a+b.qty*b.price,0)

};

fetch(API_URL,{

method:"POST",

body:JSON.stringify(order)

})
.then(res=>res.json())

.then(d=>{

alert("Order Placed");

localStorage.removeItem("cart");

window.location.href="menu.html?slug="+slug;

});

};
