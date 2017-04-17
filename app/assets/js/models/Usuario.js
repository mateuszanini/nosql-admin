class Usuario {
	constructor(_dados) {
		if (_dados.email) this.email = _dados.email;
		else throw "Informe ao menos o email!";
		if (_dados.nome) this.nome = _dados.nome;
		if (_dados.tipo) this.tipo = _dados.tipo;
		else this.tipo = "operador";
		if (_dados.telefones) this.telefones = _dados.telefones;
		//campos de controle
		if (_dados.ativo != undefined) {
			this.ativo = _dados.ativo;
		}
		else this.ativo = true;
		if (_dados.createdAt) this.createdAt = _dados.createdAt;
		else this.createdAt = new Date().getTime();

		//relacionamento com empresas
		if (_dados.empresas) this.empresas = _dados.empresas;
		else this.empresas = {};
		if (_dados.uid) this.uid = _dados.uid;
		//se já existe um uid, significa que o usuário já foi criado no firebase
		// e o objeto está sendo criado pelos observadores do nó usuarios
		if (this.uid) return;
		let usuario = this;

		return new Promise(
			function (resolve, reject) {
				let secondaryApp = firebase.initializeApp(app.config, 'secondaryApp');
				secondaryApp.auth().createUserWithEmailAndPassword(usuario.email, guid())
					.then(function (user) {
						secondaryApp.auth().signOut();
						usuario.uid = user.uid;
						console.log('Usuario: criado no firebase');
						//salva usuario no nó de controle da aplicação
						usuario.save()
							.then(function () {
								console.log('Usuario: nó inserido database do firebase');
								firebase.auth().sendPasswordResetEmail(usuario.email)
									.then(function () {
										console.log('Usuario: Email para redefinicao de senha enviado');
										//insere usuario no objeto da aplicação
										if (Usuarios[usuario.uid] == undefined) {
											Usuarios[usuario.uid] = usuario;
										}
										//salva o uid do usuario na lista de usuarios de cada empresa
										for (let emp in usuario.empresas) {
											Empresas[emp].addUsuario(usuario.uid);
										}
										resolve();
									}).catch(function (err) {
										reject(err);
									});
							}).catch(function (err) {
								reject(err);
							});
					})
					.catch(function (error) {
						// Handle Errors here.
						var errorCode = error.code;
						var errorMessage = error.message;
						if (errorCode == 'auth/email-already-in-use') {
							reject('O Email já está em uso');
						}
						if (errorCode == 'auth/invalid-email') {
							reject('O Email é inválido');
						}
						if (errorCode == 'auth/operation-not-allowed') {
							reject('Operação não permitida');
						}
						console.log(error);
					});
			});
	}

	save() {
		let usuario = this;
		if (usuario.uid) usuario.updatedAt = new Date().getTime();
		try {
			return firebase.database().ref().child('usuarios').child(usuario.uid).set(usuario);
		}
		catch (err) {
			return new Promise(
				function (resolve, reject) {
					reject(err)
				}
			);
		}
	}
	addEmpresa(uid) {
		if (this.empresas[uid] == undefined) {
			if (Empresas[uid]) {
				this.empresas[uid] = true;
				Empresas[uid].addUsuario(this.uid);
				this.save();
			}
			else {
				console.log("Empresa não encontrada!");
			}
		}
	}
	removeEmpresa(uid) {
		if (this.empresas[uid]) {
			delete this.empresas[uid];
			Empresas[uid].removeUsuario(this.uid);
			this.save();
		}
	}
}

var Usuarios = {
	callbackAdded: null,
	callbackChanged: null,
	callbackRemoved: null,
	init: function (usuario) {
		if (usuario == undefined) {
			throw "Usuário inválido!";
		}
		if (usuario.tipo == 'admin') {
			//Adiciona observadores ao nó no firebase para manter a lista de usuarios atualizada
			firebase.database().ref('usuarios').on('child_added', function (dados) {
				Usuarios[dados.key] = new Usuario(dados.val());
				Usuarios[dados.key].uid = dados.key;
				if (typeof Usuarios.callbackAdded == "function") Usuarios.callbackAdded(Usuarios[dados.key]);
			});

			firebase.database().ref('usuarios').on('child_changed', function (dados) {
				Usuarios[dados.key] = new Usuario(dados.val());
				Usuarios[dados.key].uid = dados.key;
				if (typeof Usuarios.callbackChanged == "function") Usuarios.callbackChanged(Usuarios[dados.key]);
			});
			firebase.database().ref('usuarios').on('child_removed', function (dados) {
				delete Usuarios[dados.key];
				if (typeof Usuarios.callbackRemoved == "function") Usuarios.callbackRemoved(dados.key);
			});
		}
		if (usuario.tipo == 'gerente') {
			//O gerente tem acesso somente aos usuarios das empresas que ele é gerente, então
			//recebe o uid de cada empresa que o gerente tem acesso e busca os usuarios daquela empresa
			firebase.database().ref('usuarios/' + usuario.uid + '/empresas').on('child_added', function (dados) {
				// busca dentro de cada empresa os usuários que estão conectados à ela
				firebase.database().ref('empresas/' + dados.key).once('value').then(function (_dados) {
					for (let usu in _dados.val().usuarios) {
						if (Usuarios[usu] == undefined) {
							Usuarios.findOne(usu).then(function (usuario) {
								if (Usuarios[usu] == undefined) {
									Usuarios[usuario.uid] = usuario;
									if (typeof Usuarios.callbackAdded == "function") Usuarios.callbackAdded(usuario);
								}
							}).catch(function (err) {
								console.log(err);
							});
						}
					}
				}).catch(function (err) {
					console.log("Erro ao buscar os usuarios das empresas.");
					console.log(err);
				});
			});
		}
	},
	findOne(uid) {
		return new Promise(
			function (resolve, reject) {
				firebase.database().ref('usuarios/' + uid).once('value').then(function (_dados) {
					if (!_dados.val()) {
						reject("Nenhum usuário encontrado!");
					}
					else {
						resolve(new Usuario(_dados.val()));
					}
				}).catch(function (err) {
					reject(err);
				});
			});
	}
};