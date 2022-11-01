const puppeteer               = require('puppeteer');
const {validateDir, writeLog} = require('js-packtools')();
const fs                      = require('fs');

async function getImageFetch(imgUrl, cookies, pathSave = '') {
    const opts = {
        method : "GET",
        headers: {
            'Cookie': cookies
        },
    };
    const ext  = /mp4/g.test(imgUrl) ? '.mp4' : '.jpg';

    return fetch(imgUrl, opts)
        .then(res => res.arrayBuffer())
        .then(response => {
            console.log('---save');
            fs.writeFileSync(pathSave + ext, Buffer.from(response));
        })
        .catch(console.error);
}

const scraping = async (login, password, accounts, path) => {
    const browser     = await puppeteer.launch({
        timeout : 999 * 1000,
        headless: false
    });
    const page        = (await browser.pages())[0];
    const flatArray   = arr => [].concat(...arr);
    let getImgSrcAttr = [];
    let arAccounts    = accounts.split(',');

    await page.setDefaultNavigationTimeout(0);
    writeLog('Open browser');

    await page.goto('https://instagram.com');
    writeLog('go to instagram');

    const getCookies = async (page,) => {
        const arrayCookies = await page.cookies();
        return arrayCookies.map(x => x.name + '=' + x.value).join(';');
    }

    const setLogin = async (login) => {
        await page.waitForSelector('input[name="username"]');
        await page.focus('input[name="username"]');
        await page.keyboard.type('@' + login);
        writeLog('set username', login);
    }
    await setLogin(login);

    const setPassword = async (password) => {
        await page.waitForSelector('input[name="password"]');
        await page.focus('input[name="password"]');
        await page.keyboard.type(password);
        writeLog('set password', password);
    }
    await setPassword(password);

    const clickSubmit = async () => {
        const submit = await page.$('button[type="submit"]');
        await submit.click();
        writeLog('submit');
    }
    await clickSubmit();

    const saveProfileImage = async () => {
        let path    = 'tmp/profile';
        let pathImg = 'tmp/profile.jpg';
        let userImg = document.getElementById('avatarImg');

        await page.waitForSelector('img', {visible: true, timeout: 30000});
        await page.waitForTimeout(1000);

        try {
            let profileImgSrc = await page.$$eval('img', el => el.map(img => {
                let alt = img.getAttribute("alt") || '';
                return alt.indexOf('Foto del perfil') === 0 ? img.getAttribute("src") : false;
            }).filter(Boolean));
            if (profileImgSrc.length === 0) throw new Error('No profileImgSrc found');
            let cookies = await getCookies(page);
            await getImageFetch(profileImgSrc, cookies, path);
            if (fs.existsSync(pathImg)) {
                userImg.src = 'tmp/profile.jpg'
            }
        } catch (err) {
            console.error('Image profile not found', '\n', err);
        }
    }
    await saveProfileImage();

    for (const arAccount of arAccounts) {
        const index        = arAccounts.indexOf(arAccount);
        let postByAccount  = document.getElementById(`${index}_post`);
        let profileAccount = document.getElementById(`${index}_profileImg`);
        let progresBar     = 0;

        const gotoAccount = async () => {
            console.log('scratching account:', arAccounts[index]);
            await page.goto('https://www.instagram.com/' + arAccounts[index] + '/');
            await page.waitForTimeout(1000);
        };
        await gotoAccount();

        const saveProfileImageAccount = async () => {
            await page.waitForSelector('header > section > ul >li > div');
            let imageHeader = await page.$eval('header img', elem => elem.getAttribute("src"));
            let cookies     = await getCookies(page);
            await getImageFetch(imageHeader, cookies, `tmp/profile_account_${arAccount}`);
            profileAccount.src = `tmp/profile_account_${arAccount}.jpg`;
            await page.screenshot({path: `${__dirname}/screenshot/${new Date().getTime()}_buddy-screenshot.png`});
        };
        await saveProfileImageAccount();

        const getPostByAccount = async () => {
            await page.waitForSelector('header > section > ul >li > div');
            let header              = await page.$eval('header > section > ul >li > div', $el => $el.innerText);
            let numberPost          = Number(header.split(' ')[0]);
            postByAccount.innerText = numberPost;
            console.log(numberPost, header); //33 publicaciones
            return numberPost;
        }
        let posts = await getPostByAccount();

        let firstImage = await page.$('article img');
        await firstImage.click();
        await page.waitForTimeout(1000);

        for (let i = 0; i < posts; i++) {
            console.log(i, posts);
            try {
                await page.waitForTimeout(4000);
                await page.waitForSelector('body article[role="presentation"]');

                let img = await page.$$eval('article[role="presentation"] img', el => el.map(x => {
                    let src = x.getAttribute("src");
                    let alt = x.getAttribute("alt");
                    return (alt.indexOf('Foto del perfil') === 0) ? false : src;
                }).filter(Boolean));

                let video = await page.$$eval('article[role="presentation"] video', el => el.map(x => x.getAttribute("src")));

                console.log(img);
                console.log(video);

                getImgSrcAttr.push(img);
                getImgSrcAttr.push(video);

                if (i < (posts - 1)) {
                    let arrowRight = await page.$('svg[aria-label="Siguiente"]');
                    await arrowRight.click();
                    console.log(page.url());
                }

                progresBar = Math.floor(i * 100 / posts);
                incrementProcessBar(index, progresBar);

            } catch (error) {
                console.log("Catch Error:", error)
            }
        }

        console.log(getImgSrcAttr);
        let getImgSrc = flatArray(getImgSrcAttr);
        let cookies   = await getCookies(page);
        let dir       = path + '/' + arAccounts[index] + '/';

        console.log(dir);
        validateDir(dir);
        console.log(getImgSrc);

        getImgSrc.map(async (imgUrl, j) => {
            await getImageFetch(imgUrl, cookies, `${dir}_${j}`);
        });

        progresBar = Math.floor(posts * 100 / posts);
        incrementProcessBar(index, progresBar);
    }
}
module.exports = {scraping};
