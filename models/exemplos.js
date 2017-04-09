/**
 * EXEMPLO DE OBERVADOR NO NÓ EMPRESAS
 */

Empresas.callbackAdded = function (empresa) {
  console.log('novo no');
  console.log(empresa);
}

/**
 * EXEMPLO DE CRIAÇÃO DE NOVA EMPRESA
 */
new Empresa({
  nomeFantasia: 'ifc videira',
  razaoSocial: 'IFC',
  cnpj: 234565432,
  endereco: {
    logradouro: 'rua sem saida',
    numero: 453,
    cep: '89.560-000'
  },
  telefones: ['49 91347498', '49 3533 4043'],
  emails: ['tiago.possato@yahoo.com.br']
}).then(function () {
  console.log("Objeto salvo");
}).catch(function (err) {
  console.log("catch");
  console.log(err);
});

/**
 * EXEMPLO DE ALTERAÇÃO DE DADOS
 */
var e = Empresas['-Kh2Rwudgh8JNqvcsaeL'];

e.nomeFantasia = 'IFC Arroio Trinta';

e.save().then(function () {
  console.log("Objeto salvo");
  console.log(e.uid);
}).catch(function (err) {
  console.log("catch");
  console.log(err);
});

new Usuario({
  email: 'astolfo@ntsemail.com'
})
  .then(function () {
    console.log("Usuário criado e nova senha solicitada");
  })
  .catch(function (err) {
    console.log(err);
  });