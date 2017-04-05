$('.button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens
});

$('.button-collapse').sideNav('show');

var app = {
    login: function () {
        $('#mensagem').html("");
        var email = $('#email').val();
        var password = $('#senha').val();

        firebase.auth().signInWithEmailAndPassword(email, password).then(
            //sucesso
            function () {
                console.log("Logado");
                app.verificaLogado();
            },
            //erro
            function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email') {
                    app.mensagem('Email ou senha incorretos', 'error');
                } else if (errorCode === 'auth/user-not-found') {
                    app.mensagem('Email não cadastrado', 'error');
                } else if (errorCode === 'auth/user-disabled') {
                    app.mensagem('Esta conta foi desativada', 'error');
                }
                console.log(error);
            });
        //https://firebase.google.com/docs/auth/web/manage-users 
    },

    logout: function () {
        firebase.auth().signOut().then(function () {
            console.log("Desconectado");
            app.verificaLogado();
        }, function (error) {
            console.log("Erro ao desconectar");
        });
    },

    verificaLogado: function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log("Está logado");
                $('#bg').addClass('hide');
                $('#conteudo').removeClass('hide');
                //var user = firebase.auth().currentUser;
                 $('#usrLogado').html("Conectado como <b>" + user.email + "</b>");
            } else {
                console.log("Não está logado");
                $('#bg').removeClass('hide');
                $('#conteudo').addClass('hide');
            }
        });       
    },

    redefinirSenha: function () {
        $('#mensagem').html("");
        var auth = firebase.auth();
        var emailAddress = $('#emailRecuperarSenha').val();

        auth.sendPasswordResetEmail(emailAddress).then(function () {
            app.mensagem('Um email foi enviado para <i>' + emailAddress + '</i>', 'success');
        }, function (error) {
            app.mensagem(error, 'error');
        });
        $('#modalRecuperarSenha').modal('close');
    },

    mensagem: function (msg, status) {
        if (status === 'error') {
            var cor = "red lighten-1";
        } else if (status === 'success') {
            var cor = "green lighten-1";
        }

        $('#mensagem').html(
            '<div class="chip ' + cor + ' white-text">' + msg + '</div>'
        );
    }
};
