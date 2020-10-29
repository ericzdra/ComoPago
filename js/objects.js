function PaymentVariables(cash, paymentAmount, paymentValue, averageMonthlyInflation) {
    this.cash = cash
    this.paymentAmount = paymentAmount
    this.paymentValue = paymentValue
    this.averageMonthlyInflation = averageMonthlyInflation
}

function Payment(paymentsAmount, paymentsValue, cash, inflation) {
    this.creationDate = timeSet()
    this.cash = cash
    this.pQ = paymentsAmount
    this.pQall = []
    this.pV = paymentsValue
    this.i = inflation
    this.adjustedPayment = []
    this.notAdjustedPayment = []
    this.adjustedPaymentTotal = 0;
    this.saved = false
    this.plotted = false
    this.method = ""


    for (let index = 0; index < this.pQ; index++) {
        this.notAdjustedPayment.push(this.pV)
        this.pQall.push(index + 1)
    }
    for (let index = 0; index < this.notAdjustedPayment.length; index++) {
        this.adjustedPayment.push(((this.pV) / Math.pow((1 + (this.i / 100)), index)).toFixed(2))
    }

    this.adjustedPaymentTotal = this.adjustedPayment.reduce(adjustedPaymentSum)

    if ((this.adjustedPaymentTotal/this.cash) < 1) {
        this.method = "credit"
        
    }else if ((this.adjustedPaymentTotal/this.cash) == 1) {
        this.method = "same"
    }else{
        this.method = "cash"
    }

    function adjustedPaymentSum(a, b) {
        return parseFloat(a) + parseFloat(b)
    }

}
