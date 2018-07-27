const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const DOMAIN = 'https://gz.zu.ke.com'; // 贝壳租房
const TOTAL = 100;
const result = [];

const getData = (page) => {
    if (page > TOTAL) {
        console.log('正在保存数据');
        let str = JSON.stringify(result, null, 4);
        fs.writeFileSync('./result/data.json', str, 'utf8');
        console.log('数据保存成功');
        return;
    }
    const url = `${DOMAIN}/zufang/tianhe/pg${page}/#contentList`;
    request(url, (error, response, body) => {
        if (response.statusCode === 200) {
            const $ = cheerio.load(body);
            const $li = $('.content__list--item');

            for (let i = 0; i < $li.length; i++) {
                let obj = {};
                let $this = $li.eq(i);
                obj.title = $this.find('.content__list--item--title a').text().trim();
                obj.des = $this.find('.content__list--item--des').text().replace(/[ |\n]/g, '');
                obj.brand = $this.find('.content__list--item--brand').text().trim();
                obj.time = $this.find('.content__list--item--time').text().trim();
                obj.tag = $this.find('.content__list--item--bottom').text().replace(/[ |\n]+/g, ' ').trim().split(' ');
                obj.price = $this.find('.content__list--item-price').text().replace(/[ |\n]+/g, '');
                obj.link = DOMAIN + $this.find('.link').attr('href');
                // obj.image = $this.find('.content__list--item--aside img').data('src');
                result.push(obj);
            }
            console.log(`第 ${page} 页 ${$li.length}条 爬取成功，共 ${TOTAL} 页`);
            page++;
            getData(page);
        }
    });
};

const main = () => {
    getData(1);
};

main();