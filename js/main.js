document.getElementById("comoPago").onclick = createPayment
$("#method").toggleClass("d-none", true)

if (localStorage.paymentRecord) {
    loadRecord(localStorage.paymentRecord, true)
}







