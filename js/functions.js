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
    unselectRecord()
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
        let idOrderN = "Payment" + (records.length - 1)

        if (!recordContent.saved) {
            spawnRecord(recordContent, idOrderN)
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
        let idOrderN = "Payment" + index

        if (recordContent.saved) {
            spawnRecord(recordContent, idOrderN)
        }
    }


}

function spawnRecord(recordContent, idOrderN) {
    let record = document.createElement("li")
    let recordName = document.createElement("p")
    recordName.setAttribute("class", "mr-auto mb-0 mt-0 align-self-center bd-highlight")
    recordName.innerHTML = recordContent.creationDate
    record.appendChild(recordName)
    if (recordContent.plotted) {
        record.setAttribute("class", "list-group-item d-flex bd-highlight active")
    } else {
        record.setAttribute("class", "list-group-item d-flex bd-highlight")
    }
    record.setAttribute("id", idOrderN)
    record.appendChild(reloadButton())
    record.appendChild(deleteButton())
    document.getElementById("records").appendChild(record)
}

function deleteRecord() {
    storagedPayments = JSON.parse(localStorage.paymentRecord)
    let recordId = this.parentNode.id

    for (let index = 0; index < storagedPayments.length; index++) {
        let recordContent = JSON.parse(storagedPayments[index])
        let idOrderN = "Payment" + index

        if (recordId.replace("Payment", "") == index) {
            storagedPayments.splice(index, 1)
            let recordToDelete = document.getElementById(idOrderN)
            recordToDelete.parentNode.removeChild(recordToDelete)
            if (recordContent.plotted) {
                document.getElementById("fullPayment").value = ""
                document.getElementById("paymentAmount").value = ""
                document.getElementById("paymentValue").value = ""
                document.getElementById("averageMonthlyInflation").value = ""
            }
        }

    }
    while (document.getElementById("records").firstChild) {
        document.getElementById("records").removeChild(document.getElementById("records").lastChild)
    }
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
    loadRecord(localStorage.paymentRecord)


}

function reloadRecord() {
    storagedPayments = JSON.parse(localStorage.paymentRecord)
    let recordId = this.parentNode.id
    let recordContent

    for (let index = 0; index < storagedPayments.length; index++) {
        recordContent = JSON.parse(storagedPayments[index])
        recordContent.plotted = false
        storagedPayments[index] = JSON.stringify(recordContent)

        if (recordId.replace("Payment", "") == index) {
            unselectRecord()
            document.getElementById(recordId).className = "list-group-item d-flex bd-highlight active"
            graphGenerator(recordContent.adjustedPayment, recordContent.pQall)
            document.getElementById("fullPayment").value = 0
            document.getElementById("paymentAmount").value = recordContent.pQ
            document.getElementById("paymentValue").value = recordContent.pV
            document.getElementById("averageMonthlyInflation").value = recordContent.i
            recordContent.plotted = true
            storagedPayments[index] = JSON.stringify(recordContent)
        }

    }
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
}


function deleteButton() {
    let trashIconBuilderButton = document.createElement("button")
    trashIconBuilderButton.setAttribute("type", "button")
    trashIconBuilderButton.setAttribute("class", "btn btn-danger btn-sm mr-1 bd-highlight")
    trashIconBuilderButton.setAttribute("id", "deleteButton")
    trashIconBuilderButton.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor"  xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd"       d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" /></svg>'
    trashIconBuilderButton.onclick = deleteRecord
    let trashcanIcon = trashIconBuilderButton
    return trashcanIcon
}

function reloadButton() {
    let printIconBuilderButton = document.createElement("button")
    printIconBuilderButton.setAttribute("type", "button")
    printIconBuilderButton.setAttribute("class", "btn btn-success btn-sm mr-1 bd-highlight")
    printIconBuilderButton.setAttribute("id", "reloadButton")
    printIconBuilderButton.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-printer-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5z"/>  <path fill-rule="evenodd" d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/><path fill-rule="evenodd" d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/> </svg>'
    printIconBuilderButton.onclick = reloadRecord
    let printIcon = printIconBuilderButton
    return printIcon
}

function timeSet() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hour = date.getHours()
    let min = date.getMinutes()


    return (day + "-" + month + "-" + year + " | " + hour + ":" + min)

}

function unselectRecord() {
    storagedPayments = JSON.parse(localStorage.paymentRecord)

    for (let index = 0; index < storagedPayments.length; index++) {
        recordContent = JSON.parse(storagedPayments[index])
        recordContent.plotted = false
        storagedPayments[index] = JSON.stringify(recordContent)
        let idOrderN = "Payment" + index
        document.getElementById(idOrderN).className = "list-group-item d-flex bd-highlight"
    }
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
}