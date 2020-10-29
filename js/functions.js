function createPayment() {
    var myPaymentVariables = new PaymentVariables(
        $("#cash").val(),
        $("#paymentAmount").val(),
        $("#paymentValue").val(),
        $("#averageMonthlyInflation").val()
    )
    if (validateInput(myPaymentVariables)) {
        return
    }

    var myPayment = new Payment(myPaymentVariables.paymentAmount, myPaymentVariables.paymentValue, myPaymentVariables.cash, myPaymentVariables.averageMonthlyInflation)
    if (localStorage.paymentRecord) {
        unselectRecord()
    }
    graphGenerator(myPayment.adjustedPayment, myPayment.pQall)
    storagedPayments.push(JSON.stringify(myPayment))
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
    firstTime = true
    updateRecord(localStorage.paymentRecord)
}

function validateInput(variables) {
    let bad = false
    for (let index = 0; index < Object.entries(variables).length; index++) {

        if (!Object.entries(variables)[index][1]) {
            $(`#${Object.entries(variables)[index][0]}`).css("border-color", "red")
            bad = true

        } else {
            $(`#${Object.entries(variables)[index][0]}`).css("border-color", normalBorder)
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

function loadRecord(stgPayments, clean, noAnim) {
    let records = JSON.parse(stgPayments)

    if (clean) {
        unselectRecord()
    }
    if (records.length == 0) {
        $("#nothingToShow").toggleClass("d-none", false)
    }

    for (let index = 0; index < records.length; index++) {
        let recordContent = JSON.parse(records[index])
        let idOrderN = "Payment" + index
        if (recordContent.saved) {
            spawnRecord(recordContent, idOrderN, clean, noAnim)
        }
    }


}

function spawnRecord(recordContent, idOrderN, clean, noAnim) {
    $("#nothingToShow").toggleClass("d-none", true)
    if (!clean && firstTime) {
        resultText(recordContent)
    }

    if (noAnim) {
        $("#records").append($("<li></li>").attr({
            id: idOrderN,
            class: "list-group-item d-flex bd-highlight"
        }))
    } else {
        $("#records").append($("<li></li>").attr({
            id: idOrderN,
            class: "animate__animated animate__slideInDown animate__faster list-group-item d-flex bd-highlight"
        }))
    }

    $(`#${idOrderN}`).append($("<p></p>").attr("class", "mr-auto mb-0 mt-0 align-self-center bd-highlight"))
    $(`#${idOrderN}`).children("p").text(recordContent.creationDate)
    $(`#${idOrderN}`).append(reloadButton())
    $(`#${idOrderN}`).append(deleteButton())
    if (recordContent.plotted && !clean) {
        $(`#${idOrderN}`).toggleClass("active", true)
    } else {
        $(`#${idOrderN}`).toggleClass("active", false)
    }
    firstTime = false
}

function deleteRecord() {
    storagedPayments = JSON.parse(localStorage.paymentRecord)
    let recordId = this.parentNode.id


    for (let index = 0; index < storagedPayments.length; index++) {
        let recordContent = JSON.parse(storagedPayments[index])
        let idOrderN = "Payment" + index

        if (recordId.replace("Payment", "") == index) {
            storagedPayments.splice(index, 1)
            $(`#${idOrderN}`).remove()
            if (recordContent.plotted) {
                $("#cash").val("")
                $("#paymentAmount").val("")
                $("#paymentValue").val("")
                $("#averageMonthlyInflation").val("")
                resultText(recordContent, true)
            }

        }

    }

    while ($("#records").children().length) {
        $("#records").empty()
    }

    localStorage.paymentRecord = JSON.stringify(storagedPayments)
    loadRecord(localStorage.paymentRecord, false, true)
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
            $(`#${recordId}`).toggleClass("active", true)
            graphGenerator(recordContent.adjustedPayment, recordContent.pQall)
            $("#cash").val(recordContent.cash)
            $("#paymentAmount").val(recordContent.pQ)
            $("#paymentValue").val(recordContent.pV)
            $("#averageMonthlyInflation").val(recordContent.i)
            recordContent.plotted = true
            storagedPayments[index] = JSON.stringify(recordContent)
            resultText(recordContent)
        }

    }
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
}


function deleteButton() {
    let button = $("<button></button>").html('<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor"  xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd"       d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" /></svg>')
    $(button).attr({
        type: "button",
        class: "btn btn-danger btn-sm mr-1 bd-highlight",
        id: "deleteButton"
    })
    $(button).click(deleteRecord)

    return button
}

function reloadButton() {

    let button = $("<button></button>").html('<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-printer-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5z"/>  <path fill-rule="evenodd" d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/><path fill-rule="evenodd" d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/> </svg>')
    $(button).attr({
        type: "button",
        class: "btn btn-success btn-sm mr-1 bd-highlight",
        id: "reloadButton"
    })
    $(button).click(reloadRecord)

    return button
}

function timeSet() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hour = date.getHours()
    let min = date.getMinutes()

    function check(n) {
        if (n.toString().length == 1) {
            return ("0" + n.toString())
        } else {
            return n
        }
    }

    return (check(day) + "/" + check(month) + "/" + year + " | " + check(hour) + ":" + check(min))

}

function unselectRecord() {
    storagedPayments = JSON.parse(localStorage.paymentRecord)

    for (let index = 0; index < storagedPayments.length; index++) {
        recordContent = JSON.parse(storagedPayments[index])
        recordContent.plotted = false
        storagedPayments[index] = JSON.stringify(recordContent)
        let idOrderN = "Payment" + index
        $(`#${idOrderN}`).toggleClass("active", false)
    }
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
}

function resultText(payment, hide) {
    let result

    $.ajax({
        url: "/js/methodText.json",
        method: "GET",
        dataType: "json"
    }).done(function (output) {
        for (let index = 0; index < Object.entries(output).length; index++) {
            if (payment.method == Object.entries(output)[index][0]) {
                result = Object.entries(output)[index][1]
            }
        }
        if (hide == undefined) {
            $("#method").toggleClass("d-none", false)
        } else {
            $("#method").toggleClass("d-none", true)
        }
    
        $("#method").children().text(result)
    })



    



}