class Empresa {

    // constructor(_nomeFantasia, _razaoSocial, _cnpj, _inscricaEstadual, _inscricaoMunicipal, _endereco, _telefones, _emails) {
    constructor(_dados) {
        try {
            this.nomeFantasia = _dados.nomeFantasia;
            this.razaoSocial = _dados.razaoSocial;
            this.cnpj = _dados.cnpj;
            this.inscricaEstadual = _dados.inscricaEstadual;
            this.inscricaoMunicipal = _dados.inscricaoMunicipal;
            this.endereco = new Endereco(_dados.endereco);
            this.telefones = [];
            for (var i = 0; i < _dados.telefones.length; i++) {
                this.telefones.push(new Telefone(_dados.telefones[i]))
            }
            this.emails = [];
            for (var i = 0; i < _dados.emails.length; i++) {
                this.emails.push(new Email(_dados.emails[i]))
            }
            //campos de controle
            this.ativo = true;
            this.createdAt = new Date().getTime();
            this.updatedAt = null;

            //relacionamentos
        }
        catch (err) {
            console.log(err);
        }


    }

    save() {
        // {
        //   "nomeFantasia":"ifc videira",
        //   "razaoSocial":"IFC",
        //   "cnpj":234565432,
        //   "endereco":
        //   {
        //   "logradouro":"rua sem saida",
        //   "numero":453,
        //   "cep":"89.560-000"

        //   },
        //   "telefones": {
        //     "-KgtVnBA32Po702fV4EQ":"49 91347498",
        //     "-KgtVnBA32Po702fV4ER":"49 3533 4043"
        //   },
        //   "emails":{
        //     "-KgtVnBB1HtCX59KY6mw":"tiago.possato@yahoo.com.br"
        //   },
        //   "ativo": true,
        //   "createdAt":1491318551308,
        //   "updatedAt":null

        var saida = JSON.stringify(this);
        saida = saida.replace('[', '{');
        saida = saida.replace(']', '}');

        console.log(saida);
        // Cria uma chave para a empresa
        // var newEmpresaKey = firebase.database().ref().child('empresas').push().key;

        // // Write the new post's data simultaneously in the posts list and the user's post list.
        // var updates = {};
        // updates['/posts/' + newPostKey] = postData;
        // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

        // return firebase.database().ref().update(updates);
    }


}
