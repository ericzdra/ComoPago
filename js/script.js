
/*

var onePaymentPrice = parseFloat(prompt("Ingresá el precio del producto en 1 pago (pago al contado)"));
var paymentsQ = parseInt(prompt("Ingresá la cantidad de cuotas que te ofrecen"));
var paymentsPrice = parseFloat(prompt("Ingresá cuanto te sale cada cuota"));
var monthlyInflation = parseFloat(prompt("Ingresá la inflación mensual promedio"))



var inflationAdjustedPayments = inflationAdjusted(paymentsQ, paymentsPrice, monthlyInflation);

var inflationAdjustedTotal = inflationAdjustedPayments.reduce(inflationAdjustedSum);

console.log(inflationAdjustedTotal)






function inflationAdjusted(dues, price, inflation) {
    var adjustedPayments = [0];

    for (var i = 1; i == dues; i++) {
        adjustedPayments[i] = ((price)/Math.pow((1+(inflation/100)),i));

    }

    return adjustedPayments
}

function inflationAdjustedSum (a, b) {
    return a + b;
}

*/
