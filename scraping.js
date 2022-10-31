const puppeteer    = require('puppeteer');
const jsPackTools = require('js-packtools')();
const fs          = require('fs');

async function getImageFetch(imgUrl, opts, pathSave = '') {
    let ext = /mp4/g.test(imgUrl) ? '.mp4' : '.jpg';
    return fetch(imgUrl, opts)
        .then(res => res.arrayBuffer())
        .then(response => {
            console.log('---save');
            fs.writeFileSync(pathSave + ext, Buffer.from(response));
        })
        .catch(console.error);
}

const scraping = async(login, password, accounts, path) => {
    const browser = await puppeteer.launch({
        timeout : 999 * 1000,
        headless: false
    });
    const page    = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    const flatArray = arr => [].concat(...arr);
    let nextWhile   = true;

    console.log('Open browser');

    await page.goto('https://instagram.com');

    console.log('go to instagram');

    await page.waitFor('input[name="username"]');
    await page.focus('input[name="username"]');
    await page.keyboard.type('@' + login);

    console.log('set username', login);

    await page.waitFor('input[name="password"]');
    await page.focus('input[name="password"]');
    await page.keyboard.type(password);

    console.log('set password', password);

    const submit = await page.$('button[type="submit"]');
    await submit.click();

    console.log('submit');
    await page.waitFor(5000);
    let arAccounts = accounts.split(',');

    console.log('array to accounts', arAccounts);

    await page.waitFor('img');
    let profileImg = await page.$$eval('img', el => el.map(x => {
        let src = x.getAttribute("src");
        let alt = x.getAttribute("alt");
        return alt.indexOf('Foto del perfil') === 0 ? src : false;
    }).filter(Boolean));
    console.log(profileImg);

    const arrayCookies = await page.cookies();
    const cookie       = arrayCookies.map(x => x.name + '=' + x.value).join(';');
    const opts         = {
        method : "GET",
        headers: {
            'Cookie': cookie
        },
    };
    if (profileImg.length > 0) {
        await getImageFetch(profileImg, opts, 'tmp/profile');
        let imgProfile = 'tmp/profile.jpg';

        if (fs.existsSync(imgProfile)) {
            let stats           = fs.statSync(imgProfile);
            let fileSizeInBytes = stats.size;
            console.log('fileSizeInBytes', fileSizeInBytes);
            let userImg = document.getElementById('avatarImg');
            userImg.src = 'tmp/profile.jpg'
        }

    } else {
        console.log('Image profile not found');
    }


    for (let index = 0; index < arAccounts.length; ++index) {

        let postByAccount = document.getElementById(`${index}_post`);


        let getImgSrcAttr = [];
        console.log('arAccounts', arAccounts[index]);
        await page.waitFor(4000);
        await page.goto('https://www.instagram.com/' + arAccounts[index] + '/');
        await page.screenshot({path: `${__dirname}/screenshot/${new Date().getTime()}_buddy-screenshot.png`});
        await page.waitFor('header > section > ul >li > div');

        let header = await page.$eval('header > section > ul >li > div', elem => elem.innerText);
        console.log(header); //33 publicaciones
        postByAccount.innerText = header.split(' ')[0];

        let firstImage = await page.$('article img');
        await firstImage.click();
        await page.waitFor(4000);

        while (nextWhile) {
            try {
                await page.waitFor(4000);
                await page.waitFor('body article[role="presentation"]');

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
                let arrowRight = await page.$('svg[aria-label="Siguiente"]');
                await arrowRight.click();
                console.log(page.url());

            } catch (error) {
                nextWhile = false;
                console.log("Catch Error:", error)
            }


        }

        console.log(getImgSrcAttr);
        let getImgSrc      = flatArray(getImgSrcAttr);
        const arrayCookies = await page.cookies();
        const cookie       = arrayCookies.map(x => x.name + '=' + x.value).join(';');
        const opts         = {
            method : "GET",
            headers: {
                'Cookie': cookie
            },
        };
        let dir            = path + '/' + arAccounts[index] + '/';
        console.log(dir);
        jsPackTools.validateDir(dir);
        console.log(getImgSrc);

        getImgSrc.map(async (imgUrl, i) => {
            let ext = /mp4/g.test(imgUrl) ? '.mp4' : '.jpg';
            return fetch(imgUrl, opts)
                .then(res => res.arrayBuffer())
                .then(response => {
                    console.log('---save');
                    fs.writeFileSync(dir + i + ext, Buffer.from(response));
                })
                .catch(console.error);
        });

        nextWhile = true;
    }
}
module.exports = { scraping };
