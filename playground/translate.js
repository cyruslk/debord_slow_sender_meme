const translate = require('translate');

translate.engine = 'yandex';
translate.key = 'trnsl.1.1.20181226T231450Z.b85c21c47b517717.9602da66274a277a79a7f77f67dfe570e7481d55';

translate('Hello world', 'es').then(text => {
  console.log(text);  // Hola mundo
});
