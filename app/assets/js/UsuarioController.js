var UsuarioController = {
    editar: function (uid) {
        let usuario = Usuarios[uid];

        $('#tituloModalUsuario').html('Editar usuário');
        $('#btnSalvaUsuario').html('Salvar');
        $('#formUsuario').unbind('submit');

        //preenche o nome
        $('#nomeUsuario').val(usuario.nome);
        //preenche o email
        $('#emailUsuario').val(usuario.email).prop('disabled', true);

        //seleciona o tipo do usuario
        $('#tipoUsuario').val(usuario.tipo).change();

        //preenche select das empresas
        $("#empresaUsuario").html('');
        $("#empresaUsuario").append(
            $('<option/>')
                .text("Nenhuma empresa selecionada")
                .attr('selected', true)
                .attr('disabled', true)
        );
        $.map(Empresas, function (n, i) {
            if (typeof n == 'object' && n) {
                if (usuario.empresas.indexOf(n.uid) >= 0) {
                    $("#empresaUsuario").append(
                        $('<option/>')
                            .attr('value', n.uid)
                            .text(n.nomeFantasia)
                            .attr('selected', true)
                    );
                } else {
                    $("#empresaUsuario").append(
                        $('<option/>')
                            .attr('value', n.uid)
                            .text(n.nomeFantasia)
                    );
                }
            }
        });
        $('select').material_select();
        //adiciona evento para quando enviar o formulario
        $('#formUsuario').submit(function (event) {
            event.preventDefault();
            //serializa o form
            var unindexed_array = $(this).serializeArray();
            var _dados = {};
            _dados.empresas = [];
            $.map(unindexed_array, function (n, i) {
                if (n['name'] == 'empresaUsuario') {
                    _dados.empresas.push(n['value']);
                }
                else {
                    _dados[n['name']] = n['value'];
                }
            });

            if (_dados.nomeUsuario != "") usuario.nome = _dados.nomeUsuario;
            if (_dados.tipoUsuario != "") usuario.tipo = _dados.tipoUsuario;
            // 		if (_dados.telefones) usu.telefones = _dados.telefones;
            //relacionamento com empresas
            //verifica as empresas que precisam ser adicionadas
            let add = _dados.empresas.diff(usuario.empresas);
            for (let i = 0; i < add.length; i++) {
                usuario.addEmpresa(add[i]);
            }
            //verifica as empresas que precisam ser excluidas
            let del = usuario.empresas.diff(_dados.empresas);
            for (let i = 0; i < del.length; i++) {
                usuario.removeEmpresa(del[i]);
            }
            usuario.save()
                .then(function () {
                    console.log('ok');
                    $('#modalUsuario').modal('close');
                    return false;
                })
                .catch(function (err) {
                    console.log(err);
                    $('#modalUsuario').modal('close');
                    return false;
                });
            return false;
        });
        $('#modalUsuario').modal('open');
    },

    novo: function (event) {
        // Get all the forms elements and their values in one step

        var unindexed_array = $(this).serializeArray();
        var _dados = {};
        _dados.empresas = [];

        $.map(unindexed_array, function (n, i) {
            if (n['name'] == 'empresaUsuario') {
                _dados.empresas.push(n['value']);
            }
            else {
                _dados[n['name']] = n['value'];
            }
        });

        var usu = {};
        if (_dados.emailUsuario != "") usu.email = _dados.emailUsuario;
        if (_dados.nomeUsuario != "") usu.nome = _dados.nomeUsuario;
        if (_dados.tipoUsuario != "") usu.tipo = _dados.tipoUsuario;
        // 		if (_dados.telefones) usu.telefones = _dados.telefones;
        //relacionamento com empresas
        if (_dados.empresas) usu.empresas = _dados.empresas;
        else usu.empresas = [];

        // if (_dados.uid) usu.uid = _dados.uid;

        console.log(usu);

        new Usuario(usu)
            .then(function () {
                alert("Usuário criado e nova senha solicitada");
            })
            .catch(function (err) {
                alert(err);
            });
        return false;
    },

    mostraModalNovo: function () {
        $('#tituloModalUsuario').html('Cadastrar usuário');
        $('#btnSalvaUsuario').html('Cadastrar');
        $('#formUsuario').unbind('submit');
        $('#formUsuario').submit(UsuarioController.novo);

        $('#emailUsuario').val('').prop('disabled', false);
        $('#nomeUsuario').val('');
        //preenche select das empresas
        $("#empresaUsuario").html('');
        $("#empresaUsuario").append(
            $('<option/>')
                .text("Selecione")
                .attr('selected', true)
                .attr('disabled', true)
        );
        $.map(Empresas, function (n, i) {
            if (typeof n == 'object' && n) {
                $("#empresaUsuario").append(
                    $('<option/>')
                        .attr('value', n.uid)
                        .text(n.nomeFantasia)
                );
            }
        });
        $('select').material_select();
    }
};


