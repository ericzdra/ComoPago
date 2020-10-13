function PaymentVariables(fullPayment, paymentAmount, paymentValue, averageMonthlyInflation) {
    this.fullPayment = fullPayment
    this.paymentAmount = paymentAmount
    this.paymentValue = paymentValue
    this.averageMonthlyInflation = averageMonthlyInflation
}

function Payment(paymentsAmount, paymentsValue, paymentsTotal, inflation) {
    this.pQ = paymentsAmount
    this.pQall = []
    this.pV = paymentsValue
    this.pT = paymentsTotal
    this.i = inflation
    this.adjustedPayment = []
    this.notAdjustedPayment = []
    this.adjustedPaymentTotal = 0;
    this.saved = false
    for (let index = 0; index < this.pQ; index++) {
        this.notAdjustedPayment.push(this.pV)
        this.pQall.push(index + 1)
    }
    for (let index = 0; index < this.notAdjustedPayment.length; index++) {
        this.adjustedPayment.push(((this.pV) / Math.pow((1 + (this.i / 100)), index)).toFixed(2))
    }

    this.adjustedPaymentTotal = this.adjustedPayment.reduce(adjustedPaymentSum)

    function adjustedPaymentSum(a, b) {
        return a + b
    }

}
