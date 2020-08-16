const puppeteer = require('puppeteer');
const jsPackTools = require('js-packtools')();
const fs   = require('fs');

//arg[0] - account name



Array.prototype.unique=function(a){
    return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

const open = async(a,b,c,d) => {
    const browser = await puppeteer.launch({
        timeout : 999 * 1000,
        headless: false
    });

    const page        = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    const flatArray   = arr => [].concat(...arr);
    let cord;           //coordenadas inicial
    let currentCord;    //Cordenadas actual

    let account       = 'p._zaragoza';
    let nextWhile     = true;

    console.log('Open browser');

    await page.goto('https://instagram.com');

    await page.screenshot({path: `${__dirname}/screenshot/${new Date().getTime()}_buddy-screenshot.png`});

    console.log('go to instagram')

    await page.waitFor('input[name="username"]');
    await page.focus('input[name="username"]');
    await page.keyboard.type('@' + a);

    console.log('set username', a);

    await page.waitFor('input[name="password"]');
    await page.focus('input[name="password"]');
    await page.keyboard.type(b);

    console.log('set password', b)

    const submit = await page.$('button[type="submit"]');
    await submit.click();

    console.log('submit')

    let arAccounts = c.split(',');

    console.log('array to accounts', arAccounts);


    for(let index=0;index<arAccounts.length; ++index){
        let getImgSrcAttr = [];
        console.log('entro en el for');
        console.log('arAccounts', arAccounts[index]);
        await page.waitFor(4000);
        await page.goto('https://www.instagram.com/' + arAccounts[index] + '/');
        await page.screenshot({path: `${__dirname}/screenshot/${new Date().getTime()}_buddy-screenshot.png`});
        await page.waitFor('.DINPA');

        let elHandle               = await page.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[1]/span');
        let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]); //cantidad de registros

        document.querySelector(`#${String(arAccounts[index]).replace(/\./g,'_')}-posts`).innerText = lamudiNewPropertyCount;

        let firstImage = await page.$('article img');
        await firstImage.click();
        await page.waitFor(4000);

        while (nextWhile){
            try {
                await page.waitFor(4000);
                await page.waitFor('body article[role="presentation"]');

                let img = await page.$$eval('article[role="presentation"] img', el => el.map(x =>{
                    let atr = x.getAttribute("src");

                    return /_nc_cat/g.test(atr) ? atr : false;
                }).filter(Boolean));

                let video = await page.$$eval('article[role="presentation"] video', el => el.map(x => x.getAttribute("src")));

                // let [elementHandle] = await page.$x('/html/body/div[4]/div[2]/div/article/div[2]/div/div/div[1]/img/@src');
                // await page.waitFor(4000);
                // const propertyHandle = await elementHandle.getProperty('value');
                // const propertyValue = await propertyHandle.jsonValue();
                console.log(img);
                console.log(video);

                getImgSrcAttr.push(img);
                getImgSrcAttr.push(video);

                let arrowRight = await page.waitForSelector('.coreSpriteRightPaginationArrow');
                await arrowRight.click();
                console.log(page.url());

            }
            catch (error) {
                nextWhile = false;
                console.log("Catch Error:", error)
            }


        }

        console.log(getImgSrcAttr);
        let getImgSrc = flatArray(getImgSrcAttr);
        const arrayCookies = await page.cookies();
        const cookie = arrayCookies.map(x => x.name + '=' + x.value).join(';');
        const opts = {
            method : "GET",
            headers: {
                'Cookie': cookie
            },
        };
        let dir = d + '/' + arAccounts[index] + '/';
        console.log(dir);
        jsPackTools.validateDir(dir);
        console.log(getImgSrc);
        getImgSrc.map(async (imgUrl, i) => {
            let ext = /mp4/g.test(imgUrl) ? '.mp4' : '.jpg';
            return await fetch(imgUrl, opts)
                .then(res => res.arrayBuffer())
                .then(response => {
                    console.log('---save');
                    fs.writeFileSync(dir + i + ext, Buffer.from(response));
                })
                .catch(console.error);
        });
        nextWhile = true;
    }






    /*
    while (nextWhile) {

        cord = await page.evaluate((header) => {
            const {x, y} = header.getBoundingClientRect();
            return {x, y};
        }, header);
        await page.waitFor(4000);


        await page.evaluate(() => {
            document.querySelector('.DINPA').scrollIntoView();

            window.addEventListener("scroll", function (event) {
                var scroll = this.scrollY;
                console.log(scroll)
            });

        });

        await page.waitFor(4000);

        currentCord = await page.evaluate((header) => {
            const {x, y} = header.getBoundingClientRect();
            return {x, y};
        }, header);

        console.log(cord, currentCord);



        if (currentCord !== undefined && currentCord.y === cord.y) {
            nextWhile = false;
        } else {
            getImgSrcAttr.push(await page.$$eval("article img", el => el.map(x => x.getAttribute("src"))));
        }
        console.log(flatArray(getImgSrcAttr).length)
    }
*/




};

/*
function extractImages(account) {

    let item        = $('.DINPA');
    const DIV_POST  = '//*[@id="react-root"]/section/main/div/header/section/ul/li[1]/span';
    let post        = $(DIV_POST).getText();

    u.logExecution(post);


    // browser.waitUntil(function () {
    // }, 600000, 'error nuca llega ha ser igual durante 60 seg.');
    let withfot = true;
    while(withfot){
        cord = browser.getElementLocation(item.ELEMENT);
        item.scrollIntoView();

        browser.pause(4000);


        currentCord = browser.getElementLocation(item.ELEMENT);
        if (currentCord !== undefined && currentCord.y === cord.y) {
            withfot = false;
        }else{
            $$('article img').forEach(img => {
                //browser.pause(1000);
                getImgSrcAttr.push(img.getAttribute('src'));
            });
        }
    }

    getImgSrcAttr = _.uniq(_.flattenDeep(getImgSrcAttr));
    u.logExecution(getImgSrcAttr.length+' Descargado');
    //u.logExecution(JSON.stringify(getImgSrcAttr));
    //console.log(JSON.stringify(getImgSrcAttr));



    let COOKIES = browser.getCookies();
    let arrayCookies = [];
    COOKIES.forEach(function (cookie) {
        arrayCookies.push(cookie.name + '=' + cookie.value);
    });
    arrayCookies = arrayCookies.join(';');
    getImgSrcAttr.forEach((imgUrl, index) => {
        let res = request('GET', imgUrl, {
            'headers': {
                'Cookie': arrayCookies
            }
        });
        dir = __dirname + '/images/' + account + '/';
        u.validateDir(dir);
        fs.writeFileSync(dir + index + '.jpg', res.getBody());
        //compressing.gzip.compressFile(dir, __dirname + '/images/account.zip')
    });
}
*/
module.exports = { open };


