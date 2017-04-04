class Empresa {

    // constructor(_nomeFantasia, _razaoSocial, _cnpj, _inscricaEstadual, _inscricaoMunicipal, _endereco, _telefones, _emails) {
    constructor(_dados){
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
            for (var i = 0; i < _emails.length; i++) {
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
        alert('save');

        // Cria uma chave para a empresa
        var newEmpresaKey = firebase.database().ref().child('empresas').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + newPostKey] = postData;
        updates['/user-posts/' + uid + '/' + newPostKey] = postData;

        return firebase.database().ref().update(updates);
    }
}
