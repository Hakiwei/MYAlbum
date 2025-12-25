const supabaseUrl = 'https://ytnivihychwswgzciffn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0bml2aWh5Y2h3c3dnemNpZmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMTc2NjgsImV4cCI6MjA4MTg5MzY2OH0.Nwj-1PbzfPVNAJaigWjstQ19KrowdvofG980urH4t88';
const supabaseClient = supabase.createClient(supabaseUrl,supabaseKey);

// 登录相关参数
// const authPanel = document.getElementById('auth-pannel');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const actionBtn = document.getElementById('auth-action-btn');
const switchBtn = document.getElementById('auth-switch-btn');
const switchText = document.getElementById('auth-switch-text');
const modeTitle = document.getElementById('auth-mode-tile');
const btnText = document.getElementById('auth-btn-text');
const loadingIcon = document.getElementById('auth-loading');
const errorMsg = document.getElementById('auth-error-msg');
const sidebar = document.getElementById('user-home');
const uploadBookmark = document.getElementById('upload-bookmark');

const uploadModal = document.getElementById('upload-modal');
const closeUploadModalBtn = document.getElementById('close-upload-modal');
const fileInput = document.getElementById('file-input');
const previewImage = document.getElementById('preview-image');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const uploadTitleInput = document.getElementById('upload-title');
const confirmUploadBtn = document.getElementById('confirm-upload-btn');
// 个人首页相关参数
const loginFormContent = document.getElementById('login-form-content');
const userProfileContent = document.getElementById('user-profile-content');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email-display');
const userAvatar = document.getElementById('user-avatar');
const avatarInput = document.getElementById('avatar-input');
const avatarContainer = document.getElementById('avatar-container');
const userNicknameDisplay = document.getElementById('user-nickname-display');
const userNicknameInput = document.getElementById('user-nickname-input');

// const tabWorks = document.getElementById('tab-works');
// const userGallerySection = document.getElementById('user-gallery-section');

let isLoginMode = true;
let userGalleryItems = [];
let currentUserNickname = "未命名用户";

switchBtn.addEventListener('click',()=>{
    isLoginMode = !isLoginMode;

    errorMsg.classList.add('hidden');
    emailInput.value = '';
    passwordInput.value = '';
    passwordInput.value = '';

    if(isLoginMode){
        modeTitle.innerText = '欢迎回来';
        btnText.innerText = '登录';
        switchText.innerText = '还没有账号?';
        switchBtn.innerText = '去注册';
    }else{
        modeTitle.innerText = '创建账号';
        btnText.innerText = '注册';
        switchText.innerText = '已有账号?';
        switchBtn.innerText = '去登录';
    }
});

actionBtn.addEventListener('click', async ()=>{
    const email = emailInput.value;
    const password = passwordInput.value;

    if(!email || !password){
        showError('请填写邮箱和密码');
        return;
    }

    setLoading(true);

    let result;

    if(isLoginMode){
        result = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
    }else{
        result = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options:{
                data:{
                    display_name: nickname
                }
            }
        });
    }

    const {data, error} = result;

    if(error){
        showError(translateError(error.message));
        setLoading(false);
    }else{
        setLoading(false);
        console.log('操作成功:',data);

        if(isLoginMode){
            // alert('登录成功!');
            updateUserStatus(data.user);
        }else{
            // alert('注册成功');

            // if(data.user){
            //     updateUserStatus(data.user);
            // }

            if(data.user && !data.session){
                alert(`注册成功\n\n验证邮件已发送至${email},请点击邮件中的链接完成激活。`);
            }else if(data.user && data.session){
                updateUserStatus(data.user);
            }
        }
    }
});

supabaseClient.auth.onAuthStateChange((event, session)=>{
    console.log("当前认证事件:", event);

    if(event === 'SIGNED_IN' && session){
        console.log("用户已登录:", session.user);

        updateUserStatus(session.user);

        window.history.replaceState(null,null,window.location.pathname);
    }else if(event === 'SIGNED_OUT'){
        console.log("用户已登出");
    }
});

logoutBtn.addEventListener('click',async ()=>{
    const {error} = await supabaseClient.auth.signOut();

    if(!error){
        location.reload();
    }
});

uploadBookmark.addEventListener('click',()=>{
    uploadModal.classList.remove('modal-hidden');
});

closeUploadModalBtn.addEventListener('click',()=>{
    uploadModal.classList.add('modal-hidden');

    resetUploadForm();
});

fileInput.addEventListener('change',function(e){
    const file = e.target.files[0];

    if(file){
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            uploadPlaceholder.classList.add('opacity-0');
        }

        reader.readAsDataURL(file);
    }
});

confirmUploadBtn.addEventListener('click',async ()=>{
    const title = uploadTitleInput.value || '未命名作品';

    const imgSrc = previewImage.src;

    if(!imgSrc || previewImage.classList.contains('hidden')){
        // alert('请先选择图片');
        return;
    }

    const newItem = {
        title: title,
        artist: currentUserNickname,
        url:imgSrc
    };


    const formData = new FormData();

    formData.append('file',fileInput.files[0]);

    const response = await fetch('/upload',{
        method: 'POST',
        body: formData
    });

    if(response.status === 200){
        // const msg = await response.text();
        // alert('上传成功' + msg);

        const imageUrl = await response.text();
        const { data: { user } } = await supabaseClient.auth.getUser();

        if(user){
            const { error: dbError} = await supabaseClient
                .from('user_gallery')
                .insert({
                    title: title,
                    artist: currentUserNickname,
                    url: imageUrl,
                    user_id: user.id
                });

            if(dbError){
                console.error('数据库保存失败:',dbError);
                alert('图片上传成功，但保存信息失败');
            }else{
                console.log('数据库保存成功!');
                renderUserGallery();
            }
        }
    }else{
        const msg = await response.text();
        alert('上传失败' + msg);
    }

    userGalleryItems.unshift(newItem);

    renderUserGallery();

    uploadModal.classList.add('modal-hidden');

    resetUploadForm();

    // alert('发布成功');
});



