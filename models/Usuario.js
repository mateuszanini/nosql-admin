class Usuario {
	constructor(_dados) {
		if (_dados.email) this.email = _dados.email;
		else throw "Informe ao menos o email!";
		if (_dados.nome) this.nome = _dados.nome;
		if (_dados.tipo) this.tipo = _dados.tipo;
		else this.tipo = "operador";
		if (_dados.telefones) this.telefones = _dados.telefones;
		//campos de controle
		this.ativo = true;
		if (_dados.createdAt) this.createdAt = _dados.createdAt;
		else this.createdAt = new Date().getTime();

		//relacionamento com empresas
		if (_dados.empresas) this.empresas = _dados.empresas;
		else this.empresas = [];
		if (_dados.uid) this.uid = _dados.uid;
		//se já existe um uid, significa que o usuário já foi criado no firebase
		// e o objeto está sendo criado pelos observadores do nó usuarios
		if (this.uid) return;

		let usuario = this;
		firebase.auth().createUserWithEmailAndPassword(this.email, guid())
			.then(function (user) {
				usuario.uid = user.uid;
				usuario.save()
					.then(function () {
						firebase.auth().sendPasswordResetEmail(usuario.email);
					})
					.catch(function (err) {
						alert(err);
					});
			})
			.catch(function (error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				if (errorCode == 'auth/email-already-in-use') {
					alert('O Email já está em uso');
				}
				if (errorCode == 'auth/invalid-email') {
					alert('O Email é inválido');
				}
				if (errorCode == 'auth/operation-not-allowed') {
					alert('Operação não permitida');
				}
				console.log(error);
			});
	}

	save() {
		let usuario = this;
		if (usuario.uid) usuario.updatedAt = new Date().getTime();
		try {
			return firebase.database().ref().child('usuarios').child(usuario.uid).set(usuario,
				function (err) {
					if (err == null) {

					} else {

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
	addEmpresa(uid){
		if(this.empresas.indexOf(uid)==-1){
			this.empresas.push(uid);
			Empresas[uid].addUsuario(this.uid);
			this.save();
		}
	}
	removeEmpresa(uid){
		if(this.empresas.indexOf(uid)>-1){
			this.empresas.splice(this.empresas.indexOf(uid),1);
			Empresas[uid].removeUsuario(this.uid);
			this.save();
		}
	}
}

var Usuarios = {
	callbackAdded: null,
	callbackChanged: null,
	callbackRemoved: null,
	init: function () {
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
			delete Usuarios[dados.uid];
			if (typeof Usuarios.callbackRemoved == "function") Usuarios.callbackRemoved(dados);
		});
	}
};
Usuarios.init();