class Empresa {
	constructor(_dados) {
		try {
			if (_dados.nomeFantasia) this.nomeFantasia = _dados.nomeFantasia;
			if (_dados.razaoSocial) this.razaoSocial = _dados.razaoSocial;
			if (_dados.cnpj) this.cnpj = _dados.cnpj;
			if (_dados.inscricaEstadual) this.inscricaEstadual = _dados.inscricaEstadual;
			if (_dados.inscricaoMunicipal) this.inscricaoMunicipal = _dados.inscricaoMunicipal;
			if (_dados.endereco) this.endereco = _dados.endereco;
			if (_dados.telefones) this.telefones = _dados.telefones;
			if (_dados.emails) this.emails = _dados.emails
			//campos de controle
			this.ativo = true;
			if (_dados.createdAt) this.createdAt = _dados.createdAt;
			else this.createdAt = new Date().getTime();

			//this.updatedAt = null;
			//relacionamentos
		}
		catch (err) {
			console.log(err);
		}
	}

	save() {
		let empresa = this;
		try {
			/*Pega instancia do firebase*/
			var database = firebase.database();
			/*Cria uma nova chave para o objeto*/
			var newEmpresaKey = empresa.key
			if (!newEmpresaKey) {
				newEmpresaKey = firebase.database().ref().child('empresas').push().key;
			} else {
				empresa.updatedAt = new Date().getTime();
			}
			/*Salva os dados no firebase, retornando uma promise void*/
			var oldEmpresaKey = empresa.key;
			/*Apaga chave para não salvar */
			delete empresa.key;
			return firebase.database().ref('empresas/' + newEmpresaKey).set(empresa,
				function (err) {
					if (err == null) {
						empresa.key = newEmpresaKey;
					} else {
						empresa.key = oldEmpresaKey;
					}
				});
		} catch (err) {
			return new Promise(
				function (resolve, reject) {
					reject(err)
				}
			);
		}
	}
}

var Empresas = {}

firebase.database().ref('empresas').on('child_added', function (dados) {
	Empresas[dados.key] = new Empresa(dados.val());
	Empresas[dados.key].key = dados.key;
});

firebase.database().ref('empresas').on('child_changed', function (dados) {
	Empresas[dados.key] = new Empresa(dados.val());
	Empresas[dados.key].key = dados.key;
	console.log(dados.val());
});

firebase.database().ref('empresas').on('child_removed', function (dados) {
	delete Empresas[dados.key];
	console.log(dados.val());
});