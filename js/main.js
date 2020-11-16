document.getElementById("comoPago").onclick = createPayment

$("#method").toggleClass("d-none", true)


$.ajax({
    "url": "https://apis.datos.gob.ar/series/api/series?ids=145.3_INGNACNAL_DICI_M_15&header=ids&collapse=month&start_date=2019-06-01&sort=asc&format=json",
    "method": "GET",
    "timeout": 0,
}).done(function (response) {
    govInflationProjection(response.data)
})

$("#govInf").change(function () {
    if ($(this).is(':checked')) {
        console.log("checked")
        $("#averageMonthlyInflation").val(((govInflation.total.percentage / 12) * 100).toFixed(2))
    } else {
        $("#averageMonthlyInflation").val("")
    }
})

$("#averageMonthlyInflation").change(function () {
    if ($(this).val() != (((govInflation.total.percentage / 12) * 100).toFixed(2))) {
        $("#govInf").prop("checked", false)
    }

})


if (localStorage.paymentRecord) {
    recordHandler(localStorage.paymentRecord, "reload")
}

function govInflationProjection(govInfRaw) {

    let xValues = []

    function LineFitter() {
        this.count = 0;
        this.sumX = 0;
        this.sumX2 = 0;
        this.sumXY = 0;
        this.sumY = 0;
    }

    LineFitter.prototype = {
        'add': function (x, y) {
            this.count++;
            this.sumX += x;
            this.sumX2 += x * x;
            this.sumXY += x * y;
            this.sumY += y;
        },
        'project': function (x) {
            var det = this.count * this.sumX2 - this.sumX * this.sumX;
            var offset = (this.sumX2 * this.sumY - this.sumX * this.sumXY) / det;
            var scale = (this.count * this.sumXY - this.sumX * this.sumY) / det;
            return offset + x * scale;
        }
    };

    function linearProject(data, x) {
        var fitter = new LineFitter();
        for (var i = 0; i < data.length; i++) {
            fitter.add(i, data[i]);
        }
        return fitter.project(x);
    }

    function sumAll(a, b) {
        return parseFloat(a) + parseFloat(b)
    }

    for (let index = 0; index < govInfRaw.length; index++) {
        xValues.push(govInfRaw[index][1])

    }

    for (let index = xValues.length; index < xValues.length + 13; index++) {
        govInflation.byMonth.nominal.push(linearProject(xValues, index))
    }

    for (let index = 0; index < govInflation.byMonth.nominal.length - 1; index++) {
        govInflation.byMonth.percentage.push(
            (govInflation.byMonth.nominal[index + 1] / govInflation.byMonth.nominal[index]) - 1
        )
    }

    govInflation.total.nominal = govInflation.byMonth.nominal.reduce(sumAll)
    govInflation.total.percentage = govInflation.byMonth.percentage.reduce(sumAll)

    console.log(govInflation)

}








