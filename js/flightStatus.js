$(document).ready(function () {
    $("#searchFlightStatus").click(function () {
        var departureDate = $(".departureDate").val();
        getFlightStatus(departureDate, 1);
    })
    $(".step-backward").click(function () {
        if (searchObj.startPage == 1) {
            alert("已经是第一页了！");
        } else {
            getFlightStatus(searchObj.departureDate, 1);
        }
    })
    $(".chevron-left").click(function () {
        if (searchObj.startPage == 1) {
            alert("已经是第一页了！");
        } else {
            getFlightStatus(searchObj.departureDate, searchObj.startPage - 1);
        }
    })
    $(".chevron-right").click(function () {
        if (searchObj.startPage == searchObj.pages) {
            alert("已经是最后一页了！");
        } else {
            getFlightStatus(searchObj.departureDate, searchObj.startPage + 1);
        }
    })
    $(".step-forward").click(function () {
        if (searchObj.startPage == searchObj.pages) {
            alert("已经是最后一页了！");
        } else {
            getFlightStatus(searchObj.departureDate, searchObj.pages);
        }
    })
    $(".NUM .pages").change(function () {
        getFlightStatus(searchObj.departureDate, parseInt($(this).val()));
    })
})
searchObj = {};
function getFlightStatus(departureDate, startPage) {
    searchObj.departureDate = departureDate;
    searchObj.startPage = startPage;
    $.ajax({
        url: "http://localhost:8080/SunshineAirlines/getFlightStatus",
        type: "post",
        data: "departureDate=" + departureDate + "&startPage=" + startPage + "&pageSize=10",
        success: function (msg) {
            var obj = JSON.parse(msg);
            if (obj.flag == "success") {
                var tableHtml = "";
                for (var i = 0; i < obj.data.length; i++) {
                    //计划起飞日期+飞行时间
                    var t1 = new Date(obj.data[i].Date);//计划起飞日期
                    var t2 = obj.data[i].FlightTime;//飞行时间
                    var t3 = t1.setMinutes(t1.getMinutes() + t2);//计划到达时间
                    t3 = new Date(t3);
                    var hour = t3.getHours() < 10 ? "0" + t3.getHours() : t3.getHours();
                    var minute = t3.getMinutes() < 10 ? "0" + t3.getMinutes() : t3.getMinutes();
                    //航班状态
                    var timediff = (new Date(obj.data[i].ActualArrivalTime) - new Date(t3)) / (1000 * 60);
                    var statusMsg = "";
                    if (timediff < 0) {
                        statusMsg = "Early" + (-timediff) + "minutes";
                    } else if (timediff > 0) {
                        statusMsg = "Delay" + timediff + "minutes";
                    } else {
                        statusMsg = "On Time";
                    }
                    tableHtml += "<tr>";
                    tableHtml += "<td>" + ((i + 1) + (searchObj.startPage - 1) * 10) + "</td>";
                    tableHtml += "<td>" + obj.data[i].FlightNumber + "</td>";
                    tableHtml += "<td>" + obj.data[i].DepartCityName + "/" + obj.data[i].DepartureAirportIATA + "</td>";
                    tableHtml += "<td>" + obj.data[i].ArriveCityName + "/" + obj.data[i].ArrivalAirportIATA + "</td>";
                    tableHtml += "<td>" + obj.data[i].Time.substring(0, 5) + "</td>";
                    tableHtml += "<td>" + hour + ":" + minute + "</td>";
                    tableHtml += "<td>" + obj.data[i].ActualArrivalTime.substring(11, 16) + "</td>";
                    tableHtml += "<td>" + obj.data[i].Gate + "</td>";
                    tableHtml += "<td>" + statusMsg + "</td>";
                    tableHtml += "</tr>";
                }
                $(".formclass tbody").html(tableHtml);
                $(".formclass tbody tr:odd").addClass("tdcolor");
                $(".formclass tbody tr:even").addClass("tdcolor1");
                var page = obj.page.total;
                searchObj.pages = page % 10 === 0 ? parseInt(page / 10) : parseInt((page / 10) + 1);
                $(".pages").text(searchObj.pages);
                $(".totals").text(page);
                var optionHtml = "";
                for (var i = 1; i <= searchObj.pages; i++) {
                    if (searchObj.startPage == i) {
                        optionHtml += "<option selected value='" + i + "'>" + i + "</option>";
                    } else {
                        optionHtml += "<option  value='" + i + "'>" + i + "</option>";
                    }
                }
                $(".NUM .pages").html(optionHtml)
            }
        }
    })
}