let input             = document.querySelector('input[name=tags]');
let btnAcceptSetLogin = document.querySelector('#setLogin');
let btnDownload       = document.querySelector('#btnDownload');
let login             = document.querySelector('#login');
let password          = document.querySelector('#password');
let formLogin         = document.querySelector('#formLogin');
let avatarName        = document.querySelector('#avatarName');

let loginValue    = undefined;
let passwordValue = undefined;

new Tagify(input);

function disabledBtnAcceptSetLogin() {
    btnAcceptSetLogin.disabled = true;
    btnAcceptSetLogin.classList.add('opacity-50');
    btnAcceptSetLogin.classList.add('cursor-not-allowed');
}
function activeBtnAcceptSetLogin() {
    btnAcceptSetLogin.disabled = false;
    btnAcceptSetLogin.classList.remove('opacity-50');
    btnAcceptSetLogin.classList.remove('cursor-not-allowed');
}

function disabledBtnDownload() {
    btnDownload.disabled = true;
    btnDownload.classList.add('opacity-50');
    btnDownload.classList.add('cursor-not-allowed');
}
function activeBtnDownload() {
    console.log('activeBtnDownload');
    btnDownload.disabled = false;
    btnDownload.classList.remove('opacity-50');
    btnDownload.classList.remove('cursor-not-allowed');
}

function modalClose(selector){
    if(selector === 'main-modal-login'){
        if(avatarName.innerText === 'InstamBackup'){
            formLogin.reset();
        }else{
            login.value = loginValue;
            password.value = passwordValue;
        }
    }
    const modal = document.querySelector(`.${selector}`);
    modal.classList.remove('fadeIn');
    modal.classList.add('fadeOut');
    modal.style.display = 'none';
}
function openModal(selector){
    let modal = document.querySelector(`.${selector}`);
    modal.classList.remove('fadeOut');
    modal.classList.add('fadeIn');
    modal.style.display = 'flex';
}

function incrementProcessBar(id, average){
    document.querySelector(`.pbar-${id} #counter`).innerHTML = (average+'%');
    document.querySelector(`.pbar-${id}.load-bar-inner`).style.width = (average+'%');
}

disabledBtnAcceptSetLogin();
disabledBtnDownload();

const modalAccount = document.querySelector('.main-modal-account');
modalAccount.style.display = 'none';

const modalLogin   = document.querySelector('.main-modal-login');
modalLogin.style.display   = 'none';

login.addEventListener('keyup', function (e) {
    disabledBtnAcceptSetLogin();
    disabledBtnDownload();

    let accounts   = document.querySelector('#accounts');
    if (e.target.value && password.value) {
        activeBtnAcceptSetLogin();
        if(accounts.value){
            activeBtnDownload();
        }
    }
});
password.addEventListener('keyup', function (e) {
    disabledBtnAcceptSetLogin();
    disabledBtnDownload();

    let accounts   = document.querySelector('#accounts');
    if (e.target.value && login.value) {
        activeBtnAcceptSetLogin();
        if(accounts.value){
            activeBtnDownload();
        }
    }
});

