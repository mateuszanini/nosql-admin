var UsuarioController = {
    editar: function (uid) {
        console.log(Usuarios[uid]);
    }
};

Usuarios.callbackAdded = function (usuario) {
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
    $('#tb-usuarios tr:last').after(newRow);
    //$('#tb-usuarios').DataTable();
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