Usuarios.callbackAdded = function (usuario) {
    var newCard = "<div id=div-" + usuario.uid + " class=\"col s12 m4 l3\">" +
        "<div class=\"card z-depth-3\">" +
        "<div class=\"card-content\">" +
        "<a class=\"dropdown-button btn-floating waves-effect waves-light right red \" data-activates=\"dropdown-" + usuario.uid + "\"><i class=\"material-icons\">more_vert</i></a>" +
        "<ul id=\"dropdown-" + usuario.uid + "\" class=\"dropdown-content\"> " +
        "<li><a href=\"javascript:void(0);\" onclick=\"UsuarioController.editar('" + usuario.uid + "');\">Editar</a></li>" +
        "<li><a href=\"javascript:void(0);\">Alterar email</a></li>" +
        "<li><a href=\"javascript:void(0);\">Redefinir senha</a></li>" +
        "<li><a href=\"javascript:void(0);\">Inativar</a></li>" +
        "<li><a href=\"javascript:void(0);\">Excluir</a></li>" +
        "</ul>" +
        "<h6>" + usuario.nome + "</h6>" +
        "<p class=\"grey-text\">" + usuario.email + "</p>" +
        "<p class=\"grey-text\">" + usuario.tipo + "</p>" +
        "</div>" +
        "</div>" +
        "</div>";

    $('#painelUsuarios').append(newCard);

    $('.dropdown-button').dropdown({
        hover: true,
        constrainWidth: false,
        gutter: 0,
        belowOrigin: false,
        alignment: 'right'
    });

}

Usuarios.callbackChanged = function (usuario) {
    var newCard = "<div id=div-" + usuario.uid + " class=\"col s12 m4 l3\">" +
        "<div class=\"card z-depth-3\">" +
        "<div class=\"card-content\">" +
        "<a class=\"dropdown-button btn-floating waves-effect waves-light right red \" data-activates=\"dropdown-" + usuario.uid + "\"><i class=\"material-icons\">more_vert</i></a>" +
        "<ul id=\"dropdown-" + usuario.uid + "\" class=\"dropdown-content\"> " +
        "<li><a href=\"javascript:void(0);\" onclick=\"UsuarioController.editar('" + usuario.uid + "');\">Editar</a></li>" +
        "<li><a href=\"javascript:void(0);\">Alterar email</a></li>" +
        "<li><a href=\"javascript:void(0);\">Redefinir senha</a></li>" +
        "<li><a href=\"javascript:void(0);\">Inativar</a></li>" +
        "<li><a href=\"javascript:void(0);\">Excluir</a></li>" +
        "</ul>" +
        "<h6>" + usuario.nome + "</h6>" +
        "<p class=\"grey-text\">" + usuario.email + "</p>" +
        "<p class=\"grey-text\">" + usuario.tipo + "</p>" +
        "</div>" +
        "</div>" +
        "</div>";

    $('#div-' + usuario.uid).replaceWith(newCard);

    $('.dropdown-button').dropdown({
        hover: true,
        constrainWidth: false,
        gutter: 0,
        belowOrigin: false,
        alignment: 'right'
    });

}

Usuarios.callbackRemoved = function (uid) {
    console.log('removendo: ' + uid);
    $('#div-' + uid).remove();
}
