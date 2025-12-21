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

// 注册插件
gsap.registerPlugin(ScrollTrigger);

// 音乐控制逻辑
const musicBookmark = document.getElementById('music-bookmark');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;
let hasAutoPlayed = false;

bgMusic.volume = 0.5;

function playMusic(){
    const playPromise = bgMusic.play();

    if(playPromise !== undefined){
        playPromise.then(_=>{
            isPlaying = true;
            updateMusicIcon();
        })
        .catch(error =>{
            console.log("被拦截");
            isPlaying = false;
            updateMusicIcon();
        });
    }
}

function pauseMusic(){
    bgMusic.pause();
    isPlaying = false;
    updateMusicIcon();
}

function updateMusicIcon(){
    if(isPlaying){
        musicBookmark.innerHTML = '<i data-lucide="bar-chart-2" class="w-6 h-6"></i>';
        musicBookmark.classList.add('playing');
    }else{
        musicBookmark.innerHTML = '<i data-lucide="music" class="w-6 h-6"></i>';
        musicBookmark.classList.remove('playing');
    }

    if(typeof lucide !== 'undefined') lucide.createIcons();
}

musicBookmark.addEventListener('click',()=>{
    if(isPlaying){
        pauseMusic();
    }else{
        playMusic();
    }
});

function unlockAudio(){
    document.removeEventListener('click',unlockAudio);
    document.removeEventListener('touchstart',unlockAudio);
}

document.addEventListener('click',unlockAudio);
document.addEventListener('touchstart',unlockAudio);

if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'){
    ScrollTrigger.create({
        trigger: "#gallery-start",
        start: "top 60%",
        onEnter: ()=>{
            gsap.to(musicBookmark,{
                x:0,
                duration:0.8,
                ease:"power3.out"
            });

            if(!hasAutoPlayed && !isPlaying){
                playMusic();
                hasAutoPlayed = true;
            }
        },
        
    });
}

