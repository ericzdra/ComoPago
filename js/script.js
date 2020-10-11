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
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: paymentsAmount,
            dataset: [{
                label: "Probando Dataset",
                backgroundColor: "#eb4034",
                borderColor: "#eb4034",
                data: adjustedPayment
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }

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

/* var time = 0;

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
}, 5000); */