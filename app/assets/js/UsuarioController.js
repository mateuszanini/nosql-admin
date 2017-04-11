var UsuarioController = {
    editar: function(uid) {
        console.log(Usuarios[uid]);
    },

    novo: function(event) {
        // Get all the forms elements and their values in one step




        var unindexed_array = $(this).serializeArray();
        // console.log(unindexed_array);
        var _dados = {};
        _dados.empresas = [];

        $.map(unindexed_array, function(n, i) {
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
            .then(function() {
                alert("Usuário criado e nova senha solicitada");
                location.reload();
            })
            .catch(function(err) {
                console.log(err);
            });

        event.preventDefault();
    },

    mostraModalNovo: function() {
        $('#tituloModalUsuario').html('Cadastrar usuário');
        $('#btnSalvaUsuario').html('Cadastrar');
        $('#formUsuario').unbind('submit');
        $('#formUsuario').submit(UsuarioController.novo);

        //preenche select das empresas
        $.map(Empresas, function(n, i) {
            if (typeof n == 'object' && n) {
                $("#empresaUsuario").append(
                    $('<option/>')
                    .attr('value', n.uid)
                    .text(n.uid)
                );
            }
        });
        $('select').material_select();
    },

    mostraModalEditar: function() {
        $('#tituloModalUsuario').html('Editar usuário');
        $('#btnSalvaUsuario').html('Salvar');
    }
};


Usuarios.callbackAdded = function(usuario) {
    newRow = '<tr id=\"' + usuario.uid + '\" class=\"text-center\" style = \" cursor: pointer; cursor: hand;\">';
    var newRow = $(newRow);
    var cols = "";
    cols += '<td>' + usuario.nome + '</td>';
    cols += '<td>' + usuario.email + '</td>';
    cols += '<td>' + usuario.tipo + '</td></tr>';
    newRow.append(cols);
    newRow.click(function() {
        UsuarioController.editar(usuario.uid);
    });
    $('#tb-usuarios tr:last').after(newRow);
    //$('#tb-usuarios').DataTable();
}

Usuarios.callbackChanged = function(usuario) {
    newRow = '<tr id=\"' + usuario.uid + '\" class=\"text-center\" style = \" cursor: pointer; cursor: hand;\">';
    var newRow = $(newRow);
    var cols = "";
    cols += '<td>' + usuario.nome + '</td>';
    cols += '<td>' + usuario.email + '</td>';
    cols += '<td>' + usuario.tipo + '</td></tr>';
    newRow.append(cols);
    newRow.click(function() {
        UsuarioController.editar(usuario.uid);
    });
    $("#tb-usuarios tr#" + usuario.uid).replaceWith(newRow);
}

Usuarios.callbackRemoved = function(uid) {
    console.log('removendo: ' + uid);
    $("tr#" + uid).remove();
}
