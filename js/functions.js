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
    storagedPayments.push(JSON.stringify(myPayment))
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
    updateRecord(localStorage.paymentRecord)
}

function validateInput(variables) {
    let bad = false
    for (let index = 0; index < Object.entries(variables).length; index++) {

        if (!Object.entries(variables)[index][1]) {
            document.getElementById(Object.entries(variables)[index][0]).style.borderColor = "red"
            bad = true

        } else {
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

function updateRecord(stgPayments) {
    let records = JSON.parse(stgPayments)

    for (let index = 0; index < records.length; index++) {
        let recordContent = JSON.parse(records[index])
        let orderN = index + 1
        let idOrderN = "Payment" + index

        if (!recordContent.saved) {
            let record = document.createElement("li")
            record.innerHTML = "Pago N° " + (orderN)
            record.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
            record.setAttribute("id", idOrderN)
            record.appendChild(deleteButton())
            document.getElementById("records").appendChild(record)
            recordContent.saved = true
            storagedPayments.splice(index, 1)
            storagedPayments.push(JSON.stringify(recordContent))
        }


        localStorage.paymentRecord = JSON.stringify(storagedPayments)
    }


}

function loadRecord(stgPayments) {
    let records = JSON.parse(stgPayments)

    for (let index = 0; index < records.length; index++) {
        let recordContent = JSON.parse(records[index])
        let orderN = index + 1
        let idOrderN = "Payment" + index

        if (recordContent.saved) {
            let record = document.createElement("li")
            record.innerHTML = "Pago N° " + (orderN)
            record.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
            record.setAttribute("id", idOrderN)
            record.appendChild(deleteButton())
            document.getElementById("records").appendChild(record)
            recordContent.saved = true
            storagedPayments.splice(index, 1)
            storagedPayments.push(JSON.stringify(recordContent))
        }


        localStorage.paymentRecord = JSON.stringify(storagedPayments)
    }


}

function deleteButton() {
    let trashIconBuilderButton = document.createElement("button")
    trashIconBuilderButton.setAttribute("type", "button")
    trashIconBuilderButton.setAttribute("class", "btn btn-danger btn-sm")
    trashIconBuilderButton.setAttribute("id", "deleteButton")
    trashIconBuilderButton.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor"  xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd"       d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" /></svg>'
    let trashcanIcon = trashIconBuilderButton
    return trashcanIcon
}