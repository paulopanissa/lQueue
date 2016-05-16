function pad() {
    return function(num) {
        return (num < 10 ? '0' + num : num); // coloca o zero na frente
    };
}
/**
 * Mask to CPF/CNPJ in {{ documento | CPF }}
 * @returns {Function}
 */
function cpfcnpj(){
    return function(input) {
        if(input != undefined)
        {
            if(input.length <= 11){
                var str = input+ '';
                str = str.replace(/\D/g,'');
                str = str.replace(/(\d{3})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
                return str;
            }else{
                var str = input+ '';
                str = str.replace(/\D/g,'');
                str = str.replace(/(\d{2})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d)/,"$1/$2");
                str = str.replace(/(\d{4})(\d{1,2})$/,"$1-$2");
                return str;
            }
        }
    };
}

function attend(){
    return function(input){
        if(input != undefined){
            if(input==1){
                return "Normal";
            }else if(input==3){
                return "Preferencial";
            }else if(input==2){
                return "Mensalista"
            }
        }
    }
}

angular
    .module('nQueue')
    .filter('pad', pad)
    .filter('cpfcnpj', cpfcnpj)
    .filter('attend', attend);