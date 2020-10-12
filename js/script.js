sessionStorage.clear()

const normalBorder = "#ced4da"

document.getElementById("comoPago").onclick = createPayment

function createPayment() {
    var myPaymentVariables = new PaymentVariables(
        document.getElementById("fullPayment").value,
        document.getElementById("paymentAmount").value,
        document.getElementById("paymentValue").value,
        document.getElementById("averageMonthlyInflation").value
    )
    if (validateInput(myPaymentVariables)) {
        return
    }

    var myPayment = new Payment(myPaymentVariables.paymentAmount, myPaymentVariables.paymentValue, 0, myPaymentVariables.averageMonthlyInflation)
    graphGenerator(myPayment.adjustedPayment, myPayment.pQall)
    console.log(myPayment)
    console.log(myPayment.adjustedPayment)
}

function validateInput(variables) {
    let bad = false
    for (let index = 0; index < Object.entries(variables).length; index++) {

        if (!Object.entries(variables)[index][1]) {
            console.log("bad")
            console.log(Object.entries(variables)[index][0])
            document.getElementById(Object.entries(variables)[index][0]).style.borderColor = "red"
            bad = true

        } else {
            console.log("good")
            console.log(Object.entries(variables)[index][0])
            document.getElementById(Object.entries(variables)[index][0]).style.borderColor = normalBorder
        }

    }
    return bad
}

function graphGenerator(adjustedPayment, paymentsAmount) {
    var ctx = document.getElementById("myChart").getContext("2d")
    var chart = new Chart(ctx, {
        type: 'line',

        data: {
            labels: paymentsAmount,
            datasets: [{
                label: "Cuota ajustada por inflación",
                borderColor: "rgb(69, 123, 157)",
                data: adjustedPayment
            }]
        },
        options: {}
    })
}

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

