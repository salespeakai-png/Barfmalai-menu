const params = new URLSearchParams(window.location.search);

const slug = params.get("slug") || "barfmalai";

const API_URL =
"https://script.google.com/macros/s/AKfycbw-WnpgvD-H8MoMWX4yc-bLf7cCAmScErE7nJD59x2T8pmbxtvDEjPGICzjWT0zCrEH/exec";

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

const name=document.getElementById("custName").value.trim();
const phone=document.getElementById("custPhone").value.trim();
const address=document.getElementById("custAddress").value.trim();
const delivery=document.getElementById("deliveryDate").value;

if(!name || !phone || !address || !delivery){

alert("Please fill all details");

return;

}

if(phone.length<10){

alert("Enter valid mobile number");

return;

}

const order={

name:name,
phone:phone,
address:address,
delivery:delivery,
items:cart,
total:cart.reduce((a,b)=>a+b.qty*b.price,0)

};

fetch(API_URL,{

method:"POST",

body:JSON.stringify(order)

})
.then(res=>res.json())
.then(d=>{

alert("Order Placed Successfully");

localStorage.removeItem("cart");

window.location.href="menu.html?slug="+slug;

});

};
