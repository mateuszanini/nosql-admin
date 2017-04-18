var EmpresaController = {
    editar: function (uid) {

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
        _dados.enderecos = {};
        _dados.usuarios = {};

        $.map(unindexed_array, function (n, i) {
            _dados[n['name']] = n['value'];
        });

        let empresa = {};
        return false;
        new Empresa(empresa)
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
        $('#enderecoEmpresa').val('');
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

};

Empresas.callbackChanged = function (empresa) {

};

Empresas.callbackRemoved = function (uid) {
    console.log('removendo: ' + uid);
    $('#div-' + uid).remove();
};