const {open}              = require('./puppeteer.js');
const ipcRenderer         = require('electron').ipcRenderer;
let wrapCard              = document.getElementById('wrapCard');
let dir                   = 'profiles';
let user                  = undefined;
let pass                  = undefined;
let accounts              = undefined;

const templateAccountCard = (arg, index) => `
<div class="mt-8 flex px-4 py-4 justify-between bg-whitedark:bg-gray-600 shadow-xl rounded-lg cursor-pointer">
    <div class="flex justify-between">
        <img id="profileImg" class="h-12 w-12 rounded-full object-cover" src="./assets/img/profile_empty.jpg" alt="" />
        <div class="ml-4 flex flex-col capitalize text-gray-600dark:text-gray-400">
            <span class="font-semibold">Account</span>
            <span class="mt-2 text-black dark:text-gray-200">${arg[0]}</span>
        </div>
    </div>
    <div class="flex">
        <div class="mr-16 flex flex-col capitalize text-gray-600dark:text-gray-400">
            <span class="font-semibold">Posts</span>
            <span id="${index}_post" class="mt-2 text-black dark:text-gray-200">0</span>
        </div>
        <div class="mr-16 flex flex-col capitalize text-gray-600dark:text-gray-400">
            <span class="font-semibold">Type</span>
            <span class="mt-2 text-black dark:text-gray-200">inaccessible</span>
        </div>
        <div class="mr-16 flex flex-col capitalize text-gray-600dark:text-gray-400">
            <span class="font-semibold">status</span>
            <span class="mt-2 text-yellow-600 dark:text-yellow-400">Ready to start</span>
        </div>
        <div class="mr-8 flex flex-col capitalize text-gray-600dark:text-gray-400">
            <span class="font-semibold">final date</span>
            <span class="mt-2 text-green-400 dark:text-green-200">---</span>
        </div>
    </div>
</div>
`;

ipcRenderer.on('variable-reply', function (event, args) {
    dir = args;

    let path       = document.getElementById('path');
    let initPath   = args.split('\\').shift();
    let endPath    = args.split('\\').pop();
    let lengthPath = args.split('\\').length;

    path.innerText = `${initPath}/${('../'.repeat(lengthPath))}${endPath}`;
});

document.querySelector('#btnPath').addEventListener('click', () => {
  ipcRenderer.send('selectDirectory');
});

document.querySelector('#btnLogin').addEventListener('click', () => {
    openModal('main-modal-login');
});

document.querySelector('#btnAddAccount').addEventListener('click', () => {
    openModal('main-modal-account');
});

document.querySelector('#btnDownload').addEventListener('click', async () => {
    await open(user.value, pass.value, accounts.join(','), dir);
});

document.querySelector('#formLogin').addEventListener('submit', (event) => {
    event.preventDefault();
    user = document.getElementById('login');
    pass = document.getElementById('password');

    if (!user.value || !pass.value) {
        return false;
    }

    let userName = document.getElementById('avatarName');
    let userType = document.getElementById('avatarType');
    let userImg  = document.getElementById('avatarImg');

    userName.innerText = (user.value).toUpperCase();
    userType.innerText = '👤 user common';
    userImg.src = './assets/img/profile_empty.jpg';
});

document.querySelector('#setAccount').addEventListener('click', async () => {
    modalClose('main-modal-account');

    let $elAccounts = document.querySelector('#accounts');
    let arAccounts  = JSON.parse($elAccounts.value);
    let accounts    = arAccounts.map(d => d.value);

    wrapCard.innerHTML = '';
    accounts.forEach((account, index) => {
        wrapCard.insertAdjacentHTML('beforeend', templateAccountCard([account], index));
    });

    if(login.value && password.value && $elAccounts.value){
        activeBtnDownload();
    }

    let headerAccountNumber = document.querySelector('#headerAccountNumber');
        headerAccountNumber.innerText = accounts.length;
});

