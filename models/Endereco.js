/**
 * Classe Endereco, recebe um JSON com os dados do endereço
 * Exemplo: var e = new Endereco({'logradouro': 'rua sem saida', 'numero':55})
 */
class Endereco {
    constructor(_dados) {
        try {
            this.logradouro = _dados.logradouro;
            this.numero = _dados.numero;
            this.complemento = _dados.complemento;
            this.bairro = _dados.bairro;
            this.cep = _dados.cep;
            this.cidade = _dados.cidade;
            this.estado = _dados.estado;
            this.pais = _dados.pais;
        }
        catch (err) {
            throw err;
        }
    }
}
