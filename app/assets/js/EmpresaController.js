var EmpresaController = {
    editar: function (uid) {
        if (Usuarios[firebase.auth().currentUser.uid].tipo != "admin") return false;
        let empresa = Empresas[uid];

        $('#tituloModalEmpresa').html('Editar usuário');
        $('#btnSalvaEmpresa').html('Salvar');
        $('#formEmpresa').unbind('submit');

        //preenche os campos
        $('#nomeFantasiaEmpresa').val(empresa.nomeFantasia).focusin();
        $('#razaoSocialEmpresa').val(empresa.razaoSocial).focusin();
        $('#cnpjEmpresa').val(empresa.cnpj).focusin();
        $('#inscricaEstadualEmpresa').val(empresa.inscricaoEstadual).focusin();
        $('#inscricaoMunicipalEmpresa').val(empresa.inscricaoMunicipal).focusin();
        $('#telefoneEmpresa').val(empresa.telefone).focusin();
        $('#chamarEmpresa').attr("href", "tel:" + empresa.telefone);
        $('#emailEmpresa').val(empresa.email).focusin();
        $('#logradouroEmpresa').val(empresa.logradouro).focusin();
        $('#numeroEmpresa').val(empresa.numero).focusin();
        $('#complementoEmpresa').val(empresa.complemento).focusin();
        $('#bairroEmpresa').val(empresa.bairro).focusin();
        $('#cepEmpresa').val(empresa.cep).focusin();
        $('#cidadeEmpresa').val(empresa.cidade).focusin();
        $('#estadoEmpresa').val(empresa.estado).focusin();
        $('#paisEmpresa').val(empresa.pais).focusin();


        //adiciona evento para quando enviar o formulario
        $('#formUsuario').submit(function (event) {
            event.preventDefault();
            var unindexed_array = $(this).serializeArray();
            var _dados = {};
            $.map(unindexed_array, function (n, i) {
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
            empresa.endereco.logradouro = _dados.endereco.logradouro;
            empresa.endereco.numero = _dados.endereco.numero;
            empresa.endereco.complemento = _dados.endereco.complemento;
            empresa.endereco.bairro = _dados.endereco.bairro;
            empresa.endereco.cep = _dados.endereco.cep;
            empresa.endereco.cidade = _dados.endereco.cidade;
            empresa.endereco.estado = _dados.endereco.estado;
            empresa.endereco.pais = _dados.endereco.pais;

            empresa.save()
                .then(function () {
                    console.log('ok');
                    $('#modalEmpresa').modal('close');
                    return false;
                })
                .catch(function (err) {
                    console.log(err);
                    $('#modalEmpresa').modal('close');
                    return false;
                });
            return false;
        });

        $('#modalEmpresa').modal('open');
    },

    alteraEstado(uid) {
        Empresas[uid].ativo = !Empresas[uid].ativo;
        Empresas[uid].save()
            .then(function () {
                console.log('Alterada com sucesso');
            })
            .catch(function (err) {
                alert(err);
            });
    },

    novo: function (event) {
        if (Usuarios[firebase.auth().currentUser.uid].tipo != "admin") return false;

        var unindexed_array = $(this).serializeArray();
        var _dados = {};
        $.map(unindexed_array, function (n, i) {
            _dados[n['name'].replace("Empresa", "")] = n['value'];
        });

        console.log(_dados);
        new Empresa(_dados)
            .then(function () {
                console.log("Empresa criada com sucesso");
                $('#modalEmpresa').modal('close');
            })
            .catch(function (err) {
                console.log(err);
            });
        return false;
    },

    mostraModalNovo: function () {
        if (Usuarios[firebase.auth().currentUser.uid].tipo != "admin") return false;
        $('#tituloModalEmpresa').html('Cadastrar empresa');
        $('#btnSalvaEmpresa').html('Cadastrar');
        $('#formEmpresa').unbind('submit');
        $('#formEmpresa').submit(EmpresaController.novo);


        $('#nomeFantasiaEmpresa').val('');
        $('#razaoSocialEmpresa').val('');
        $('#cnpjEmpresa').val('');
        $('#inscricaEstadualEmpresa').val('');
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


Empresas.callbackAdded = function (empresa) {
    var newItem = '<li class="collection-item" id="li-' + usuario.uid + '">' +
        '<div>' +
        '<span id="itemNome">' + empresa.nomeFantasia + '</span>' +
        '<span class="grey-text hide-on-small-only" id="itemTipo">' + empresa.cnpj + '</span>' +
        '</div>' +
        '</li>';
    $('#collectionEmpresas').append(newItem);
};

Empresas.callbackChanged = function (empresa) {
    var newItem = '<li class="collection-item" id="li-' + usuario.uid + '">' +
        '<div>' +
        '<span id="itemNome">' + empresa.nomeFantasia + '</span>' +
        '<span id="itemCnpj">' + empresa.cnpj + '</span>' +
        '</div>' +
        '</li>';
    $('#li-' + usuario.uid).replaceWith(newItem);
};

Empresas.callbackRemoved = function (uid) {
    console.log('removendo: ' + uid);
    $('#div-' + uid).remove();
};