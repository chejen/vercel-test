const path = require('path');
const serve = require('koa-static');
const Koa = require('koa');
const Router = require('@koa/router');
const views = require('koa-views');

const app = new Koa();
const router = new Router();

router
  .get('/hello', async (ctx) => {
    // return ctx.render('./public/index.html')
	  ctx.body = 'hello';
    // ctx.body = await new Promise((resolve, reject) => {
    //   fs.readFile(
    //     './public/index.html',
    //     { 'encoding': 'utf8' },
    //     (err, data) => {
    //       if (err) return reject(err);
    //       resolve(data);
    //     }
    //   );
    // })
  })
  .get('/', (ctx) => {
    return ctx.render('./index.hbs');
  })
  .get('/dev', (ctx) => {
    return ctx.render('./index.hbs', {
      DEV: true,
    });
  });

app
  .use(views(path.join(__dirname, 'public'), {
    map: { hbs: 'handlebars' },
    options: {
      helpers: {
        uppercase: (str) => str.toUpperCase()
      },
    }
  }))
  .use(router.routes())
  .use(router.allowedMethods()).use(serve('./public'));

app.listen(5000);