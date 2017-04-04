/** Classe Email
 * Recebe como parâmetro um endereco de email e opcionalmente o uid
 */
class Email {
    constructor(_email,_uid){
        if(_uid)
            this.uid = _uid;
        else
            this.uid = generatePushID();
        this.email = _email;
    }
}