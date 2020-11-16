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

    $("#govInf").prop("checked", false)

    var myPayment = new Payment(myPaymentVariables.paymentAmount, myPaymentVariables.paymentValue, myPaymentVariables.cash, myPaymentVariables.averageMonthlyInflation)

    myPayment.saved = true

    storagedPayments.push(JSON.stringify(myPayment))
    localStorage.paymentRecord = JSON.stringify(storagedPayments)
    recordHandler(localStorage.paymentRecord, "new")

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
}

function deleteButton() {
    let button = $("<button></button>").html('<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor"  xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd"       d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" /></svg>')
    $(button).attr({
        type: "button",
        class: "btn btn-danger btn-sm mr-1 bd-highlight",
        id: "deleteButton"
    })
    $(button).click(function () {
        let id = $(this).parent().attr("id")
        id = id.replace("Payment", "")
        recordHandler(localStorage.paymentRecord, "delete", id)
    })

    return button
}

function reloadButton() {

    let button = $("<button></button>").html('<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-printer-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5z"/>  <path fill-rule="evenodd" d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/><path fill-rule="evenodd" d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/> </svg>')
    $(button).attr({
        type: "button",
        class: "btn btn-success btn-sm mr-1 bd-highlight",
        id: "reloadButton"
    })
    $(button).click(function () {
        let id = $(this).parent().attr("id")
        id = id.replace("Payment", "")
        recordHandler(localStorage.paymentRecord, "print", id)
    })

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

function resultText(recordContent, hide) {
    let result

    $.ajax({
        url: "/js/methodText.json",
        method: "GET",
        dataType: "json"
    }).done(function (output) {
        for (let index = 0; index < Object.entries(output).length; index++) {
            if (recordContent.method == Object.entries(output)[index][0]) {
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

function recordHandler(stgPayments, action, id) {

    let records = JSON.parse(stgPayments)
    let recordContent

    if (records.length > 0) {
        $("#nothingToShow").toggleClass("d-none", true)
    } else {
        $("#nothingToShow").toggleClass("d-none", false)
    }

    switch (action) {
        case "new":

            if ($("li.active").length) {
                unselectRecord(records)
            }

            recordContent = JSON.parse(records[records.length - 1])

            recordContent.plotted = spawnRecord(recordContent, (records.length - 1))

            resultText(recordContent)

            graphGenerator(recordContent.adjustedPayment, recordContent.pQall)

            storagedPayments[records.length - 1] = JSON.stringify(recordContent)

            localStorage.paymentRecord = JSON.stringify(storagedPayments)

            break;

        case "print":

            if ($("li.active").attr("id") == `Payment${id}`) {

                break;

            } else {

                unselectRecord(records)

            }

            recordContent = JSON.parse(records[id])

            $(`#Payment${id}`).toggleClass("active", true)
            graphGenerator(recordContent.adjustedPayment, recordContent.pQall)
            $("#cash").val(recordContent.cash)
            $("#paymentAmount").val(recordContent.pQ)
            $("#paymentValue").val(recordContent.pV)
            $("#averageMonthlyInflation").val(recordContent.i)
            recordContent.plotted = true
            storagedPayments[id] = JSON.stringify(recordContent)
            resultText(recordContent)

            break;

        case "delete":

            if ($("li.active").attr("id") == `Payment${id}`) {
                unselectRecord(records)
            }

            storagedPayments.splice(id, 1)
            $(`#Payment${id}`).remove()


            $("li").each(function (index) {
                $(this).attr("id", `Payment${index}`)
            })

            localStorage.paymentRecord = JSON.stringify(storagedPayments)

            if (storagedPayments.length == 0) {
                $("#nothingToShow").toggleClass("d-none", false)
            }

            break;

        case "reload":

            records.forEach(function (item, index) {
                recordContent = JSON.parse(item)
                let idOrderN = "Payment" + index
                $("#records").append($("<li></li>").attr({
                    id: idOrderN,
                    class: "animate__animated animate__slideInDown animate__faster list-group-item d-flex bd-highlight"
                }))
                $(`#${idOrderN}`).append($("<p></p>").attr("class", "mr-auto mb-0 mt-0 align-self-center bd-highlight"))
                $(`#${idOrderN}`).children("p").text(recordContent.creationDate)
                $(`#${idOrderN}`).append(reloadButton())
                $(`#${idOrderN}`).append(deleteButton())
                $(`#${idOrderN}`).toggleClass("active", false)
                recordContent.saved = true
                recordContent.plotted = false
                storagedPayments[index] = JSON.stringify(recordContent)
            })

            localStorage.paymentRecord = JSON.stringify(storagedPayments)

            break;

        default:
            break;
    }




    function spawnRecord(recordContent, id) {
        let idOrderN = "Payment" + id
        $("#records").append($("<li></li>").attr({
            id: idOrderN,
            class: "animate__animated animate__slideInDown animate__faster list-group-item d-flex bd-highlight"
        }))
        $(`#${idOrderN}`).append($("<p></p>").attr("class", "mr-auto mb-0 mt-0 align-self-center bd-highlight"))
        $(`#${idOrderN}`).children("p").text(recordContent.creationDate)
        $(`#${idOrderN}`).append(reloadButton())
        $(`#${idOrderN}`).append(deleteButton())
        $(`#${idOrderN}`).toggleClass("active", true)
        $("#cash").val(recordContent.cash)
        $("#paymentAmount").val(recordContent.pQ)
        $("#paymentValue").val(recordContent.pV)
        $("#averageMonthlyInflation").val(recordContent.i)
        return true

    }

    function unselectRecord(stgPayments) {

        let records = stgPayments
        let recordContent
        let idOrderN = $("li.active").attr("id")

        for (let index = 0; index < records.length; index++) {

            if (idOrderN == `Payment${index}`) {
                recordContent = JSON.parse(records[index])
                recordContent.plotted = false
                storagedPayments[index] = JSON.stringify(recordContent)
                $(`#${idOrderN}`).toggleClass("active", false)
                $("#cash").val("")
                $("#paymentAmount").val("")
                $("#paymentValue").val("")
                $("#averageMonthlyInflation").val("")
                resultText(recordContent, true)
                currentChart.destroy()
            }

        }

        localStorage.paymentRecord = JSON.stringify(storagedPayments)
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

        currentChart = chart

    }
}