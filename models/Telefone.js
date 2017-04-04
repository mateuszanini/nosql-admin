/** Classe telefones
 * Recebe como parâmetro o numero do telefone e opcionalmente o uid
 */
class Telefone {
    constructor(_numero, _uid) {
        if (_uid)
            this.uid = _uid;
        else
            this.uid = generatePushID();
        this.numero = _numero;
    }
    toJSON() {
        return this.uid + ":" + this.numero;
    }
}