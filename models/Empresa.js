class Empresa {
	constructor(_dados) {
		try {
			if (_dados.nomeFantasia) this.nomeFantasia = _dados.nomeFantasia;
			if (_dados.razaoSocial) this.razaoSocial = _dados.razaoSocial;
			if (_dados.cnpj) this.cnpj = _dados.cnpj;
			if (_dados.inscricaoEstadual) this.inscricaoEstadual = _dados.inscricaoEstadual;
			if (_dados.inscricaoMunicipal) this.inscricaoMunicipal = _dados.inscricaoMunicipal;
			if (_dados.endereco) this.endereco = _dados.endereco;
			if (_dados.telefones) this.telefones = _dados.telefones;
			if (_dados.emails) this.emails = _dados.emails
			//campos de controle
			this.ativo = true;
			if (_dados.createdAt) this.createdAt = _dados.createdAt;
			else this.createdAt = new Date().getTime();

			//relacionamento com usuarios
			if (_dados.usuarios) this.usuarios = _dados.usuarios;
			else this.usuarios = [];

			if (_dados.uid) {
				this.uid = _dados.uid;
			}
			else {
				this.uid = firebase.database().ref().child('empresas').push().key;
				this.save();
			}
		}
		catch (err) {
			console.log(err);
		}
	}

	save() {
		let empresa = this;
		try {

			// /*Pega instancia do firebase*/
			// var database = firebase.database();
			// /*Cria uma nova chave para o objeto*/
			// var newEmpresaKey = empresa.uid
			// if (newEmpresaKey == undefined) {
			// 	newEmpresaKey = firebase.database().ref().child('empresas').push().key;
			// } else {
			// 	empresa.updatedAt = new Date().getTime();
			// }
			// /*Salva os dados no firebase, retornando uma promise void*/
			// //var oldEmpresaKey = empresa.uid;
			// /*Apaga chave para não salvar */
			// //delete empresa.uid;

			if (empresa.uid) empresa.updatedAt = new Date().getTime();

			// return firebase.database().ref('empresas/' + newEmpresaKey).set(empresa,
			return firebase.database().ref('empresas/' + empresa.uid).set(empresa,
				function (err) {
					if (err == null) {
						//empresa.uid = newEmpresaKey;
					} else {
						//empresa.uid = oldEmpresaKey;
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
	addUsuario(uid) {
		if (this.usuarios.indexOf(uid) == -1) {
			this.usuarios.push(uid);
			Usuarios[uid].addEmpresa(this.uid);
			this.save();
		}
	}
	removeUsuario(uid) {
		if (this.usuarios.indexOf(uid) > -1) {
			this.usuarios.splice(this.usuarios.indexOf(uid), 1);
			Usuarios[uid].removeEmpresa(this.uid);
			this.save();
		}
	}
}


var Empresas = {
	callbackAdded: null,
	callbackChanged: null,
	callbackRemoved: null,
	init: function () {
		//Adiciona observadores ao nó no firebase para manter a lista de empresas atualizada
		firebase.database().ref('empresas').on('child_added', function (dados) {
			Empresas[dados.key] = new Empresa(dados.val());
			Empresas[dados.key].uid = dados.key;
			if (typeof Empresas.callbackAdded == "function") Empresas.callbackAdded(Empresas[dados.key]);
		});

		firebase.database().ref('empresas').on('child_changed', function (dados) {
			Empresas[dados.key] = new Empresa(dados.val());
			Empresas[dados.key].uid = dados.key;
			if (typeof Empresas.callbackChanged == "function") Empresas.callbackChanged(Empresas[dados.key]);
		});

		firebase.database().ref('empresas').on('child_removed', function (dados) {
			delete Empresas[dados.uid];
			if (typeof Empresas.callbackRemoved == "function") Empresas.callbackRemoved(dados);
		});
	}
};
Empresas.init();