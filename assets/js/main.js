let input             = document.querySelector('input[name=tags]');
let btnAcceptSetLogin = document.querySelector('#setLogin');
let btnDownload       = document.querySelector('#btnDownload');
let login             = document.querySelector('#login');
let password          = document.querySelector('#password');


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

disabledBtnAcceptSetLogin();
disabledBtnDownload();

const modalAccount = document.querySelector('.main-modal-account');
modalAccount.style.display = 'none';

const modalLogin   = document.querySelector('.main-modal-login');
modalLogin.style.display   = 'none';

login.addEventListener('change', function (e) {
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
password.addEventListener('change', function (e) {
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

