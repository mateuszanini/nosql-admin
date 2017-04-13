var UsuarioController = {
    editar: function (uid) {
        user = Usuarios[uid];

        $('#tituloModalUsuario').html('Editar usuário');
        $('#btnSalvaUsuario').html('Salvar');
        $('#formUsuario').unbind('submit');
        $("#empresaUsuario").html('');
        //preenche select das empresas
        $.map(Empresas, function (n, i) {
            if (typeof n == 'object' && n) {
                if (user.empresas.indexOf(n.uid) >= 0) {
                    $("#empresaUsuario").append(
                        $('<option/>')
                            .attr('value', n.uid)
                            .text(n.uid)
                            .attr('selected', true)
                    );
                } else {
                    $("#empresaUsuario").append(
                        $('<option/>')
                            .attr('value', n.uid)
                            .text(n.uid)
                    );
                }
            }
        });
        $('select').material_select();
        $('#formUsuario').submit(function (event) {
            console.log(user);
            return false;
        });
        $('#modalUsuario').modal('open');

    },

    novo: function (event) {
        // Get all the forms elements and their values in one step

        var unindexed_array = $(this).serializeArray();
        // console.log(unindexed_array);
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

        // console.log(_dados);
        var usu = {};

        if (_dados.emailUsuario != "") usu.email = _dados.emailUsuario;
        else alert("Informe ao menos o email!");

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
                location.reload();
            })
            .catch(function (err) {
                console.log(err);
            });

        event.preventDefault();
    },

    mostraModalNovo: function () {
        $('#tituloModalUsuario').html('Cadastrar usuário');
        $('#btnSalvaUsuario').html('Cadastrar');
        $('#formUsuario').unbind('submit');
        $('#formUsuario').submit(UsuarioController.novo);
        
        //preenche select das empresas
        $("#empresaUsuario").html('');
        $.map(Empresas, function (n, i) {
            if (typeof n == 'object' && n) {
                $("#empresaUsuario").append(
                    $('<option/>')
                        .attr('value', n.uid)
                        .text(n.uid)
                );
            }
        });
        $('select').material_select();
    }
};


Usuarios.callbackAdded = function (usuario) {
    /*
    newRow = '<tr id=\"' + usuario.uid + '\" class=\"text-center\" style = \" cursor: pointer; cursor: hand;\" </tr>';
    var newRow = $(newRow);
    var cols = "";
    cols += '<td>' + usuario.nome + '</td>';
    cols += '<td>' + usuario.email + '</td>';
    cols += '<td>' + usuario.tipo + '</td>';
    newRow.append(cols);
    newRow.click(function() {
        UsuarioController.editar(usuario.uid);
    });
    $('#tb-usuarios tr:last').after(newRow);
*/

    var newCard = "<div class=\"col s12 m4 l3\">" +
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
    newRow = '<tr id=\"' + usuario.uid + '\" class=\"text-center\" style = \" cursor: pointer; cursor: hand;\">';
    var newRow = $(newRow);
    var cols = "";
    cols += '<td>' + usuario.nome + '</td>';
    cols += '<td>' + usuario.email + '</td>';
    cols += '<td>' + usuario.tipo + '</td></tr>';
    newRow.append(cols);
    newRow.click(function () {
        UsuarioController.editar(usuario.uid);
    });
    $("#tb-usuarios tr#" + usuario.uid).replaceWith(newRow);
}

Usuarios.callbackRemoved = function (uid) {
    console.log('removendo: ' + uid);
    $("tr#" + uid).remove();
}
