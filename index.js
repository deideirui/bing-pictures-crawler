const fs = require('fs')
const path = require('path')
const qs = require('querystring')

const { curl, curlo } = require('./tools')

/*
api eg: http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=7&mkt=zh-CN
{"images":[{"startdate":"20190923","fullstartdate":"201909231600","enddate":"20190924","url":"/th?id=OHR.UgandaGorilla_ZH-CN5826117482_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp","urlbase":"/th?id=OHR.UgandaGorilla_ZH-CN5826117482","copyright":"一只正在树上吃东西的山地大猩猩，乌干达布恩迪国家公园 (© Robert Haasmann/Minden Pictures)","copyrightlink":"https://www.bing.com/search?q=%E5%B1%B1%E5%9C%B0%E5%A4%A7%E7%8C%A9%E7%8C%A9&form=hpcapt&mkt=zh-cn","title":"","quiz":"/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190923_UgandaGorilla%22&FORM=HPQUIZ","wp":true,"hsh":"5adfe442809c399ba27619250be64a77","drk":1,"top":1,"bot":1,"hs":[]},{"startdate":"20190922","fullstartdate":"201909221600","enddate":"20190923","url":"/th?id=OHR.FeatherSerpent_ZH-CN5706017355_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp","urlbase":"/th?id=OHR.FeatherSerpent_ZH-CN5706017355","copyright":"秋分时日的卡斯蒂略金字塔，墨西哥奇琴伊察 (© Somatuscani/Getty Images Plus)","copyrightlink":"https://www.bing.com/search?q=%E5%8D%A1%E6%96%AF%E8%92%82%E7%95%A5%E9%87%91%E5%AD%97%E5%A1%94&form=hpcapt&mkt=zh-cn","title":"","quiz":"/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190922_FeatherSerpent%22&FORM=HPQUIZ","wp":true,"hsh":"659edf49a55ea9088b5e019af78ca700","drk":1,"top":1,"bot":1,"hs":[]},{"startdate":"20190921","fullstartdate":"201909211600","enddate":"20190922","url":"/th?id=OHR.VancouverFall_ZH-CN9824386829_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp","urlbase":"/th?id=OHR.VancouverFall_ZH-CN9824386829","copyright":"鸟瞰生长在森林中的树木，加拿大不列颠哥伦比亚省温哥华 (© Michael Wu/EyeEm/Getty Images)","copyrightlink":"https://www.bing.com/search?q=%E6%A3%AE%E6%9E%97%E4%B8%AD%E7%9A%84%E6%A0%91%E6%9C%A8&form=hpcapt&mkt=zh-cn","title":"","quiz":"/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190921_VancouverFall%22&FORM=HPQUIZ","wp":true,"hsh":"f56f92d088e72d92e1abceb2005ff38b","drk":1,"top":1,"bot":1,"hs":[]},{"startdate":"20190920","fullstartdate":"201909201600","enddate":"20190921","url":"/th?id=OHR.WallofPeace_ZH-CN5582031878_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp","urlbase":"/th?id=OHR.WallofPeace_ZH-CN5582031878","copyright":"“和平之墙”和巴黎的埃菲尔铁塔 (© Prisma by Dukas Presseagentur GmbH/Alamy)","copyrightlink":"https://www.bing.com/search?q=%E2%80%9C%E5%92%8C%E5%B9%B3%E4%B9%8B%E5%A2%99%E2%80%9D%E5%92%8C%E5%B7%B4%E9%BB%8E%E7%9A%84%E5%9F%83%E8%8F%B2%E5%B0%94%E9%93%81%E5%A1%94&form=hpcapt&mkt=zh-cn","title":"","quiz":"/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190920_WallofPeace%22&FORM=HPQUIZ","wp":true,"hsh":"2a495e0038c0cd95e95b3aa6d47710b6","drk":1,"top":1,"bot":1,"hs":[]},{"startdate":"20190919","fullstartdate":"201909191600","enddate":"20190920","url":"/th?id=OHR.SanSebastianFilm_ZH-CN5506786379_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp","urlbase":"/th?id=OHR.SanSebastianFilm_ZH-CN5506786379","copyright":"塞巴斯蒂安电影节举办地：圣塞巴斯蒂安和库尔萨尔文化中心 (© Aljndr/iStock/Getty Images Plus)","copyrightlink":"https://www.bing.com/search?q=%E5%9C%A3%E5%A1%9E%E5%B7%B4%E6%96%AF%E8%92%82%E5%AE%89%E5%92%8C%E5%BA%93%E5%B0%94%E8%90%A8%E5%B0%94%E6%96%87%E5%8C%96%E4%B8%AD%E5%BF%83&form=hpcapt&mkt=zh-cn","title":"","quiz":"/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190919_SanSebastianFilm%22&FORM=HPQUIZ","wp":true,"hsh":"38451b25db686da386fde695764c4063","drk":1,"top":1,"bot":1,"hs":[]},{"startdate":"20190918","fullstartdate":"201909181600","enddate":"20190919","url":"/th?id=OHR.CommonLoon_ZH-CN5437917206_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp","urlbase":"/th?id=OHR.CommonLoon_ZH-CN5437917206","copyright":"苏必利尔国家森林中一只常见的潜鸟，明尼苏达州 (© Jim Brandenburg/Minden Pictures)","copyrightlink":"https://www.bing.com/search?q=%E6%BD%9C%E9%B8%9F&form=hpcapt&mkt=zh-cn","title":"","quiz":"/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190918_CommonLoon%22&FORM=HPQUIZ","wp":true,"hsh":"885ca7793058b624ee69a349252bb6a9","drk":1,"top":1,"bot":1,"hs":[]},{"startdate":"20190917","fullstartdate":"201909171600","enddate":"20190918","url":"/th?id=OHR.SunbeamsForest_ZH-CN5358008117_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp","urlbase":"/th?id=OHR.SunbeamsForest_ZH-CN5358008117","copyright":"孚日山脉的针叶林，法国 (© Radomir Jakubowski/Minden Pictures)","copyrightlink":"https://www.bing.com/search?q=%E9%92%88%E5%8F%B6%E6%9E%97&form=hpcapt&mkt=zh-cn","title":"","quiz":"/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20190917_SunbeamsForest%22&FORM=HPQUIZ","wp":true,"hsh":"4ffd056b5438fab9eefb70a465ed68c8","drk":1,"top":1,"bot":1,"hs":[]}],"tooltips":{"loading":"正在加载...","previous":"上一个图像","next":"下一个图像","walle":"此图片不能下载用作壁纸。","walls":"下载今日美图。仅限用作桌面壁纸。"}}
*/

