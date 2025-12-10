lucide.createIcons();
// 虚拟光标跟随逻辑
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor(){
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px,${cursorY}px) translate(-50%,-50%)`;

    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    cursorDot.style.transform = `translate(${dotX}px,${dotY}px) translate(-50%,-50%)`;

    requestAnimationFrame(animateCursor);
}

animateCursor();


// 鼠标悬停在hoverable元素上时改变样式
document.addEventListener('mouseover', (e) => {
    const target= e.target.closest('.hoverable');

    if(target){
        document.body.classList.add('hovering');

        const type = target.getAttribute('data-cursor');

        if(type === 'text'){
            cursor.style.width = '80px';
            cursor.style.height = '80px';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.border = '1px dashed #ccff00';
        }
    }
});

// 鼠标离开hoverable元素时恢复默认样式
document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('.hoverable');

    if(target){
        document.body.classList.remove('hovering');

        cursor.style.backgroundColor = '';
        cursor.style.width = '';
        cursor.style.height = '';
        cursor.style.border = '';
        cursor.style.mixBlendMode = '';
        cursor.style.opacity = '';
        cursor.innerHTML = '';
    }
});

// GSAP标题浮出动画效果
gsap.registerPlugin(ScrollTrigger);

// 画廊内容生成
const galleryData =[
    { title:"test1", artist:"one", url:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/sunOff.jpg"},
    { title:"test2", artist:"two", url:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/buildingAndsunOff.jpg"},
    { title:"test3", artist:"4", url:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/blueSky.jpg"},
    { title:"test4", artist:"5", url:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/seapone.jpg"},
    { title:"test5", artist:"6", url:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/whiteGlass.jpg"},
    { title:"test6", artist:"7", url:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/animial.jpg"},
    { title:"test7", artist:"8", url:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/hakimi.jpg"}
];

const grid =document.getElementById('gallery-grid');

galleryData.forEach(item =>{
    const div = document.createElement('div');
    div.className = 'gallery-item hoverable';
    div.setAttribute('data-cursor','view');

    div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" class="gallery-img" loading="lazy">
        <div class="item-overlay z-20">
            <span class="text-black font-bold text-2xl uppercase tracking-widest">${item.title}</span>
            <span class="text-black text-xs uppercase tracking-widest mt-2">by ${item.artist}</span>
        </div>
        `;
    
    div.addEventListener('click',()=> openModal(item));

    grid.appendChild(div);
});

