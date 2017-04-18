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
                Usuarios.findOne(user.uid).then(function(usuario) {
                    Usuarios[usuario.uid] = usuario;
                    Empresas.init();
                    Usuarios.init();
                    if (Usuarios[firebase.auth().currentUser.uid].tipo == "operador") {
                        $('#btnNovoUsuario').addClass('hide');
                    }
                    //$('#preloaderCarregando').addClass('hide');
                    app.preloader('close');
                    $('#bg').addClass('hide');
                    $('#conteudo').removeClass('hide');
                    $('.usrLogadoMenu').html('<i class="material-icons left">person</i>' + usuario.nome);
                }).catch(function(err) {
                    var errorCode = err.code;
                    if (errorCode == 'PERMISSION_DENIED') {
                        alert("Usuário desabilitado!");
                        app.logout();
                    }
                    console.log(err);
                });
            }
            else {
                console.log("Não está logado");
                //$('#preloaderCarregando').addClass('hide');
                app.preloader('close');
                $('#bg').removeClass('hide');
                $('#conteudo').addClass('hide');
                $('#painelLogin').removeClass('hide');
            }
        });

        //EVENT LISTENERS
        //login
        $(".inputLogin").keypress(function(event) {
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

        $("#usrLogoutMenuColapsed").click(function() {
            app.logout();
        });

        $("#usrLogadoMenu").click(function() {
            UsuarioController.editarPerfil();
        });

        $("#usrLogadoMenuColapsed").click(function() {
            UsuarioController.editarPerfil();
        });


        //redefinir senha
        $("#btnRedefinirSenha").click(function() {
            app.redefinirSenha();
        });
        //cadastrar usuário
        $("#btnNovoUsuario").click(function() {
            UsuarioController.mostraModalNovo();
        });
        //cadastrar empresa
        $("#btnNovaEmpresa").click(function() {
            EmpresaController.mostraModalNovo();
        });
    },

    preloader: function(status) {
        $('#modalPreloader').modal({
            dismissible: false, // Modal can be dismissed by clicking outside of the modal
            opacity: .5
                /*, // Opacity of modal background
                            inDuration: 300, // Transition in duration
                            outDuration: 200, // Transition out duration
                            startingTop: '40%', // Starting top style attribute
                            endingTop: '50%'*/
        });
        $('#modalPreloader').modal(status);
    },

    login: function() {
        app.preloader('open');
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
                app.preloader('close');
            });
        //https://firebase.google.com/docs/auth/web/manage-users 
    },

    logout: function() {
        app.preloader('open');
        firebase.auth().signOut().then(function() {
            console.log("Desconectado");
            location.reload();
        }, function(error) {
            console.log("Erro ao desconectar");
        });
    },

    redefinirSenha: function() {
        app.preloader('open');
        $('#mensagem').html("");
        var auth = firebase.auth();
        var emailAddress = $('#emailRecuperarSenha').val();

        auth.sendPasswordResetEmail(emailAddress).then(function() {
            app.mensagem('Um email foi enviado para <i>' + emailAddress + '</i>', 'success');
        }, function(error) {
            app.mensagem(error, 'error');
        });
        $('#modalRecuperarSenha').modal('close');
        app.preloader('close');
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
