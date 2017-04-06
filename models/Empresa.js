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
			if (_dados.telefones) this.telefones = _dados.telefones;
			if (_dados.emails) this.emails = _dados.emails
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
		try {
			/*Pega instancia do firebase*/
			var database = firebase.database();
			/*Cria uma nova chave para o objeto*/
			var newEmpresaKey = firebase.database().ref().child('empresas').push().key;
			/*Salva os dados no firebase, retornando uma promise*/
			return firebase.database().ref('empresas/' + newEmpresaKey).set(this);
		} catch (err) {
			return new Promise(
				function (resolve, reject) {
					reject(err)
				}
			);
		}
	}


}
