var UsuarioController = {
    editar: function(uid) {
        let usuario = Usuarios[uid];

        $('#tituloModalUsuario').html('Editar usuário');
        $('#btnSalvaUsuario').html('Salvar');
        $('#formUsuario').unbind('submit');

        //preenche o nome
        $('#nomeUsuario').val(usuario.nome).focusin();

        //preenche o email
        $('#emailUsuario').val(usuario.email).prop('disabled', true).focusin();

        //preenche o telefone
        $('#telefoneUsuario').val(usuario.telefone).focusin();
        $('#chamarUsuario').attr("href", "tel:" + usuario.telefone);

        //seleciona o tipo do usuario
        $('#tipoUsuario').val(usuario.tipo).change();
        $("#tipoUsuario").prop('disabled', false);
        if (Usuarios[firebase.auth().currentUser.uid].tipo != "admin") {
            $("#tipoUsuario option[value='admin']").prop('disabled', true);
        }

        //preenche select das empresas
        if (usuario.tipo == 'admin') {
            $("#empresaUsuario").prop('disabled', true);
        }
        else {
            $("#empresaUsuario").prop('disabled', false);
            $("#empresaUsuario").html('');
            $("#empresaUsuario").append(
                $('<option/>')
                .text("Nenhuma empresa selecionada")
                .attr('selected', true)
                .attr('disabled', true)
            );
            try {
                $.map(Empresas, function(n, i) {
                    if (typeof n == 'object' && n) {
                        if (usuario.empresas[n.uid]) {
                            $("#empresaUsuario").append(
                                $('<option/>')
                                .attr('value', n.uid)
                                .text(n.nomeFantasia)
                                .attr('selected', true)
                            );
                        }
                        else {
                            $("#empresaUsuario").append(
                                $('<option/>')
                                .attr('value', n.uid)
                                .text(n.nomeFantasia)
                            );
                        }
                    }
                });
            }
            catch (e) {
                //console.log(e);
            }
        }
        $('select').material_select();
        //adiciona evento para quando enviar o formulario
        $('#formUsuario').submit(function(event) {
            event.preventDefault();
            //serializa o form
            var unindexed_array = $(this).serializeArray();
            var _dados = {};
            _dados.empresas = {};
            $.map(unindexed_array, function(n, i) {
                if (n['name'] == 'empresaUsuario') {
                    _dados.empresas[n['value']] = true;
                }
                else {
                    _dados[n['name']] = n['value'];
                }
            });
            if (_dados.nomeUsuario != "") usuario.nome = _dados.nomeUsuario;
            if (_dados.tipoUsuario != "") usuario.tipo = _dados.tipoUsuario;
            usuario.telefone = _dados.telefoneUsuario;

            //relacionamento com empresas
            //verifica as empresas que precisam ser excluidas
            //transforma os objetos em arrays e verifica a diferença entre eles
            let del = $.map(usuario.empresas, function(value, index) {
                return [index];
            }).diff($.map(_dados.empresas, function(value, index) {
                return [index];
            }));
            for (let i = 0; i < del.length; i++) {
                usuario.removeEmpresa(del[i]);
            }

            //verifica as empresas que precisam ser adicionadas
            //transforma os objetos em arrays e verifica a diferença entre eles
            let add = $.map(_dados.empresas, function(value, index) {
                return [index];
            }).diff($.map(usuario.empresas, function(value, index) {
                return [index];
            }));
            for (let i = 0; i < add.length; i++) {
                usuario.addEmpresa(add[i]);
            }

            usuario.save()
                .then(function() {
                    console.log('ok');
                    $('#modalUsuario').modal('close');
                    //location.reload();
                    app.preloader('close');
                })
                .catch(function(err) {
                    console.log(err);
                    $('#modalUsuario').modal('close');
                    app.preloader('close');
                });
            return false;
        });
        $('#modalUsuario').modal('open');
    },

    editarPerfil: function() {
        console.log("Editando...");
        let usuario = Usuarios[firebase.auth().currentUser.uid];
        $('#tituloModalUsuario').html('Editar meu perfil');
        $('#btnSalvaUsuario').html('Salvar');
        $('#formUsuario').unbind('submit');

        //preenche o nome
        $('#nomeUsuario').val(usuario.nome).focusin();
        //preenche o email
        $('#emailUsuario').val(usuario.email).prop('disabled', false).focusin();

        //preenche o telefone
        $('#telefoneUsuario').val(usuario.telefone).focusin();
        $('#chamarUsuario').attr("href", "tel:" + usuario.telefone);

        //seleciona o tipo do usuario
        $('#tipoUsuario').val(usuario.tipo).change();
        $("#tipoUsuario").prop('disabled', true);

        //preenche select das empresas        
        $("#empresaUsuario").html('');
        $("#empresaUsuario").append(
            $('<option/>')
            .text("Nenhuma empresa selecionada")
            .attr('selected', true)
            .attr('disabled', true)
        );
        try {
            $.map(Empresas, function(n, i) {
                if (typeof n == 'object' && n) {
                    if (usuario.empresas[n.uid]) {
                        $("#empresaUsuario").append(
                            $('<option/>')
                            .attr('value', n.uid)
                            .text(n.nomeFantasia)
                            .attr('selected', true)
                        );
                    }
                }
            });
        }
        catch (e) {
            //console.log(e);
        }
        $("#empresaUsuario").prop('disabled', true);
        $('select').material_select();
        //adiciona evento para quando enviar o formulario
        $('#formUsuario').submit(function(event) {
            console.log("usuario antes");
            console.log(usuario);
            event.preventDefault();
            //serializa o form
            var unindexed_array = $(this).serializeArray();
            var _dados = {};
            $.map(unindexed_array, function(n, i) {
                _dados[n['name']] = n['value'];
            });
            if (_dados.nomeUsuario != "") usuario.nome = _dados.nomeUsuario;
            if (_dados.telefoneUsuario) usuario.telefone = _dados.telefoneUsuario;

            if (_dados.emailUsuario != "") {
                if (usuario.email != _dados.emailUsuario) {
                    usuario.email = _dados.emailUsuario;
                    console.log("Alterando  o email do usuario...");
                    firebase.auth().currentUser.updateEmail(usuario.email).then(function() {
                        usuario.save()
                            .then(function() {
                                console.log('ok');
                                $('#modalUsuario').modal('close');
                                //location.reload();
                            })
                            .catch(function(err) {
                                console.log(err);
                                $('#modalUsuario').modal('close');
                            });
                    }, function(error) {
                        console.log("Não pode alterar o email do usuario");
                        console.log(error);
                        $('#modalUsuario').modal('close');
                    });
                }
                else {
                    usuario.save()
                        .then(function() {
                            console.log('ok');
                            $('#modalUsuario').modal('close');
                            location.reload();
                        })
                        .catch(function(err) {
                            console.log(err);
                            $('#modalUsuario').modal('close');
                        });
                    return false;
                }
            }
        });
        $('#modalUsuario').modal('open');
    },

    alteraEstado: function(uid) {
        if (Usuarios[uid].ativo) {
            $('#tituloModalAtivo').html("<b>Inativar</b> usuário " + Usuarios[uid].nome + "?");
        }
        else {
            $('#tituloModalAtivo').html("<b>Ativar</b>  usuário " + Usuarios[uid].nome + "?");
        }

        $("#btnAlteraEstado").unbind('click');

        $("#btnAlteraEstado").click(function() {
            $('#modalAtivo').modal('close');
            app.preloader('open');
            Usuarios[uid].ativo = !Usuarios[uid].ativo;
            Usuarios[uid].save()
                .then(function() {
                    console.log('Alterado com sucesso');
                    app.preloader('close');
                })
                .catch(function(err) {
                    alert(err);
                    app.preloader('close');
                });
        });

        $('#modalAtivo').modal('open');
    },

    novo: function(event) {
        if (Usuarios[firebase.auth().currentUser.uid].tipo == "operador") return false;
        // Get all the forms elements and their values in one step

        var unindexed_array = $(this).serializeArray();
        var _dados = {};
        _dados.empresas = {};

        $.map(unindexed_array, function(n, i) {
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
        if (_dados.telefoneUsuario) usu.telefone = _dados.telefoneUsuario;
        //relacionamento com empresas
        if (_dados.empresas) usu.empresas = _dados.empresas;
        else usu.empresas = {};

        // if (_dados.uid) usu.uid = _dados.uid;
        new Usuario(usu)
            .then(function() {
                console.log("Usuário criado e nova senha solicitada");
                $('#modalUsuario').modal('close');
                //location.reload();
            })
            .catch(function(err) {
                console.log(err);
            });
        return false;
    },

    mostraModalNovo: function() {
        if (Usuarios[firebase.auth().currentUser.uid].tipo == "operador") return false;
        $('#tituloModalUsuario').html('Cadastrar usuário');
        $('#btnSalvaUsuario').html('Cadastrar');
        $('#formUsuario').unbind('submit');
        $('#formUsuario').submit(UsuarioController.novo);

        $('#chamarUsuario').attr("href", "javascript:void(0);");

        $('#emailUsuario').val('').prop('disabled', false);
        $('#nomeUsuario').val('');
        $('#telefoneUsuario').val('');

        $("#empresaUsuario").prop('disabled', false);
        $("#tipoUsuario").prop('disabled', false);

        //preenche modal dos tipos de usuario, mostrando as opções liberadas para o usuario atual
        if (Usuarios[firebase.auth().currentUser.uid].tipo == "admin") {
            $("#tipoUsuario option[value='admin']").prop('disabled', false);
            $("#tipoUsuario option[value='gerente']").prop('disabled', false);
        }
        if (Usuarios[firebase.auth().currentUser.uid].tipo == "gerente") {
            $("#tipoUsuario option[value='admin']").prop('disabled', true);
            $("#tipoUsuario option[value='gerente']").prop('disabled', false);
        }
        //preenche select das empresas
        $("#empresaUsuario").html('');
        $("#empresaUsuario").append(
            $('<option/>')
            .text("Selecione")
            .attr('selected', true)
            .attr('disabled', true)
        );
        $.map(Empresas, function(n, i) {
            if (typeof n == 'object' && n) {
                $("#empresaUsuario").append(
                    $('<option/>')
                    .attr('value', n.uid)
                    .text(n.nomeFantasia)
                );
            }
        });
        $('select').material_select();
    },


    /**
     * Método que mostra o usuario na tela
     * Recebe como parametro um objeto:
     * dados = {
         usuario: Usuario,
         novo: true | false,
         modal: true | false
     }
     */
    mostraUsuario: function(dados) {
        console.log(dados);

        let usuario = dados.usuario;
        let novo = dados.novo != undefined ? dados.novo : false;
        let modal = dados.modal != undefined ? dados.modal : false;


        if (usuario.uid == firebase.auth().currentUser.uid) {
            return;
        }

        $('.tooltipped').tooltip('remove');

        if (usuario.tipo === "admin") {
            var usuarioTipo = "Administrador";
        }
        else if (usuario.tipo === "gerente") {
            var usuarioTipo = "Gerente";
        }
        else if (usuario.tipo === "operador") {
            var usuarioTipo = "Operador";
        }

        var newItem = '';
        if (usuario.ativo) {
            if (modal) {
                newItem += '<li class="collection-item" id="liModal-' + usuario.uid + '">';
            }
            else {
                newItem += '<li class="collection-item" id="li-' + usuario.uid + '">';
            }
        }
        else {
            if (modal) {
                newItem += '<li class="collection-item grey lighten-2" id="liModal-' + usuario.uid + '">';
            }
            else {
                newItem += '<li class="collection-item grey lighten-2" id="li-' + usuario.uid + '">';
            }
        }

        newItem += '<div>' +
            '<span>' + usuario.nome + '</span>' +
            '<span class="grey-text hide-on-med-and-down">' + usuario.email + '</span>' +
            '<span class="grey-text hide-on-small-only"><i>' + usuarioTipo + '</i></span>' +
            //Botão Editar
            '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
            'data-position="top" data-tooltip="Editar" onclick="UsuarioController.editar(\'' + usuario.uid + '\');">' +
            '<i class="material-icons">mode_edit</i></a>';
        if (usuario.ativo) {
            newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
                'data-position="top" data-tooltip="Inativar" onclick="UsuarioController.alteraEstado(\'' + usuario.uid + '\');">' +
                '<i class="material-icons">check_box</i></a>';
        }
        else {
            newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
                'data-position="top" data-tooltip="Ativar" onclick="UsuarioController.alteraEstado(\'' + usuario.uid + '\');">' +
                '<i class="material-icons">check_box_outline_blank</i></a>';
        }

        newItem += '</li>';

        if (novo) {
            if (modal) {
                $('#collectionUsuariosModal').append(newItem);
            }
            else {
                $('#collectionUsuarios').append(newItem);
            }
        }
        else {
            if (modal) {
                $('#liModal-' + usuario.uid).replaceWith(newItem);
            }
            else {
                $('#li-' + usuario.uid).replaceWith(newItem);
            }
        }

        $('.tooltipped').tooltip();

    }
};


Usuarios.callbackAdded = function(usuario) {
    UsuarioController.mostraUsuario({
        usuario: usuario,
        novo: true
    });
    UsuarioController.mostraUsuario({
        usuario: usuario,
        novo: true,
        modal: true
    });
};

Usuarios.callbackChanged = function(usuario) {
    UsuarioController.mostraUsuario({
        usuario: usuario,
        novo: false
    });
    UsuarioController.mostraUsuario({
        usuario: usuario,
        novo: false,
        modal: true
    });
};
/*
Usuarios.callbackChanged = function(usuario) {
    if (usuario.uid == firebase.auth().currentUser.uid) {
        return;
    }

    $('.tooltipped').tooltip('remove');

    if (usuario.tipo === "admin") {
        var usuarioTipo = "Administrador";
    }
    else if (usuario.tipo === "gerente") {
        var usuarioTipo = "Gerente";
    }
    else if (usuario.tipo === "operador") {
        var usuarioTipo = "Operador";
    }

    var newItem = '';
    if (usuario.ativo) {
        newItem += '<li class="collection-item" id="li-' + usuario.uid + '">';
    }
    else {
        newItem += '<li class="collection-item grey lighten-2" id="li-' + usuario.uid + '">';
    }
    newItem += '<div>' +
        '<span id="itemNome">' + usuario.nome + '</span>' +
        '<span class="grey-text hide-on-med-and-down" id="itemEmail">' + usuario.email + '</span>' +
        '<span class="grey-text hide-on-small-only" id="itemTipo"><i>' + usuarioTipo + '</i></span>' +
        //Botão Editar
        '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
        'data-position="top" data-tooltip="Editar" onclick="UsuarioController.editar(\'' + usuario.uid + '\');">' +
        '<i class="material-icons">mode_edit</i></a>';
    if (usuario.ativo) {
        newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
            'data-position="top" data-tooltip="Inativar" onclick="UsuarioController.alteraEstado(\'' + usuario.uid + '\');">' +
            '<i class="material-icons">check_box</i></a>';
    }
    else {
        newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
            'data-position="top" data-tooltip="Ativar" onclick="UsuarioController.alteraEstado(\'' + usuario.uid + '\');">' +
            '<i class="material-icons">check_box_outline_blank</i></a>';
    }

    newItem += '</li>';

    $('#li-' + usuario.uid).replaceWith(newItem);
    $('.tooltipped').tooltip();

}
*/

Usuarios.callbackRemoved = function(uid) {
    console.log('removendo: ' + uid);
    $('#li-' + uid).remove();
}
