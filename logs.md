# 2018-10-24

It's been some time since I've been fascinated by a strange idea I wanted to explore in my bots: working with what i'll call **Protocol chaining**. 

What I call Protocol chaining is related to my understanding of internet: as a node of Protocols interacting/altering/enacting data. Through Algorithms, data are going *from Protocols to Protocols* - and is consequently translated through these protocols logic's and structures.

------

So the idea behind this project is to basically create a translation of [*La Société du spectacle*](https://fr.wikipedia.org/wiki/La_Soci%C3%A9t%C3%A9_du_spectacle_(livre)) from original words (transfered and scraped with an OCR code) to Google Image results. Then from these Google Image results, have the images translated back from images to text.



# 2018-10-26

All sorts of usefull links - I'll investigate them later:

- https://github.com/JulienRioux/in-browser-ML-React-ml5js
- https://www.npmjs.com/package/image-downloader
- https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
- https://github.com/kriasoft/react-starter-kit

What need to be done  (in sudo code):

1. First, count all the words from the page (of the book) targeted

2. Second, run a loop that will do the same action every X minutes (number of pages?). This action will start from an input (the word) and will create a set of actions. These are the actions:

   1. From the word of the page targeted, launch a google Image request. Take the first image link, then write it into a file directory.

      1. Here, I'll then need a link to image NPM.

   2. Once the image is saved, used the ml5 classifier to guess the image. Once a predication will be made, I'll save the first predication of the image into a file/txt.txt directory.

      1. Here, I'll use the fs built-in package.

   3. Once the text is in the file/txt.txt directory, upload both the image and the text from the server to the client using loops.

      1. For the image, should I use the image itself or a link to the original image?




