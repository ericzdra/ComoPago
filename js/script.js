sessionStorage.clear()

var onePaymentPrice
var paymentsQ
var paymentsPrice
var monthlyInflation


var time = 0;

var interval = setInterval(function () {
    if ((!paymentsQ && !paymentsPrice && !monthlyInflation) && time < 4) {

        paymentsQ = document.getElementById("paymentAmount").value
        paymentsPrice = document.getElementById("paymentValue").value
        monthlyInflation = document.getElementById("averageMonthlyInflation").value

        time++
    }
    else if (time == 4) {
        clearInterval(interval)
        var noSubmission = document.createElement("h2")
        noSubmission.innerHTML = "No se ingresaron valores"
        noSubmission.setAttribute("class", "text-center")
        document.getElementById("resultingText").appendChild(noSubmission)

    }
    else {
        var myPayment = new Payment(paymentsQ, paymentsPrice, 0, monthlyInflation)
        console.log(myPayment)
        for (var index = 0; index < myPayment.adjustedPayment.length; index++) {
            var submission = document.createElement("div")
            submission.innerHTML = myPayment.adjustedPayment[index].toFixed(2)
            submission.setAttribute("class", "d-inline p-2 bg-dark text-white")
            document.getElementById("resultingText").appendChild(submission)
        }
        clearInterval(interval)
    }
}, 5000);


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
        return a + b
    }

}