avatarContainer.addEventListener('click',()=>{
    avatarInput.click();
});

avatarInput.addEventListener('change',(e)=>{
    const file = e.target.files[0];

    if(file){
        const reader = new FileReader();
        reader.onload = function(e) {
            userAvatar.src = e.target.result;
        }

        reader.readAsDataURL(file);
    }
});

userNicknameDisplay.addEventListener('click',()=>{
    userNicknameDisplay.classList.add('hidden');
    userNicknameInput.classList.remove('hidden');
    userNicknameInput.focus();
});

async function saveNickname(){
    const newName = userNicknameInput.value.trim();

    if(!newName || newName === currentUserNickname){
        userNicknameInput.value = currentUserNickname;
        return;
    }

    const oldName = currentUserNickname;
    currentUserNickname = newName;
    userNicknameDisplay.innerText = newName;

    try {
        const { data:{ user } } = await supabaseClient.auth.getUser();

        const userId = user.id;
        
        const { error: authError } = await supabaseClient.auth.updateUser({
            data: { display_name: newName }
        });
        if(authError) throw authError;

        const { error } = await supabaseClient
            .from('profiles')
            .update({username: newName})
            .eq('id',userId);
        if(error) throw error;
        console.log("昵称已同步:",newName);
    } catch (error) {
        console.error("保存失败:",error);
        alert("保存失败");

        currentUserNickname = oldName;
        userNicknameDisplay.innerText = oldName;
    }

    
}

userNicknameInput.addEventListener('blur',saveNickname);
userNicknameInput.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter') {
        e.preventDefault();
        userNicknameInput.blur();
    }
});



function resetUploadForm(){
    fileInput.value = '';
    previewImage.src = '';
    previewImage.classList.add('hidden');
    uploadPlaceholder.classList.remove('opacity-0');
    uploadTitleInput.value = '';
}

function showError(msg){
    errorMsg.innerText = msg;
    errorMsg.classList.remove('hidden');

    gsap.from(errorMsg, {x: -10,duration: 0.1,repeat: 3,yoyo:true});
}

function translateError(msg){
    if(msg.includes('Invalid login credentials')) return '邮箱或密码错误';
    if(msg.includes('User already registered')) return '该邮箱已被注册';
    if(msg.includes('password should be')) return '密码长度太短(至少6位)';
    
    return msg;
}

function setLoading(isLoading){
    if(isLoading){
        btnText.classList.add('hidden');
        loadingIcon.classList.remove('hidden');
        actionBtn.disabled = true;
        actionBtn.classList.add('opacity-50','cursor-not-allowed');
    }else{
        btnText.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
        actionBtn.disabled = false;
        actionBtn.classList.remove('opacity-50','cursor-not-allowed');
    }
}

async function updateUserStatus(user){
    const metaName = user.user_metadata?.display_name;
    const emailName = user.email?.split('@')[0];
    const finalName = metaName || emailName || '未命名用户';

    currentUserNickname = finalName;

    if(userNicknameDisplay) userNicknameDisplay.innerText = finalName;
    if(userNicknameInput) userNicknameInput.value = finalName;

    loginFormContent.classList.add('hidden');
    userProfileContent.classList.remove('hidden');
    userProfileContent.classList.add('flex');

    // userEmailDisplay.innerText = user.email;
    userEmailDisplay.innerText = "UID: Loading……";
    
    try {
        const {data: profile, error} = await supabaseClient
            .from('profiles')
            .select('friend_id')
            .eq('id',user.id)
            .single();

        if(profile && profile.friend_id){
            userEmailDisplay.innerText = `UID: ${profile.friend_id}`;
        }else{
            userEmailDisplay.innerText = user.email;
        }
    } catch (err) {
        console.error("UID加载失败:",err);
        userEmailDisplay.innerText = user.email;
    }

    gsap.to(uploadBookmark,{
        x:0,
        duration: 0.8,
        ease: "power3.out",
        delay:0.2
    });

    renderUserGallery();

    lucide.createIcons();
}

async function renderUserGallery(){
    const userGalleryGrid = document.getElementById('user-gallery-grid');
    const emptyState = document.getElementById('empty-state');

    const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user) return;

    const { data, error } = await supabaseClient
        .from('user_gallery')
        .select('*')
        .eq('user_id',user.id);
    if(error){
        console.error('加载画廊失败:',error);
        return;
    }
    userGalleryItems = data || [];
    userGalleryGrid.innerHTML = '';

    if(userGalleryItems.length === 0){
        emptyState.classList.remove('hidden');
    }else{
        emptyState.classList.add('hidden');
        userGalleryItems.forEach(item =>{
            const div = document.createElement('div');
            div.className = 'gallery-item hoverable mb-6 break-inside-avoid';
            div.setAttribute('data-cursor','view');

            div.innerHTML = `
                <img src="${item.url}" alt="${item.title}" class="gallery-img w-full h-auto block bg-[#333]">
                <div class="item-overlay z-20">
                    <span class="text-black font-bold text-lg uppercase tracking-widest">${item.title}</span>
                    <span class="text-black text-[10px] uppercase tracking-widest mt-1">by ${item.artist}</span>
                </div>
            `;

            div.addEventListener('click',()=> openModal(item));

            userGalleryGrid.appendChild(div);
        });
    }
}

