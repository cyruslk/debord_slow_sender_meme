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
- https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0

What need to be done  (in pseudo code):

1. First, count all the words from the page (of the book) targeted
2. Second, run a loop that will do the same action every X minutes (number of pages?). This action will start from an input (the word) and will create a set of actions. These are the actions:
   1. From the word of the page targeted, launch a google Image request. Take the first image link, then write it into a file directory.
      1. Here, I'll then need a link to image NPM.
   2. Once the image is saved, used the ml5 classifier to guess the image. Once a prediction will be made, I'll save the first prediction of the image into a file/txt.txt directory.
      1. Here, I'll use the fs built-in package.
   3. Once the text is in the file/txt.txt directory, upload both the image and the text from the server to the client using loops.
      1. For the image, should I use the image itself or a link to the original image?



# 2018-10-27


I came across [this `issue`](https://github.com/ml5js/ml5-library/issues/74) when I was investigating the **ml5-library** package. Basically, this says that the ml5 needs to be run in the browser because it requires the webgl canvas context to work. It's not a big issue but it changes my plan - which was to do all the "heavy" computation on the server-side and then sends a package to the client with the image link and its *classification* only. Consequently, what I'll do is the following:

1. [Wire the server side to a react client app](https://daveceddia.com/create-react-app-express-backend/).
2. Get the image from the server
3. Use it in the ml5 part
4. As soon as the classification is done, write the word in the file system
5. In the meantime, load both the image and its *classification* in the dom.

------

Q1: WHY AM I USING A FILESYSTEM?

A1: Because it's more convenient than setting up a database ;-)

Q2: DO I NEED A SERVER?

A2: I'm not sure yet.

- tesseract can be run in the browser http://tesseract.projectnaptha.com/
- I'm not sure for the `images-scraper` package

------



# 2018-10-28

My pseudo code:

```sudo
// Here, read the file before
// Then, turn the file into a js array
// Then, push the new URL to the array
// Then write the file back
```
Today, I work mostly on the wiring between the ml5 machine learning - that needs to be run on the brower because of webGL - and the server side rendering.

For now, what is done on the projet is the following:

1. From the `db` folder, the server reads the content of the counter.txt (a number).

2. It uses the number to perform the request on google images. It gets the first image of the list. It saves the image in the directory `client/src/img.jpg`. It also saves it links into the `db` folder, in `db/links.txt`. It saves the link with a space after, to be able to quickly run the `split(" ") ` function and converts the .txt file into a JavaScript array of links.

3. It send all the links to the client side using [express](https://github.com/expressjs/express) and its res.send function.

   ```
   app.get('/api/img', (req, res) => {
     res.send({ express: imagesLinks });
   });
   ```

4. In the client side (`client/src/App.js`), ml5 reads the image stored in `client/src/img.jpg`. Once its done, it send its prediction to  the server side code, here

   ```
     sendDataBackToServer = (passedData) => {
     const data = {
          data: passedData
      };
     fetch('/classifier', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json'
          },
        }).then((res) => {
          console.log("successfully sent to db");
        })
      }
   ```

5. In the master's branch, all the links received from the server are stored in the state, mapped, and then displayed on the screen via this code:

```
 const imgs = this.state.response.map((ele, index) => {
     return (
     <img src={ele} key={index} />
     )
```

Stuffs that need to be done:

- [ ] Trigger the server side at a certain interval (number of pages). When both the link and the image are written, (maybe) use `sockets` to launch the client side ml5 code.
  - [ ] (in other words, iNCREMENT THE COUNTER BY ITSELF)
- [x] Isolate the first guess in the prediction package coming from the client (targeting the `,` strings of characters ).
- [x] Write the prediction words to db folder.
- [x] In the meantime (when the computation is happening/not happening), display both the images (on the left of the screen?) and the text (on the right?) coming from the server side doing a filesystem request. What I envision now is a simple ternary render with a `fetch` sending the data from the server to the state storage.
- [ ] As soon as the computation is done, send a `socket` to update the state with the new data. This will refresh the page automatically and display the new word + the new prediction 
- [ ] ***Turn pages*** - when the counter equals the number of words of the page, make the `node-tesseract`
- [ ] Work on the UI (or not)
  - [ ] ~~First jam~~

Stuffs that need to be decided:

- [ ] When will the process start?
   - Numbers of words = numbers of the interval (seconds)? 
   - Numbers of pages from the book = numbers of the interval (seconds)? 
   - Index of the words = numbers of the interval (seconds)? This could be a small project in itself
- [ ] When the user access the page, what appears first? 
  - Do I wait until the processed *image -> word* get sent to the server, written in a file and  sent back to the client? In the meantime a `loading` screen will be displayed (this will be quite long, could be interesting (or very boring)).
  - Or display all the content from the files coming from the backend WHILE doing the computation? Then refresh the page with a `socket.emit()/socket.on();`

Stuffs that need to be fixed:

- [ ] It's only when the prediction is made than the counter should increment


# 2018-10-29


The core functionalities of the bot are done. When I was working on the design of the bot's interface, I realised that google images are interesting but there could be other alternatives.

Other interesting alternatives so far

- Pixabay: https://pixabay.com/fr/

  - https://www.npmjs.com/package/pixabay-api

------

Since the inital text is in French, the outputted text could be in French. I could consequently translate the ml5 classifier in French using a [translation api](https://www.npmjs.com/package/google-translate-api)?