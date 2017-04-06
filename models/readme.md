Modelos do projeto
Cada modelo fornece dois recursos:
1. Uma classe com o mesmo nome do arquivo
    Ao instanciar uma nova classe, os dados são persistidos no Firebase
    A classe tem um método .save(), que ao ser invocado retorna uma promise vazia indicando que a operação foi bem sucessida.

2. Um objeto global com o nome do arquivo no plural
    O objeto global possui a lista de todos os objetos salvos no Firebase
    Cada obejto possui três observador que podem ser configurados para quando um nó é inserido, alterado ou excluído.

O arquivo exemplos.js possui exemplos de uso dos modelos.