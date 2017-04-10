Modelos do projeto<br/>
Cada modelo fornece dois recursos:<br/>
1. Uma classe com o mesmo nome do arquivo<br/>
    Ao instanciar uma nova classe, os dados são persistidos no Firebase<br/>
    A classe tem um método .save(), que ao ser invocado retorna uma promise vazia indicando que a operação foi bem sucessida.<br/>

2. Um objeto global com o nome do arquivo no plural<br/>
    O objeto global possui a lista de todos os objetos salvos no Firebase<br/>
    Cada obejto possui três observador que podem ser configurados para quando um nó é inserido, alterado ou excluído.<br/>
<br/>
O arquivo exemplos.js possui exemplos de uso dos modelos.<br/>