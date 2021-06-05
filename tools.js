const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const protocol = options =>
  typeof options === 'string'
    ? new URL(options).protocol
    : options.protocol

const curl = options => new Promise((resolve, reject) => {

  // can just use `http.request(url, )
  const request = (protocol(options) === 'https:' ? https : http).request(options, res => {
    if (res.statusCode !== 200) {
      return reject(Error(res.statusMessage))
    }

    const chunks = []

    res.on('error', err => {
      reject(err)
    })

    res.on('data', chunk => {
      chunks.push(chunk)
    })

    res.on('end', () => {
      resolve(Buffer.concat(chunks).toString())
    })
  })

  request.on('error', err => {
    reject(err)
  })

  // request.write('')

  request.end()

})

const curlo = (options, writer) => new Promise((resolve, reject) => {

  // can just use `http.request(url, )
  const request = (protocol(options) === 'https:' ? https : http).request(options, res => {
    if (res.statusCode !== 200) {
      return reject(Error(res.statusMessage))
    }

    res.on('error', err => {
      reject(err)
    })

    res.pipe(writer)

    res.on('end', () => {
      resolve()
    })
  })

  request.on('error', err => {
    reject(err)
  })

  // request.write('')

  request.end()

})

// for older pictures, couple with db
const crawler = () => {
  const ioliu = 'https://bing.ioliu.cn'

  // M would been modified
  const next = (M, n, html) => {
    console.log('[next] page ' + n)

    const matched = html.match(/data-progressive="(.*?)"/g)

    if (!matched) {
      throw Error('[regular] no matched images')
    }

    const urls = matched.map(x => x.slice(x.indexOf('http'), -1))

    const fn = url => {
      const name = url.slice(url.lastIndexOf('/') + 1)

      // prevent duplicate curlo using name
      return !M[name] && (M[name] = 1) && curlo(url, fs.createWriteStream(path.resolve(__dirname, './db/' + name)))
    }

    return Promise.all(urls.map(fn))
  }

  const html$ = n => {
    return curl(ioliu + '/?p=' + n)
  }

  const pages$ = curl(ioliu)
    .then(res => {
      const pages = res.match(/上一页<\/a><span>(\d+)\s*\/\s*(\d+)<\/span>/)

      if (!pages) {
        throw Error('[regular] no matched pages')
      }

      return +pages[2]
    })

  fs.readdir('db', (err, files) => {
    if (err) {
      return console.log('[ls]', err)
    }

    const M = files.reduce((acc, x) => ({ ...acc, [x]: 1 }), {})

    return pages$.then(total => {
      return Array.from({ length: total }, (_, i) => i + 1).reduce((acc, x) => {
        return acc.then(() => html$(x)).then(html => next(M, x, html))
      }, Promise.resolve())
    })
  })
}

module.exports = {
  curl,
  curlo,
  crawler,
}
