const recognize = require('tesseractocr')



var link = 'CommentairesSurLaSocieteDuSpectacle-1.png';
recognize(link, (err, text) => {
    if (err)
        throw err
    else
        console.log('Yay! Text recognized!', text)
})
