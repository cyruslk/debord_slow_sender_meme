var Scraper = require ('images-scraper');

let google = new Scraper.Google({
	keyword: 'changer',
	limit: 200,
	puppeteer: {
		headless: false
	},
  tbs: {
		// every possible tbs search option, some examples and more info: http://jwebnet.net/advancedgooglesearch.html
    isz: undefined, 				// options: l(arge), m(edium), i(cons), etc. 
    itp: undefined, 				// options: clipart, face, lineart, news, photo
		ic: undefined, 					// options: color, gray, trans
		sur: undefined,					// options: fmc (commercial reuse with modification), fc (commercial reuse), fm (noncommercial reuse with modification), f (noncommercial reuse)
  },
  advanced: {
    imgType: 'photo', // options: clipart, face, lineart, news, photo
    resolution: 'l', // options: l(arge), m(edium), i(cons), etc.
    color: undefined // options: color, gray, trans
  }
});

(async () => {
	const results = await google.start();
    let resultsMaped = results.map((ele, index) => {
        return ele.url
    })
    console.log(resultsMaped);
    
})();