// 生成卡片
// ./res/hakwan.png
const artistData =[
    { name:"Alice", style:"testAlice",img:"https://images.unsplash.com/photo-1764593008232-496797f6b31d?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name:"Jack One", style:"",img:"https://images.unsplash.com/photo-1764272579128-cae360f74b58?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name:"Alice", style:"",img:"https://images.unsplash.com/photo-1764173039192-2bbd508d5211?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name:"Alice", style:"",img:"https://images.unsplash.com/photo-1762770640764-bfb05d380670?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

const artistGrid = document.getElementById('artist-grid');

artistData.forEach((artist,index)=>{
    const card = document.createElement('div');

    card.className = 'artist-card p-4 hoverable group opacity-0 translate-y-20';
    card.setAttribute('data-cursor','view');

    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${artist.img}" alt="${artist.name}" class="artist-img">
        </div>
        <div class="artist-info mt-4 pt-4 flex justify-between items-end">
            <div>
                <h4 class="text-xl font-bold text-white group-hover:text-[#ccff00] transition-colors">${artist.name}</h4>
                <p class="text-xs text-gray-500 uppercase tracking-widest mt-1 group-hover:text-white transition-colors">${artist.style}</p>
            </div>
        </div>
    `;

    artistGrid.appendChild(card);

    gsap.to(card,{
        scrollTrigger:{
            trigger:card,
            start:"top 95%",
            toggleActions:"play none none reverse"
        },
        opacity:1,
        y:0,
        duration:0.8,
        delay: index * 0.1,
        ease:"power3.out"
    });
});

const loaderText = document.getElementById('loader-percent');
const loaderBar = document.getElementById('loader-bar');
const loaderStatus = document.getElementById('loader-status');
const loaderEl = document.getElementById('loader');

const allImages = Array.from(document.querySelectorAll('img')).filter(img => img.id !== 'modal-img');
const totalImages = allImages.length;
let loadedCount = 0;
let displayPercent = { value: 0};

function updateProgress(){
    const actualPercent = Math.round((loadedCount / totalImages)* 100);

    gsap.to(displayPercent,{
        value: actualPercent,
        duration:0.5,
        ease:"power1.out",
        onUpdate:()=>{
            const currentVal = Math.round(displayPercent.value);
            loaderText.innerText = currentVal;
            loaderBar.style.width = currentVal + "%";
        },
        onComplete: () =>{
            if(loadedCount >= totalImages && Math.round(displayPercent.value)=== 100){
                finishLoading();
            }
        }
    });
}

function onImageLoad(){
    loadedCount++;
    if(loaderStatus){
        loaderStatus.innerText = `加载 (${loadedCount}/${totalImages})……`
    }
    updateProgress();
}

if(totalImages===0){
    finishLoading();
}
else{
    allImages.forEach(img=>{
        if(img.complete){
            onImageLoad.call(img);
        }
        else{
            img.onload = onImageLoad;
            img.onerror = onImageLoad;
        }
    });
}

// setTimeout();

let isFinished = false;
function finishLoading(){
    if(isFinished) return;
    isFinished = true;
    if(loaderStatus) loaderStatus.innerText = "加载完成";

    const tl = gsap.timeline();
    tl.to(loaderEl,{
        yPercent: -100,
        duration:1.2,
        ease:"power4.inOut",
        delay: 0.2,
        onComplete:()=>{
            document.body.style.overflow = '';
            loaderEl.style.display = 'none';
        }
    });
}



const tl = gsap.timeline();

tl.from('h1 span',{
    y: 100,
    opacity: 0,
    stagger: 0.2,
    duration: 1.5,
    ease: "power4.out"
});

tl.from('space-y-4 p',{
    opacity:0,
    y: -20,
    duration:1,
    ease: "power2.out"
},"-=1");

// 跑马灯
const marqueeText = "独特视角  ·  创新视野  ·  数字创作  ·  创意灵感  ·";

const marqueeContent = document.getElementById('marquee-content');
marqueeContent.innerHTML = `<span class="text-8xl font-bold text-[#1a1a1a] outline-text-dark tracking-tighter">${marqueeText.repeat(8)}</span>`;

gsap.to(marqueeContent,{
    xPercent: -50,
    repeat: -1,
    duration: 40,
    ease: "linear"
});



// 画廊浮现效果
const items = document.querySelectorAll('.gallery-item');

items.forEach((item,index)=>{
    gsap.fromTo(item,{
        opacity:0,
        y:50
    },
    {
        opacity:1,
        y:0,
        duration:1,
        ease:"power3.out",

        scrollTrigger:{
            trigger:item,
            start:"top 80%",
            toggleActions:"play none none reverse"
        }
    });
});




const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeModalBtn = document.getElementById('close-modal');
const modalCaptionBox = document.getElementById('modal-caption-box');

function openModal(item){
    modalImg.src = item.url;
    modalTitle.innerText = item.title;
    modalDesc.innerText = `Own ${item.artist} | 2025`

    modal.classList.remove('modal-hidden');

    setTimeout(()=>{
        modalCaptionBox.style.transform = 'translateY(0)'
    },300);
}

function closeModalFunc(){
    modalCaptionBox.style.transform = `translateY(100%)`

    modal.classList.add(`modal-hidden`);

    setTimeout(()=>{
        modalImg.src = '';
    },300);
}

closeModalBtn.addEventListener('click',closeModalFunc);

modal.addEventListener('click',(e)=>{
    if(e.target === modal){
        closeModalFunc();
    }
});

setTimeout(()=>{
    lucide.createIcons();
});


//     card.innerHTML = `
//         <div class="relative overflow-hidden">
//             <img src="${artist.img}" alt="${artist.name}" class="artist-img">
//             <div class="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ccff00] text-black">
//                 <i data-lucide="arrow-up-right" class="w-5 h-5"></i>
//             </div>
//         </div>
//         <div class="artist-info mt-4 pt-4 flex justify-between items-end">
//             <div>
//                 <h4 class="text-xl font-bold text-white group-hover:text-[#ccff00 transition-colors]">${artist.name}</h4>
//                 <p class="text-xs text-gray-500 uppercase tracking-widest mt-1 group-hover:text-white transition-colors">${artist.style}</p>
//             </div>
//         </div>
//     `; 