module.exports = {
  bail: true, //Faz com que os testes parem assim que seja encontrado um erro
  coverageProvider: "v8",

  testMatch: [
    "<rootDir>/src/**/*.spec.js" //Todos os arquivos dentro da pasta src do projeto com a extensão .spec.js serão rodados como testes
  ],
}