// GSAP标题浮出动画效果
// 画廊内容生成
const galleryData =[
    { title:"小艇", artist:"境", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/sunOff.jpg"},
    { title:"城市", artist:"境", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/buildingAndsunOff.jpg"},
    { title:"海岸", artist:"境", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/seapone.jpg"},
    { title:"蓝天", artist:"境", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/blueSky.jpg"},
    { title:"灌木", artist:"佳霖", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/grass.JPG"},
    { title:"海水", artist:"境", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/whiteGlass.jpg"},
    { title:"森林", artist:"佳霖", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/forest.png"},
    { title:"蜥蜴", artist:"境", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/animial.jpg"},
    { title:"行人", artist:"佳霖", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/People.JPG"},
    { title:"树影", artist:"佳霖", url:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/wood.png"}
];

const grid =document.getElementById('gallery-grid');

galleryData.forEach(item =>{
    const div = document.createElement('div');
    div.className = 'gallery-item hoverable';
    div.setAttribute('data-cursor','view');

    div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" class="gallery-img">
        <div class="item-overlay z-20">
            <span class="text-black font-bold text-2xl uppercase tracking-widest">${item.title}</span>
            <span class="text-black text-xs uppercase tracking-widest mt-2">by ${item.artist}</span>
        </div>
        `;
    
    div.addEventListener('click',()=> openModal(item));

    grid.appendChild(div);
});

// 生成卡片
const artistData =[
    { name:"合伙人", style:"",img:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/allpartner.jpg" },
    { name:"鸟木", style:"",img:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/hakwan.png" },
    { name:"佳霖", style:"",img:"https://cdn.jsdelivr.net/gh/Hakiwei/myAssets/HakJa.png" },
    { name:"函正", style:"",img:"https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/sadestPeople.jpg" }
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

const loaderPercentText = document.getElementById('loader-percent');
const loaderMask = document.getElementById('loader-mask');
const loaderEl = document.getElementById('loader');
const navLogo = document.getElementById('nav-logo');
const loaderTextWrapper = document.getElementById('loader-text-wrapper');

const allImages = Array.from(document.querySelectorAll('img')).filter(img => img.id !== 'modal-img');
const totalImages = allImages.length;
let loadedCount = 0;
let displayPercent = {Value:0};

function updateProgress(){
    if(totalImages === 0) return;

    const actualPercent = Math.round((loadedCount/totalImages)*100);

    gsap.to(displayPercent,{
        Value: actualPercent,
        duration: 0.5,
        ease: "power1.out",
        onUpdate:()=>{
            const currentVal = Math.round(displayPercent.Value);
            if(loaderPercentText) loaderPercentText.innerText = currentVal + "%";

            if(loaderMask) loaderMask.style.height = currentVal + "%"
        },
        onComplete:()=>{
            if(loadedCount >= totalImages && Math.round(displayPercent.Value) === 100){
                setTimeout(finishLoading,500);
            }
        }
    });
}

function onImageLoad(){
    loadedCount++;
    updateProgress();
}

if(totalImages === 0){
    let dummy = {val: 0};
    gsap.to(dummy,{
        val:100,
        duration:2,
        onUpdate:()=>{
            if(loaderMask) loaderMask.style.height = dummy.val + "%";
            
            if(loaderPercentText) loaderPercentText.innerText = Math.round(dummy.val) + "%";
        },
        onComplete: finishLoading
    });
}
else{
    allImages.forEach(img =>{
        if(img.complete) onImageLoad();
        else{
            img.onload = onImageLoad;
            img.onerror = onImageLoad;
        }
    });
}

let isFinished = false;
function finishLoading(){
    if(isFinished) return;
    isFinished = true;

    gsap.to(loaderPercentText,{opacity:0,duration:0.3});

    const stateStart = loaderTextWrapper.getBoundingClientRect();

    const stateEnd = navLogo.getBoundingClientRect();

    const scale = stateEnd.height / stateStart.height;

    const startCenterX = stateStart.left + stateStart.width / 2;
    const startCenterY = stateStart.top + stateStart.height / 2;
    const endCenterX = stateEnd.left + stateEnd.width / 2;
    const endCenterY = stateEnd.top + stateEnd.height / 2;

    const deltaX = endCenterX - startCenterX;
    const deltaY = endCenterY - startCenterY;

    const tl = gsap.timeline();

    tl.to('.loader-curtain.top',{
        yPercent: -100,
        duration: 1.6,
        ease: "power4.inOut"
    },"start");

    tl.to('.loader-curtain.bottom',{
        yPercent: 100,
        duration: 1.6,
        ease: "power4.inOut"
    },"start");

    tl.to(loaderTextWrapper,{
        x: deltaX,
        y: deltaY,
        scale: scale,
        duration:1.6,
        ease: "power4.inOut",
        onComplete:()=>{
            loaderEl.style.display = 'none';
            navLogo.classList.remove('opacity-0');
            document.body.style.overflow = '';
            PlayHeroAnimations();
        }
    },"start");

    tl.from('header',{
        scale:1.2,
        filter:"brightness(0.2)",
        duration:2,
        ease:"power2.out"
    },"start");

    tl.from('#marquee-content',{
        y: 100,
        opacity:0,
        duration:1.5,
        ease:"power3.out"
    },"start+=0.5");

}

function PlayHeroAnimations(){
    const tl = gsap.timeline();
    tl.from('h1 span',{
        y:100,
        opacity: 0,
        stagger: 0.2,
        duration:1.5,
        ease:"power4.out"
    });

    tl.from('.space-y-4 p',{
        opacity: 0,
        y:-20,
        duration: 1,
        ease:"power2.out"
    },"-=1");
}

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
    modalDesc.innerText = `by ${item.artist} | 2025`

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


const userBookmark = document.getElementById('user-bookmark');
const uploadSidebar = document.getElementById('upload-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');

// 侧边栏开关
function toggleSidebar(show) {
    if (show) {
        uploadSidebar.classList.remove('translate-x-full');
    } else {
        uploadSidebar.classList.add('translate-x-full');
    }
}

userBookmark.addEventListener('click', () => toggleSidebar(true));
closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));

// 文件预览逻辑
const fileInput = document.getElementById('file-input');
const previewImage = document.getElementById('preview-image');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const publishBtn = document.getElementById('publish-btn');
const workTitleInput = document.getElementById('work-title');
const workArtistInput = document.getElementById('work-artist');

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            previewImage.src = evt.target.result;
            previewImage.classList.remove('opacity-0');
            uploadPlaceholder.classList.add('opacity-0');
        }
        reader.readAsDataURL(file);
    }
});

// 发布逻辑
publishBtn.addEventListener('click', () => {
    const file = fileInput.files[0];

    // 简单校验
    if (!file) {
        // 简单的晃动提示
        gsap.to('#drop-area', { x: [-5, 5, -5, 5, 0], duration: 0.3 });
        return;
    }

    const title = workTitleInput.value.trim() || 'UNTITLED';
    const artist = workArtistInput.value.trim() || 'ANONYMOUS';

    // 读取文件并添加到画廊
    const reader = new FileReader();
    reader.onload = function (evt) {
        const imgUrl = evt.target.result;

        // 创建DOM
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item hoverable opacity-0 translate-y-12'; // 初始隐藏状态
        newItem.setAttribute('data-cursor', 'view');

        newItem.innerHTML = `
                    <img src="${imgUrl}" alt="${title}" class="gallery-img">
                    <div class="item-overlay z-20">
                        <span class="text-black font-bold text-2xl uppercase tracking-widest">${title}</span>
                        <span class="text-black text-xs uppercase tracking-widest mt-2">by ${artist}</span>
                    </div>
                `;

        // 绑定点击查看大图事件
        newItem.addEventListener('click', () => openModal({
            url: imgUrl,
            title: title,
            artist: artist
        }));

        // 插入到画廊的最前面
        const galleryGrid = document.getElementById('gallery-grid');
        galleryGrid.prepend(newItem);

        // 动画进场
        gsap.to(newItem, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });

        // 关闭侧边栏并重置表单
        toggleSidebar(false);
        setTimeout(() => {
            fileInput.value = '';
            workTitleInput.value = '';
            workArtistInput.value = '';
            previewImage.src = '';
            previewImage.classList.add('opacity-0');
            uploadPlaceholder.classList.remove('opacity-0');
        }, 500);

        // 滚动到画廊位置
        document.getElementById('gallery-start').scrollIntoView({ behavior: 'smooth' });
    }
    reader.readAsDataURL(file);
});


setTimeout(() => {
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