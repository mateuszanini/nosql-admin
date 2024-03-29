class Empresa {
	constructor(_dados) {
		try {
			if (_dados.nomeFantasia) this.nomeFantasia = _dados.nomeFantasia;
			if (_dados.razaoSocial) this.razaoSocial = _dados.razaoSocial;
			if (_dados.cnpj) this.cnpj = _dados.cnpj;
			if (_dados.inscricaoEstadual) this.inscricaoEstadual = _dados.inscricaoEstadual;
			if (_dados.inscricaoMunicipal) this.inscricaoMunicipal = _dados.inscricaoMunicipal;
			if (_dados.telefone) this.telefone = _dados.telefone;
			if (_dados.email) this.email = _dados.email;

			if (_dados.endereco) {
				this.endereco = {};
				if (_dados.endereco.logradouro) this.endereco.logradouro = _dados.endereco.logradouro;
				if (_dados.endereco.numero) this.endereco.numero = _dados.endereco.numero;
				if (_dados.endereco.complemento) this.endereco.complemento = _dados.endereco.complemento;
				if (_dados.endereco.bairro) this.endereco.bairro = _dados.endereco.bairro;
				if (_dados.endereco.cep) this.endereco.cep = _dados.endereco.cep;
				if (_dados.endereco.cidade) this.endereco.cidade = _dados.endereco.cidade;
				if (_dados.endereco.estado) this.endereco.estado = _dados.endereco.estado;
				if (_dados.endereco.pais) this.endereco.pais = _dados.endereco.pais;
			}

			//campos de controle
			if (_dados.ativo != undefined) {
				this.ativo = _dados.ativo;
			}
			else this.ativo = true;
			if (_dados.createdAt) this.createdAt = _dados.createdAt;
			else this.createdAt = new Date().getTime();

			//relacionamento com usuarios
			if (_dados.usuarios) this.usuarios = _dados.usuarios;
			else this.usuarios = {};

			if (_dados.uid) {
				this.uid = _dados.uid;
			}
			else {
				this.uid = firebase.database().ref().child('empresas').push().key;
				let e = this;
				return new Promise(
					function(resolve, reject) {
						e.save().then(function() {
							resolve();
						}).catch(function(err) {
							reject(err);
						});
					}
				);
			}
		}
		catch (err) {
			return new Promise(
				function(resolve, reject) {
					reject(err)
				}
			);
		}
	}

	save() {
		let empresa = this;
		try {
			if (empresa.uid) empresa.updatedAt = new Date().getTime();
			return firebase.database().ref('empresas/' + empresa.uid).set(empresa);
		}
		catch (err) {
			return new Promise(
				function(resolve, reject) {
					reject(err)
				}
			);
		}
	}
	addUsuario(uid) {
		if (this.usuarios[uid] == undefined) {
			if (Usuarios[uid]) {
				this.usuarios[uid] = true;
				Usuarios[uid].addEmpresa(this.uid);
				this.save();
			}
			else {
				console.error("Usuário não encontrado!");
			}
		}
	}
	removeUsuario(uid) {
		if (this.usuarios[uid]) {
			delete this.usuarios[uid];
			Usuarios[uid].removeEmpresa(this.uid);
			this.save();
		}
	}
}


var Empresas = {
	callbackAdded: null,
	callbackChanged: null,
	callbackRemoved: null,
	init: function() {
		usuario = Usuarios[firebase.auth().currentUser.uid];
		if (usuario == undefined) {
			throw "Usuário inválido!";
		}
		if (usuario.tipo == 'admin') {
			//Adiciona observadores ao nó no firebase para manter a lista de empresas atualizada
			firebase.database().ref('empresas').on('child_added', function(dados) {
				Empresas[dados.key] = new Empresa(dados.val());
				Empresas[dados.key].uid = dados.key;
				if (typeof Empresas.callbackAdded == "function") Empresas.callbackAdded(Empresas[dados.key]);
			});

			firebase.database().ref('empresas').on('child_changed', function(dados) {
				Empresas[dados.key] = new Empresa(dados.val());
				Empresas[dados.key].uid = dados.key;
				if (typeof Empresas.callbackChanged == "function") Empresas.callbackChanged(Empresas[dados.key]);
			});

			firebase.database().ref('empresas').on('child_removed', function(dados) {
				delete Empresas[dados.key];
				if (typeof Empresas.callbackRemoved == "function") Empresas.callbackRemoved(dados.key);
			});
		}
		else {
			//Observer ao adicionar novos nós
			firebase.database().ref('usuarios/' + usuario.uid + '/empresas').on('child_added', function(dados) {
				//console.log(dados.key);
				if (dados.val() == false) {
					delete Empresas[dados.key];
					if (typeof Empresas.callbackRemoved == "function") Empresas.callbackRemoved(dados.key);
					return;
				}
				//Quando uma nova empresa é asssociada a um usuário
				//recebe o uid
				//busca empresa no banco
				//insere no objeto de empresas
				Empresas.findOne(dados.key).then(function(empresa) {
					Empresas[empresa.uid] = empresa;
					if (typeof Empresas.callbackAdded == "function") Empresas.callbackAdded(empresa);
				}).catch(function(err) {
					console.log(err);
				});
			});
			//Observer ao editar nós
			firebase.database().ref('usuarios/' + usuario.uid + '/empresas').on('child_changed', function(dados) {
				//console.log(dados.key);
				if (dados.val() == false) {
					delete Empresas[dados.key];
					if (typeof Empresas.callbackRemoved == "function") Empresas.callbackRemoved(dados.key);
					return;
				}
				//Quando um nó é alterado
				//recebe o uid
				//busca empresa no banco
				//altera no objeto de empresas
				Empresas.findOne(dados.key).then(function(empresa) {
					Empresas[empresa.uid] = empresa;
					if (typeof Empresas.callbackChanged == "function") Empresas.callbackAdded(empresa);
				}).catch(function(err) {
					console.log(err);
				});
			});
			//observer ao excluir um nó
			firebase.database().ref('usuarios/' + usuario.uid + '/empresas').on('child_removed', function(dados) {
				//console.log(dados.key);
				delete Empresas[dados.key];
				if (typeof Empresas.callbackRemoved == "function") Empresas.callbackRemoved(dados.key);
			});
		}
	},
	findOne(uid) {
		return new Promise(
			function(resolve, reject) {
				firebase.database().ref('empresas/' + uid).once('value').then(function(_dados) {
					if (!_dados.val()) {
						reject("Nenhuma empresa encontrada!");
					}
					else {
						resolve(new Empresa(_dados.val()));
					}
				}).catch(function(err) {
					reject(err);
				});
			});
	}
};