const headers = {
  Host: 'cn.bing.com',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  Referer: 'cn.bing.com',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0'
}

const options = {
  protocol: 'http:',
  headers,
  host: 'cn.bing.com',
  path: '/HPImageArchive.aspx?format=js&idx=0&n=100&mkt=zh-CN',
  method: 'get',
  port: 80
}

const merge = (file, diff, callback) => {
  if (!diff.length) {
    return callback(Error('[merge] diff was empty in merge(file, diff)'))
  }

  // both data and diff are desc by startdate
  const next = data => {
    if (data.length) {
      const latest = data[0].startdate
      diff = diff.filter(x => x.startdate > latest)
    }

    if (!diff.length) {
      return callback(null, [])
    }

    // prepend
    data = diff.concat(data)

    fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        return callback(err)
      }

      callback(null, diff)
    })
  }

  fs.stat(file, (err) => {
    if (err && err.code === 'ENOENT') {
      return next([])
    }

    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        return(err)
      }

      next(JSON.parse(data))
    })
  })
}

const run = () =>
  curl(options)
    .then(res => JSON.parse(res))
    .then(res => res.images)
    .then(res => {
      const fn = url => {
        const id = qs.parse(url.slice(url.indexOf('?') + 1)).id
        // case: OHR.CommonLoon_ZH-CN5437917206_1920x1080 -> CommonLoon_ZH-CN5437917206_1920x1080
        const name = id.slice(id.indexOf('.') + 1)

        console.log('[add]', name)

        return curlo('http://cn.bing.com' + url, fs.createWriteStream(path.resolve(__dirname, './db/' + name)))
      }

      merge(path.resolve(__dirname, './db/db.json'), res, (err, diff) => {
        if (err) {
          console.log(err)
        } else {
          diff.map(x => fn(x.url))
        }
      })
    })

/* latest week */
run()
