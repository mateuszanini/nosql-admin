var UsuarioController = {
    editar: function (uid) {
        let usuario = Usuarios[uid];

        $('#tituloModalUsuario').html('Editar usuário');
        $('#btnSalvaUsuario').html('Salvar');
        $('#formUsuario').unbind('submit');

        //preenche o nome
        $('#nomeUsuario').val(usuario.nome);
        $('#nomeUsuario').focusin();
        //preenche o email
        $('#emailUsuario').val(usuario.email).prop('disabled', true);
        $('#emailUsuario').focusin();

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
                if (usuario.empresas[n.uid]) {
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
            _dados.empresas = {};
            $.map(unindexed_array, function (n, i) {
                if (n['name'] == 'empresaUsuario') {
                    _dados.empresas[n['value']] = true;
                }
                else {
                    _dados[n['name']] = n['value'];
                }
            });
            if (_dados.nomeUsuario != "") usuario.nome = _dados.nomeUsuario;
            if (_dados.tipoUsuario != "") usuario.tipo = _dados.tipoUsuario;


            // 		if (_dados.telefones) usu.telefones = _dados.telefones;

            //relacionamento com empresas
            //verifica as empresas que precisam ser excluidas
            //transforma os objetos em arrays e verifica a diferença entre eles
            let del = $.map(usuario.empresas, function (value, index) {
                return [index];
            }).diff($.map(_dados.empresas, function (value, index) {
                return [index];
            }));
            for (let i = 0; i < del.length; i++) {
                usuario.removeEmpresa(del[i]);
            }

            //verifica as empresas que precisam ser adicionadas
            //transforma os objetos em arrays e verifica a diferença entre eles
            let add = $.map(_dados.empresas, function (value, index) {
                return [index];
            }).diff($.map(usuario.empresas, function (value, index) {
                return [index];
            }));
            for (let i = 0; i < add.length; i++) {
                usuario.addEmpresa(add[i]);
            }

            usuario.save()
                .then(function () {
                    console.log('ok');
                    $('#modalUsuario').modal('close');
                    location.reload();
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

    alteraEstado(uid) {
        Usuarios[uid].ativo = !Usuarios[uid].ativo;
        Usuarios[uid].save()
            .then(function () {
                console.log('Alterado com sucesso');
            })
            .catch(function (err) {
                alert(err);
            });
    },

    novo: function (event) {
        // Get all the forms elements and their values in one step

        var unindexed_array = $(this).serializeArray();
        var _dados = {};
        _dados.empresas = {};

        $.map(unindexed_array, function (n, i) {
            if (n['name'] == 'empresaUsuario') {
                _dados.empresas[n['value']] = true;
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
        else usu.empresas = {};

        // if (_dados.uid) usu.uid = _dados.uid;
        new Usuario(usu)
            .then(function () {
                alert("Usuário criado e nova senha solicitada");
                $('#modalUsuario').modal('close');
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
        //preenche modal dos tipos de usuario, mostrando as opções liberadas para o usuario atual
        
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
    var newItem = '<ul class="collection">' + 
                        '<li class="collection-item" id="li-' + usuario.uid +'">' +
                        '<div>' +
                            '<span id="itemNome">' + usuario.nome + '</span>' +
                            '<span class="grey-text hide-on-med-and-down" id="itemEmail">' + usuario.email + '</span>' +
                            '<span class="grey-text hide-on-small-only" id="itemTipo">' + usuario.tipo + '</span>' +
                            '<a href="#!" class="secondary-content dropdown-button btn-floating waves-effect waves-light right red lighten-1" data-activates="dropdown-' + usuario.uid + '"><i class="material-icons">more_vert</i></a>' +
                        '</div>' +
                    '</li>' +
                    '<ul id="dropdown-' + usuario.uid +'"  class="dropdown-content">' +
                        '<li><a href="#!">Editar</a></li>' +
                        '<li><a href="#!">Inativar</a></li>' +
                    '</ul>';
   /* var newCard = "<div id=div-" + usuario.uid + " class=\"col s12 m4 l3\">" +
        "<div class=\"card z-depth-3\">" +
        "<div class=\"card-content\">" +
        "<a class=\"dropdown-button btn-floating waves-effect waves-light right red \" data-activates=\"dropdown-" + usuario.uid + "\"><i class=\"material-icons\">more_vert</i></a>" +
        "<ul id=\"dropdown-" + usuario.uid + "\" class=\"dropdown-content\"> " +
        "<li><a href=\"javascript:void(0);\" onclick=\"UsuarioController.editar('" + usuario.uid + "');\">Editar</a></li>" +
        //"<li><a href=\"javascript:void(0);\">Alterar email</a></li>" +
        //"<li><a href=\"javascript:void(0);\">Redefinir senha</a></li>" +
        "<li><a href=\"javascript:void(0);\" onclick=\"UsuarioController.alteraEstado('" + usuario.uid + "');\">";
    if (usuario.ativo) newCard += "Inativar";
    else newCard += "Ativar";
    newCard += "</a></li>" +
        //"<li><a href=\"javascript:void(0);\">Excluir</a></li>" +
        "</ul>" +
        "<h6>" + usuario.nome + "</h6>" +
        "<p class=\"grey-text\">" + usuario.email + "</p>" +
        "<p class=\"grey-text\">" + usuario.tipo + "</p>" +
        "</div>" +
        "</div>" +
        "</div>";*/

    newItem += '</ul>';
    $('#painelUsuarios').append(newItem);

    $('.dropdown-button').dropdown({
        hover: true,
        constrainWidth: false,
        gutter: 0,
        belowOrigin: false,
        alignment: 'right'
    });

}

Usuarios.callbackChanged = function (usuario) {
    console.log(usuario.nome + " alterado!");
    var newCard = "<div id=div-" + usuario.uid + " class=\"col s12 m4 l3\">" +
        "<div class=\"card z-depth-3\">" +
        "<div class=\"card-content\">" +
        "<a class=\"dropdown-button btn-floating waves-effect waves-light right red \" data-activates=\"dropdown-" + usuario.uid + "\"><i class=\"material-icons\">more_vert</i></a>" +
        "<ul id=\"dropdown-" + usuario.uid + "\" class=\"dropdown-content\"> " +
        "<li><a href=\"javascript:void(0);\" onclick=\"UsuarioController.editar('" + usuario.uid + "');\">Editar</a></li>" +
        //"<li><a href=\"javascript:void(0);\">Alterar email</a></li>" +
        //"<li><a href=\"javascript:void(0);\">Redefinir senha</a></li>" +
        "<li><a href=\"javascript:void(0);\" onclick=\"UsuarioController.alteraEstado('" + usuario.uid + "');\">";
    if (usuario.ativo) newCard += "Inativar";
    else newCard += "Ativar";
    newCard += "</a></li>" +
        //"<li><a href=\"javascript:void(0);\">Excluir</a></li>" +
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
