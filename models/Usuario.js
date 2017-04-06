class Usuario {
	constructor(_dados) {
		try {
			if (_dados.nome) this.nome = _dados.nome;
			if (_dados.tipo) this.tipo = _dados.tipo;
			else this.tipo = "operador";
			if (_dados.telefones) this.telefones = _dados.telefones;
			//campos de controle
			this.ativo = true;
			if (_dados.createdAt) this.createdAt = _dados.createdAt;
			else this.createdAt = new Date().getTime();
		}
		catch (err) {
			console.log(err);
		}
	}

	save() {
		let usuario = this;
		try {
			/*Pega instancia do firebase*/
			var database = firebase.database();
			/*Cria uma nova chave para o objeto*/
			var newUsuarioKey = usuario.key
			if (newUsuarioKey == undefined) {
				newUsuarioKey = firebase.database().ref().child('usuarios').push().key;
			} else {
				usuario.updatedAt = new Date().getTime();
			}
			/*Salva os dados no firebase, retornando uma promise void*/
			var oldUsuarioKey = usuario.key;
			/*Apaga chave para não salvar */
			delete usuario.key;
			return firebase.database().ref('usuarios/' + newUsuarioKey).set(usuario,
				function (err) {
					if (err == null) {
						usuario.key = newUsuarioKey;
					} else {
						usuario.key = oldUsuarioKey;
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

var Usuarios = {}

firebase.database().ref('usuarios').on('child_added', function (dados) {
	Usuarios[dados.key] = new Usuario(dados.val());
	Usuarios[dados.key].key = dados.key;
});

firebase.database().ref('usuarios').on('child_changed', function (dados) {
	Usuarios[dados.key] = new Usuario(dados.val());
	Usuarios[dados.key].key = dados.key;
	console.log(dados.val());
});

firebase.database().ref('usuarios').on('child_removed', function (dados) {
	delete Usuarios[dados.key];
	console.log(dados.val());
});