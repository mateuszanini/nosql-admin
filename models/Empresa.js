class Empresa {

    // constructor(_nomeFantasia, _razaoSocial, _cnpj, _inscricaEstadual, _inscricaoMunicipal, _endereco, _telefones, _emails) {
    constructor(_dados) {
        try {
            if (_dados.nomeFantasia) this.nomeFantasia = _dados.nomeFantasia;
            if (_dados.razaoSocial) this.razaoSocial = _dados.razaoSocial;
            if (_dados.cnpj) this.cnpj = _dados.cnpj;
            if (_dados.inscricaEstadual) this.inscricaEstadual = _dados.inscricaEstadual;
            if (_dados.inscricaoMunicipal) this.inscricaoMunicipal = _dados.inscricaoMunicipal;
            if (_dados.endereco) this.endereco = new Endereco(_dados.endereco);
            if (_dados.telefones) {
                this.telefones = [];
                for (var i = 0; i < _dados.telefones.length; i++) {
                    this.telefones.push(new Telefone(_dados.telefones[i]))
                }
            }
            if (_dados.emails) {
                this.emails = [];
                for (var i = 0; i < _dados.emails.length; i++) {
                    this.emails.push(new Email(_dados.emails[i]))
                }
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
        var saida = '{';
        if (this.nomeFantasia) saida += "\"nomeFantasia\":\"" + this.nomeFantasia + "\"";
        if (this.razaoSocial) saida += ",\"razaoSocial\":\"" + this.razaoSocial + "\"";
        if (this.cnpj) saida += ",\"cnpj\":\"" + this.cnpj + "\"";
        if (this.inscricaEstadual) saida += ",\"inscricaEstadual\":\"" + this.inscricaEstadual + "\"";
        if (this.inscricaoMunicipal) saida += ",\"inscricaoMunicipal\":\"" + this.inscricaoMunicipal + "\"";
        if (this.endereco) saida += ",\"endereco\":" + JSON.stringify(this.endereco);
        if (this.telefones) {
            saida += ",\"telefones\":{"
            for (var i = 0; i < this.telefones.length; i++) {
                saida += "\"" + this.telefones[i].uid + "\":\"" + this.telefones[i].numero + "\",";
            }
            saida = saida.slice(0, -1);
            saida += "}";
        }
        if (this.emails) {
            saida += ",\"emails\":{"
            for (var i = 0; i < this.emails.length; i++) {
                saida += "\"" + this.emails[i].uid + "\":\"" + this.emails[i].email + "\",";
            }
            saida = saida.slice(0, -1);
            saida += "}";
        }

        saida += ",\"ativo\":" + this.ativo;
        saida += ",\"createdAt\":" + this.createdAt;
        if (this.updatedAt) saida += ",\"updatedAt\":" + this.updatedAt;

        saida += "}";

        console.log(saida);

       // var newEmpresaKey = firebase.database().ref().child('empresas').push().key;

        // // Write the new post's data simultaneously in the posts list and the user's post list.
        // var updates = {};
        // updates['/posts/' + newPostKey] = postData;
        // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

        // return firebase.database().ref().update(updates);
    }


}
