const menuBtn=document.querySelector(".menu-btn");
const nav=document.querySelector(".nav-links");
menuBtn?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",open);
});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
