var app = {
    initialize: function() {
        /*$('#preloaderCarregando').toggleClass('hide');
        $('#painelLogin').toggleClass('hide');*/

        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens
        });
        //$('.button-collapse').sideNav('show');

        $('.modal').modal({
            dismissible: false
        });

        $(".dropdown-button").dropdown({
            hover: true,
            constrainWidth: false,
            gutter: 0,
            belowOrigin: false,
            alignment: 'right'
        });

        $('.tooltipped').tooltip({
            delay: 50
                //position: 'top'
        });

        $('select').material_select();

        // Initialize Firebase
        app.config = {
            apiKey: "AIzaSyDmTM3FMbTk9Agvb8A7h3slNcZ_TD8mW1A",
            authDomain: "optativa-4f19a.firebaseapp.com",
            databaseURL: "https://optativa-4f19a.firebaseio.com",
            projectId: "optativa-4f19a",
            storageBucket: "optativa-4f19a.appspot.com",
            messagingSenderId: "675752807270"
        };

        firebase.initializeApp(app.config);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("Está logado");
                $('#preloaderCarregando').addClass('hide');
                $('#bg').addClass('hide');
                $('#conteudo').removeClass('hide');

                Usuarios.findOne(user.uid).then(function(usuario) {
                    $('.usrLogadoMenu').html('<i class="material-icons left">person</i>' + usuario.nome);
                }).catch(function(err) {
                    console.log(err);
                });
            }
            else {
                console.log("Não está logado");
                $('#preloaderCarregando').addClass('hide');
                $('#bg').removeClass('hide');
                $('#conteudo').addClass('hide');
                $('#painelLogin').removeClass('hide');
            }
        });

        //EVENT LISTENERS
        //login
        $(".inputLogin").keypress(function() {
            if (event.keyCode == 13) {
                app.login()
            }
        });
        $("#btnLogin").click(function() {
            app.login()
        });
        //logout
        $("#usrLogoutMenu").click(function() {
           app.logout(); 
        });
        //redefinir senha
        $("#btnRedefinirSenha").click(function() {
            app.redefinirSenha();
        });
        //cadastrar usuário
        $("#btnNovoUsuario").click(function(){
            UsuarioController.mostraModalNovo();
        });
    },

    login: function() {
        $('#mensagem').html("");
        var email = $('#emailLogin').val();
        var password = $('#senhaLogin').val();

        firebase.auth().signInWithEmailAndPassword(email, password).then(
            //sucesso
            function() {
                console.log("Logado");
            },
            //erro
            function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email') {
                    app.mensagem('Email ou senha incorretos', 'error');
                }
                else if (errorCode === 'auth/user-not-found') {
                    app.mensagem('Email não cadastrado', 'error');
                }
                else if (errorCode === 'auth/user-disabled') {
                    app.mensagem('Esta conta foi desativada', 'error');
                }
                console.log(error);
            });
        //https://firebase.google.com/docs/auth/web/manage-users 
    },

    logout: function() {
        firebase.auth().signOut().then(function() {
            console.log("Desconectado");
        }, function(error) {
            console.log("Erro ao desconectar");
        });
    },

    redefinirSenha: function() {
        $('#mensagem').html("");
        var auth = firebase.auth();
        var emailAddress = $('#emailRecuperarSenha').val();

        auth.sendPasswordResetEmail(emailAddress).then(function() {
            app.mensagem('Um email foi enviado para <i>' + emailAddress + '</i>', 'success');
        }, function(error) {
            app.mensagem(error, 'error');
        });
        $('#modalRecuperarSenha').modal('close');
    },

    mensagem: function(msg, status) {
        if (status === 'error') {
            var cor = "red lighten-1";
        }
        else if (status === 'success') {
            var cor = "green lighten-1";
        }

        $('#mensagem').html(
            '<div class="chip ' + cor + ' white-text">' + msg + '</div>'
        );
    }
};
