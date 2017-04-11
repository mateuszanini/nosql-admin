Usuarios.callbackAdded = function (usuario) {
    newRow = '<tr id=\"' + usuario.uid + '\" class=\"text-center\">';
    var newRow = $(newRow);
    var cols = "";
    cols += '<td>' + usuario.email + '</td>';
    cols += '<td>' + usuario.tipo + '</td>';
    newRow.append(cols);
    $('#tb-usuarios tr:last').after(newRow);
}