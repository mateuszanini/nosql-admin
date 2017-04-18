var EmpresaController = {
    editar: function(uid) {
        if (Usuarios[firebase.auth().currentUser.uid].tipo != "admin") return false;
        let empresa = Empresas[uid];

        $('#tituloModalEmpresa').html('Editar empresa');
        $('#btnSalvaEmpresa').html('Salvar');
        $('#formEmpresa').unbind('submit');

        //preenche os campos
        $('#nomeFantasiaEmpresa').val(empresa.nomeFantasia).focusin();
        $('#razaoSocialEmpresa').val(empresa.razaoSocial).focusin();
        $('#cnpjEmpresa').val(empresa.cnpj).focusin();
        $('#inscricaoEstadualEmpresa').val(empresa.inscricaoEstadual).focusin();
        $('#inscricaoMunicipalEmpresa').val(empresa.inscricaoMunicipal).focusin();
        $('#telefoneEmpresa').val(empresa.telefone).focusin();
        $('#emailEmpresa').val(empresa.email).focusin();
        if (empresa.endereco) {
            $('#logradouroEmpresa').val(empresa.endereco.logradouro).focusin();
            $('#numeroEmpresa').val(empresa.endereco.numero).focusin();
            $('#complementoEmpresa').val(empresa.endereco.complemento).focusin();
            $('#bairroEmpresa').val(empresa.endereco.bairro).focusin();
            $('#cepEmpresa').val(empresa.endereco.cep).focusin();
            $('#cidadeEmpresa').val(empresa.endereco.cidade).focusin();
            $('#estadoEmpresa').val(empresa.endereco.estado).focusin();
            $('#paisEmpresa').val(empresa.endereco.pais).focusin();
        }


        //adiciona evento para quando enviar o formulario
        $('#formEmpresa').submit(function(event) {
            event.preventDefault();
            var unindexed_array = $(this).serializeArray();
            var _dados = {};
            $.map(unindexed_array, function(n, i) {
                _dados[n['name'].replace("Empresa", "")] = n['value'];
            });

            console.log(_dados);

            if (_dados.nomeFantasia != "") empresa.nomeFantasia = _dados.nomeFantasia;
            empresa.razaoSocial = _dados.razaoSocial;
            empresa.cnpj = _dados.cnpj;
            empresa.inscricaoEstadual = _dados.inscricaoEstadual;
            empresa.inscricaoMunicipal = _dados.inscricaoMunicipal;
            empresa.telefone = _dados.telefone;
            if (_dados.email != "") empresa.email = _dados.email;
            if (empresa.endereco == undefined) empresa.endereco = {};
            empresa.endereco.logradouro = _dados.logradouro;
            empresa.endereco.numero = _dados.numero;
            empresa.endereco.complemento = _dados.complemento;
            empresa.endereco.bairro = _dados.bairro;
            empresa.endereco.cep = _dados.cep;
            empresa.endereco.cidade = _dados.cidade;
            empresa.endereco.estado = _dados.estado;
            empresa.endereco.pais = _dados.pais;

            empresa.save()
                .then(function() {
                    console.log('ok');
                    $('#modalEmpresa').modal('close');
                    return false;
                })
                .catch(function(err) {
                    console.log(err);
                    $('#modalEmpresa').modal('close');
                    return false;
                });
            return false;
        });

        $('#modalEmpresa').modal('open');
    },

    alteraEstado: function(uid) {
        if (Empresas[uid].ativo) {
            $('#tituloModalAtivo').html("<b>Inativar</b> empresa " + Empresas[uid].nomeFantasia + "?");
        }
        else {
            $('#tituloModalAtivo').html("<b>Ativar</b>  empresa " + Empresas[uid].nomeFantasia + "?");
        }

        $("#btnAlteraEstado").unbind('click');

        $("#btnAlteraEstado").click(function() {
            $('#modalAtivo').modal('close');
            app.preloader('open');
            Empresas[uid].ativo = !Empresas[uid].ativo;
            Empresas[uid].save()
                .then(function() {
                    console.log('Alterada com sucesso');
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
        if (Usuarios[firebase.auth().currentUser.uid].tipo != "admin") return false;

        var unindexed_array = $(this).serializeArray();
        var _dados = {};
        $.map(unindexed_array, function(n, i) {
            if (n['value'] != "") {
                _dados[n['name'].replace("Empresa", "")] = n['value'];
            }
        });
        var empresa = {};
        empresa.endereco = {};

        if (_dados.nomeFantasia) empresa.nomeFantasia = _dados.nomeFantasia;
        if (_dados.razaoSocial) empresa.razaoSocial = _dados.razaoSocial;
        if (_dados.cnpj) empresa.cnpj = _dados.cnpj;
        if (_dados.inscricaoEstadual) empresa.inscricaoEstadual = _dados.inscricaoEstadual;
        if (_dados.inscricaoMunicipal) empresa.inscricaoMunicipal = _dados.inscricaoMunicipal;
        if (_dados.telefone) empresa.telefone = _dados.telefone;
        if (_dados.email) empresa.email = _dados.email;

        if (_dados.logradouro) empresa.endereco.logradouro = _dados.logradouro;
        if (_dados.numero) empresa.endereco.numero = _dados.numero;
        if (_dados.complemento) empresa.endereco.complemento = _dados.complemento;
        if (_dados.bairro) empresa.endereco.bairro = _dados.bairro;
        if (_dados.cep) empresa.endereco.cep = _dados.cep;
        if (_dados.cidade) empresa.endereco.cidade = _dados.cidade;
        if (_dados.estado) empresa.endereco.estado = _dados.estado;
        if (_dados.pais) empresa.endereco.pais = _dados.pais;




        console.log(empresa);
        new Empresa(empresa)
            .then(function() {
                console.log("Empresa criada com sucesso");
                $('#modalEmpresa').modal('close');
            })
            .catch(function(err) {
                console.log(err);
            });
        return false;
    },

    mostraModalNovo: function() {
        if (Usuarios[firebase.auth().currentUser.uid].tipo != "admin") return false;
        $('#tituloModalEmpresa').html('Cadastrar empresa');
        $('#btnSalvaEmpresa').html('Cadastrar');
        $('#formEmpresa').unbind('submit');
        $('#formEmpresa').submit(EmpresaController.novo);


        $('#nomeFantasiaEmpresa').val('');
        $('#razaoSocialEmpresa').val('');
        $('#cnpjEmpresa').val('');
        $('#inscricaoEstadualEmpresa').val('');
        $('#inscricaoMunicipalEmpresa').val('');
        $('#telefoneEmpresa').val('');
        $('#emailEmpresa').val('');
        $('#logradouroEmpresa').val('');
        $('#numeroEmpresa').val('');
        $('#complementoEmpresa').val('');
        $('#bairroEmpresa').val('');
        $('#cepEmpresa').val('');
        $('#cidadeEmpresa').val('');
        $('#estadoEmpresa').val('');
        $('#paisEmpresa').val('');

        $('#modalEmpresa').modal('open');
    }
};


Empresas.callbackAdded = function(empresa) {

    $('.tooltipped').tooltip('remove');

    var newItem = '';
    if (empresa.ativo) {
        newItem += '<li class="collection-item" id="li-' + empresa.uid + '">';
    }
    else {
        newItem += '<li class="collection-item grey lighten-2" id="li-' + empresa.uid + '">';
    }
    newItem += '<div>' +
        '<span id="itemNomeFantasia">' + empresa.nomeFantasia + '</span>' +
        '<span class="grey-text hide-on-med-and-down" id="itemCnpj">' + empresa.cnpj + '</span>' +
        '<span class="grey-text hide-on-small-only" id="itemTipo"><i>' + empresa.endereco.cidade + ' - ' + empresa.endereco.estado + '</i></span>' +
        //Botão Editar
        '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
        'data-position="top" data-tooltip="Editar" onclick="EmpresaController.editar(\'' + empresa.uid + '\');">' +
        '<i class="material-icons">mode_edit</i></a>';
    if (empresa.ativo) {
        newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
            'data-position="top" data-tooltip="Inativar" onclick="EmpresaController.alteraEstado(\'' + empresa.uid + '\');">' +
            '<i class="material-icons">check_box</i></a>';
    }
    else {
        newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
            'data-position="top" data-tooltip="Ativar" onclick="EmpresaController.alteraEstado(\'' + empresa.uid + '\');">' +
            '<i class="material-icons">check_box_outline_blank</i></a>';
    }

    newItem += '</li>';

    $('#collectionEmpresas').append(newItem);
    $('.tooltipped').tooltip();
};

Empresas.callbackChanged = function(empresa) {

    $('.tooltipped').tooltip('remove');

    var newItem = '';
    if (empresa.ativo) {
        newItem += '<li class="collection-item" id="li-' + empresa.uid + '">';
    }
    else {
        newItem += '<li class="collection-item grey lighten-2" id="li-' + empresa.uid + '">';
    }
    newItem += '<div>' +
        '<span id="itemNomeFantasia">' + empresa.nomeFantasia + '</span>' +
        '<span class="grey-text hide-on-med-and-down" id="itemCnpj">' + empresa.cnpj + '</span>' +
        '<span class="grey-text hide-on-small-only" id="itemTipo"><i>' + empresa.endereco.cidade + ' - ' + empresa.endereco.estado + '</i></span>' +
        //Botão Editar
        '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
        'data-position="top" data-tooltip="Editar" onclick="EmpresaController.editar(\'' + empresa.uid + '\');">' +
        '<i class="material-icons">mode_edit</i></a>';
    if (empresa.ativo) {
        newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
            'data-position="top" data-tooltip="Inativar" onclick="EmpresaController.alteraEstado(\'' + empresa.uid + '\');">' +
            '<i class="material-icons">check_box</i></a>';
    }
    else {
        newItem += '<a class="secondary-content waves-effect waves-light btn-flat tooltipped"' +
            'data-position="top" data-tooltip="Ativar" onclick="EmpresaController.alteraEstado(\'' + empresa.uid + '\');">' +
            '<i class="material-icons">check_box_outline_blank</i></a>';
    }

    newItem += '</li>';

    $('#li-' + empresa.uid).replaceWith(newItem);
    $('.tooltipped').tooltip();
};

Empresas.callbackRemoved = function(uid) {
    console.log('removendo: ' + uid);
    $('#li-' + uid).remove();
};
