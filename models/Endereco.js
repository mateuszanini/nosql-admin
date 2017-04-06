/**
 * Classe Endereco, recebe um JSON com os dados do endereço
 * Exemplo: var e = new Endereco({'logradouro': 'rua sem saida', 'numero':55})
 */
class Endereco {
    constructor(_dados) {
        try {
            if (_dados.logradouro) this.logradouro = _dados.logradouro;
            if (_dados.numero) this.numero = _dados.numero;
            if (_dados.complemento) this.complemento = _dados.complemento;
            if (_dados.bairro) this.bairro = _dados.bairro;
            if (_dados.cep) this.cep = _dados.cep;
            if (_dados.cidade) this.cidade = _dados.cidade;
            if (_dados.estado) this.estado = _dados.estado;
            if (_dados.pais) this.pais = _dados.pais;
        }
        catch (err) {
            throw err;
        }
    }
}
