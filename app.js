/* 🔹 GET RESTAURANT SLUG */
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || "barfmalai";

/* 🔹 API URL */
const API_URL =
"https://script.google.com/macros/s/AKfycby_7KW_sT6qOCsRtgpVTx_U32UsEUg4R3buCSuCjwaeeYZ9wIzGmL0I1EsK44eAsbAy/exec?slug="+slug;

/* 🔹 CART */
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

/* 🔹 DOM */
const menuLogo = document.getElementById("menuLogo");
const menuName = document.getElementById("menuName");
const categoriesDiv = document.getElementById("categories");
const productsDiv = document.getElementById("products");
const skeletonsDiv = document.getElementById("skeletons");

/* CART UI */
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");

/* ======================
SKELETON
====================== */

function showSkeletons(count=4){

skeletonsDiv.innerHTML="";

for(let i=0;i<count;i++){

const s=document.createElement("div");
s.className="skeleton-card";

s.innerHTML=`
<div class="skeleton-img"></div>
<div class="skeleton-lines">
<div class="skeleton-line"></div>
<div class="skeleton-line short"></div>
<div class="skeleton-line price"></div>
</div>
`;

skeletonsDiv.appendChild(s);

}

}

function hideSkeletons(){
skeletonsDiv.innerHTML="";
}

/* ======================
IMAGE LAZY LOAD
====================== */

const imgObserver = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){

const img=entry.target;

img.src=img.dataset.src;

img.onload=()=>img.classList.add("loaded");

img.onerror=()=>img.src="assets/placeholder.png";

imgObserver.unobserve(img);

}
});
},{threshold:0.2});


/* ======================
FETCH MENU
====================== */

showSkeletons(4);

fetch(API_URL)
.then(res=>res.json())
.then(data=>{

if(data.error==="MENU_OFF"){
window.location.href="menu-off.html?slug="+slug;
return;
}

initMenu(data);

})
.catch(()=>{
document.body.innerHTML="Menu load error";
});


/* ======================
INIT MENU
====================== */

function initMenu(data){

const r=data.restaurant;

menuLogo.src=r.logo_url;
menuName.innerText=r.name;

renderCategories(data.categories,data.products);

updateCartUI();

}


/* ======================
CATEGORIES
====================== */

function renderCategories(categories,products){

categoriesDiv.innerHTML="";

categories.forEach((cat,index)=>{

const el=document.createElement("div");

el.className="category"+(index===0?" active":"");

el.innerText=cat.name;

el.onclick=()=>{

document.querySelectorAll(".category")
.forEach(c=>c.classList.remove("active"));

el.classList.add("active");

renderProducts(cat.id,products);

};

categoriesDiv.appendChild(el);

});

renderProducts(categories[0].id,products);

}


/* ======================
PRODUCTS
====================== */

function renderProducts(categoryId,products){

productsDiv.style.opacity="0";

setTimeout(()=>{

productsDiv.innerHTML="";
hideSkeletons();

const filtered=products.filter(
p=>String(p.categoryId)===String(categoryId)
);

filtered.forEach(p=>{

const card=document.createElement("div");

card.className="product";

card.innerHTML=`

<img data-src="${p.image}" src="assets/placeholder.png">

<div class="product-info">

<h3>${p.name}</h3>

<p>${p.desc||""}</p>

<div class="product-bottom">

<div class="price">₹${p.price}</div>

<button class="add-btn">ADD</button>

</div>

</div>

`;

productsDiv.appendChild(card);

const img=card.querySelector("img");
imgObserver.observe(img);

const btn=card.querySelector(".add-btn");

btn.onclick=()=>{
addToCart(p,btn);
};

});

productsDiv.style.opacity="1";

},120);

}


/* ======================
CART
====================== */

function addToCart(product,btn){

const existing = cart.find(i=>i.id===product.id);

if(existing){

existing.qty++;

}else{

cart.push({
id:product.id,
name:product.name,
price:product.price,
qty:1
});

}

saveCart();

updateCartUI();

updateButton(product,btn);

}

function updateButton(product,btn){

const item = cart.find(i=>i.id===product.id);

if(!item){

btn.innerText="ADD";

return;

}

btn.innerText=item.qty;

}


function saveCart(){
localStorage.setItem("cart",JSON.stringify(cart));
}


function updateCartUI(){

const count=cart.reduce((a,b)=>a+b.qty,0);

cartCount.innerText=count;

if(count>0){
cartBar.style.display="flex";
}else{
cartBar.style.display="none";
}

}


/* ======================
OPEN CHECKOUT
====================== */

cartBar.onclick=()=>{

localStorage.setItem("cart",JSON.stringify(cart));

window.location.href="checkout.html?slug="+slug;

};


/* ======================
BANNER SLIDER
====================== */

document.addEventListener("DOMContentLoaded",()=>{

const imgs=document.querySelectorAll(".banner-img");

if(imgs.length>1){

let i=0;

setInterval(()=>{

imgs[i].classList.remove("active");

i=(i+1)%imgs.length;

imgs[i].classList.add("active");

},3000);

}

});

