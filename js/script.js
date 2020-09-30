


var onePaymentPrice = parseFloat(prompt("Ingresá el precio del producto en 1 pago (pago al contado)"));
var paymentsQ = parseInt(prompt("Ingresá la cantidad de cuotas que te ofrecen"));
var paymentsPrice = parseFloat(prompt("Ingresá cuanto te sale cada cuota"));
var monthlyInflation = parseFloat(prompt("Ingresá la inflación mensual promedio"))
var myPayment = new Payment(paymentsQ, paymentsPrice, 0 ,monthlyInflation)
console.log(myPayment)





function Payment(paymentsAmount, paymentsValue, paymentsTotal, inflation) {
    this.pQ = paymentsAmount
    this.pV = paymentsValue
    this.pT = paymentsTotal
    this.i = inflation
    this.adjustedPayment = []
    this.notAdjustedPayment = []
    this.adjustedPaymentTotal = 0;
    for (var index = 0; index < this.pQ; index++) {
        this.notAdjustedPayment.push(this.pV)
    }
    for (var index = 0; index < this.notAdjustedPayment.length; index++) {
        this.adjustedPayment.push(((this.pV) / Math.pow((1 + (this.i / 100)), index)))
    }

    this.adjustedPaymentTotal = this.adjustedPayment.reduce(adjustedPaymentSum)

    function adjustedPaymentSum(a, b) {
        return a+b
    }

}


