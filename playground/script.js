const array = [];

i=0;
while(i < 100){
    var string = `tesseract -l fra ${i}.png ${i} |`;
    console.log(string);
    i++
}
