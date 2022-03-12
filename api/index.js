const app = require('express')();
const cors = require('cors');
const axios = require("axios");
const cheerio = require('cheerio');
const { v4 } = require('uuid');

const getData = (el) => {
  return [
    el.find('.currency .print_show').text().trim(),
    el.find('[data-table="Spot Buying"]').first().text().trim()
  ];
};

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.get('/api/hello', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ name: 'Hello Vercel', date: new Date() });
});

app.get('/api/currency', cors(), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  axios.get('https://rate.bot.com.tw/xrt?Lang=en-US')
    .then(response => {
      const $ = cheerio.load(response.data);

      const time = $('.time').text().trim();
      const result = {
        time,
        'American Dollar (USD)': '',
        'Australian Dollar (AUD)': '',
        'New Zealand Dollar (NZD)': '',
        'China Yen (CNY)': '',
      };
      $('.table tbody tr')
        .each((i, el) => {
          const data = getData($(el));
          if (data[0] in result) {
            delete result[data[0]]
            result[data[0].match(/\(([^)]+)\)/)[1]] = +data[1];
          }
        });

      res.json(result);
      // res.json({
      //   result: result.filter(el => [
      //     'American Dollar (USD)',
      //     'Hong Kong Dollar (HKD)',
      //     'British Pound (GBP)',
      //     'Australian Dollar (AUD)',
      //     'Singapore Dollar (SGD)',
      //     'Japanese Yen (JPY)',
      //     'New Zealand Dollar (NZD)',
      //     'Thai Baht (THB)',
      //     'Euro (EUR)',
      //     'China Yen (CNY)',
      //   ].includes(el.currency)),
      //   time,
      // });
    });
});

// app.listen(3456, () => {
//   console.log(`Example app listening on port ${3456}`)
// });

module.exports = app;
