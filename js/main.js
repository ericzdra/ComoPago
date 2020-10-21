document.getElementById("comoPago").onclick = createPayment

if (localStorage.paymentRecord) {
    reloadingPage = true
    loadRecord(localStorage.paymentRecord, true)
}






