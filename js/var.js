const normalBorder = "#ced4da"

var currentChart

var govInflation = {
    "total": {
        "nominal": 0,
        "percentage": 0
    },
    "byMonth": {
        "nominal": [],
        "percentage": []
    }

}

var storagedPayments = []

var methodText = {
    cash: " al contado.",
    credit: " en cuotas.",
    same: " con cualquiera de los dos."
}