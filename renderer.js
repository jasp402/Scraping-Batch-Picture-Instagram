const { open } = require('./puppeteer.js');
const ipcRenderer = require('electron').ipcRenderer;
const templateAccountCard = (...arg) => `<div
                    class="mt-8 flex px-4 py-4 justify-between bg-whitedark:bg-gray-600 shadow-xl rounded-lg cursor-pointer">
                <!-- Card -->

                <div class="flex justify-between">
                    <!-- Left side -->

                    <img
                            class="h-12 w-12 rounded-full object-cover"
                            src="https://appzzang.me/data/editor/1608/f9c387cb6bd7a0b004f975cd92cbe2d9_1471626325_6802.png"
                            alt="" />

                    <div
                            class="ml-4 flex flex-col capitalize text-gray-600dark:text-gray-400">
                        <span>Account</span>
                        <span class="mt-2 text-black dark:text-gray-200">${arg[0]}</span>
                    </div>

                </div>

                <div class="flex">
                    <!-- Rigt side -->

                    <div
                            class="mr-16 flex flex-col capitalize text-gray-600dark:text-gray-400">
                        <span>Posts</span>
                        <span class="mt-2 text-black dark:text-gray-200" id="${String(arg[0]).replace(/\./g,'_')}-posts">0</span>
                    </div>

                    <div
                            class="mr-16 flex flex-col capitalize text-gray-600dark:text-gray-400">
                        <span>Type</span>
                        <span class="mt-2 text-black dark:text-gray-200">inaccessible</span>
                    </div>

                    <div
                            class="mr-16 flex flex-col capitalize text-gray-600dark:text-gray-400">
                        <span>status</span>
                        <span class="mt-2 text-yellow-600 dark:text-yellow-400">Ready to start</span>
                    </div>

                    <div
                            class="mr-8 flex flex-col capitalize text-gray-600dark:text-gray-400">
                        <span>final date</span>
                        <span class="mt-2 text-green-400 dark:text-green-200">---</span>
                    </div>

                </div>

            </div>`;
let wrapCard = document.getElementById('wrapCard');
let dir = undefined;
let user = undefined;
let pass = undefined;
let accounts = undefined;
//AddEvent select Folder // get path with api electron
document.getElementById('dirs').addEventListener('click', () => {
  ipcRenderer.send('selectDirectory');
});

//get path as result with api electron
ipcRenderer.on('variable-reply', function (event, args) {
    dir = args;
    let path  = document.getElementById('path');
    path.innerText = args;
});

document.querySelector('#setAccount').addEventListener('click', async () => {
    let arAccounts = JSON.parse(document.getElementById('accounts').value);

    accounts = arAccounts.map(d => d.value);
    console.log(accounts);
    console.log('-->',accounts);
    console.log('-->',dir);

  //
    accounts.forEach(c => {
        wrapCard.insertAdjacentHTML('beforeend', templateAccountCard([c]));
    });

    let startDownload = document.querySelector('#startDownload');
    startDownload.classList.remove('opacity-50');
    startDownload.classList.remove('cursor-not-allowed');


  console.log('Started');
});

document.querySelector('#startDownload').addEventListener('click', async () => {
    user = await document.getElementById('login');
    pass = await document.getElementById('password');
    await open(user.value, pass.value, accounts.join(','), dir);
});