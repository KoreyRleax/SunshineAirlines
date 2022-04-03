$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8080/SunshineAirlines/getCityNames",
        data: "",
        type: "post",
        success: function (msg) {
            var obj = JSON.parse(msg);
            if (obj.flag == "success") {
                var optionHtml = "";
                for (var i = 0; i < obj.data.length; i++) {
                    optionHtml += "<option value='" + obj.data[i].CityName + "'>" + obj.data[i].CityName + "</option>";
                }
                $(".fromCity").html(optionHtml);
                $(".toCity").html(optionHtml);
            }
        }
    })
    $(".changeicon").click(function () {
        var leftVal = $(".fromCity").val();
        var rightVal = $(".toCity").val();
        $(".fromCity").val(rightVal);
        $(".toCity").val(leftVal);
    })
    $("#show").click(function () {
        getScheduleList();
    })
})
function getScheduleList() {
    var fromCity = $(".fromCity").val();
    var toCity = $(".toCity").val();
    var startDate = $(".startDate").val();
    var endDate = $(".endDate").val();
    $.ajax({
        url: "http://localhost:8080/SunshineAirlines/getSchedule",
        data: "fromCity=" + fromCity + "&toCity=" + toCity + "&startDate=" + startDate + "&endDate=" + endDate,
        type: "post",
        success: function (msg) {
            var obj = JSON.parse(msg);
            if (obj.flag == "success") {
                var html = "";
                for (var i = 0; i < obj.data.length; i++) {
                    var buttonName = obj.data[i].Status === "Confirmed" ? "cancel" : "confirm";
                    html += "<tr>"
                    html += "<td>" + obj.data[i].Date.substring(0, 10) + "</td>"
                    html += "<td>" + obj.data[i].Time.substring(0, 5) + "</td>"
                    html += "<td>" + obj.data[i].DepartCityName + "/" + obj.data[i].DepartureAirportIATA + "</td>"
                    html += "<td>" + obj.data[i].ArriveCityName + "/" + obj.data[i].ArrivalAirportIATA + "</td>"
                    html += "<td>" + obj.data[i].Name + "</td>"
                    html += "<td>" + obj.data[i].EconomyPrice + "</td>"
                    html += "<td>" + obj.data[i].FlightNumber + "</td>"
                    html += "<td>" + obj.data[i].Gate + "</td>"
                    html += "<td>" + obj.data[i].Status + "</td>"
                    html += "<td><input type='button' value='detail' onclick='scheduleDetail("+obj.data[i].ScheduleId+")'/>\&nbsp<input type='button' value='" + buttonName + "' onclick='updateScheduleStatus(" + obj.data[i].ScheduleId + "," + '"' + obj.data[i].Status + '"' + ")'/></td>"
                    html += "</tr>"
                }
                $(".formclass tbody").html(html);
                $(".formclass tbody tr:odd").addClass("tdcolor");
                $(".formclass tbody tr:even").addClass("tdcolor1");
            }
        }
    })
}
function scheduleDetail(scheduleId){
    localStorage.setItem("scheduleId",scheduleId);
    location.href="TicketSalesDetail.html";
}
function updateScheduleStatus(scheduleId, status) {
    var targetStatus = status === "Confirmed" ? "Canceled" : "Confirmed";
    $.ajax({
        url: "http://localhost:8080/SunshineAirlines/updateSchedule",
        data: "scheduleId=" + scheduleId + "&status=" + targetStatus,
        type: "post",
        success: function (msg) {
            var obj = JSON.parse(msg);
            if (obj.flag == "success") {
                getScheduleList();
            } else {
                alert(obj.data);
            }
        }
    })
}
