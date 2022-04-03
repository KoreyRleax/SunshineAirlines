$(document).ready(function () {
    var scheduleId = localStorage.getItem("scheduleId");
    $.ajax({
        url: "http://localhost:8080/SunshineAirlines/getScheduleDetail",
        data: "scheduleId=" + scheduleId,
        type: "post",
        success: function (msg) {
            var obj = JSON.parse(msg);
            console.log(obj);
            if (obj.flag == "success") {
                var scheduleInfo = obj.data.ScheduleInfo;
                var scheduleInfoText = scheduleInfo.DepartureAirportIATA + " to " + scheduleInfo.ArrivalAirportIATA + "," + scheduleInfo.Date.substring(0, 10) + "," +
                    scheduleInfo.Time.substring(0, 5) + "," + scheduleInfo.Name;
                $(".scheduleInfo").html(scheduleInfoText);
                if (scheduleInfo.AircraftId == 2) {
                    $(".aircraft1").hide();
                    $(".aircraft2").show();
                }
                var firstAllCounts = scheduleInfo.FirstSeatsAmount;
                var firstSelectedCounts = 0;
                var firstSoldCounts = 0;
                var businessSeatsAmount = scheduleInfo.BusinessSeatsAmount;
                var businessSelectedCounts = 0;
                var businessSoldCounts = 0;
                var economySeatsAmount = scheduleInfo.EconomySeatsAmount;
                var economySelectedCounts = 0;
                var economySoldCounts = 0;
                for (var i = 0; i < obj.data.TicketInfoList.length; i++) {
                    var ticketInfo = obj.data.TicketInfoList[i];
                    if (ticketInfo.CabinTypeId == 1) {
                        economySelectedCounts = ticketInfo.SelectedCounts;
                        economySoldCounts = ticketInfo.SoldCounts;
                    }
                    else if (ticketInfo.CabinTypeId == 2) {
                        businessSelectedCounts = ticketInfo.SelectedCounts;
                        businessSoldCounts = ticketInfo.SoldCounts;
                    }
                    else {
                        firstSelectedCounts = ticketInfo.SelectedCounts;
                        firstSoldCounts = ticketInfo.SoldCounts;
                    }
                }
                var firstHtmlStr = getHtmlStr(firstAllCounts, firstSelectedCounts, firstSoldCounts);
                $(".firstMsg").append(firstHtmlStr);
                var businessHtmlStr = getHtmlStr(businessSeatsAmount, businessSelectedCounts, businessSoldCounts);
                $(".businessMsg").append(businessHtmlStr);
                var economylStr = getHtmlStr(economySeatsAmount, economySelectedCounts, economySoldCounts);
                $(".economyMsg").append(economylStr);
            }
            for (var i = 0; i < obj.data.SeatLayoutList.length; i++) {
                var seatLayoutInfo = obj.data.SeatLayoutList[i];
                var cabinTypeId = seatLayoutInfo.CabinTypeId;
                if (cabinTypeId == 1) {
                    className = "economy";
                } else if (cabinTypeId == 2) {
                    className = "business";
                } else {
                    className = "first";
                }
                className += seatLayoutInfo.ColumnName;
                var selectedSeatName = seatLayoutInfo.RowNumber + seatLayoutInfo.ColumnName;
                var htmlStr = "<div class='busseat " + selectedSeatName + "'>" + selectedSeatName + "</div>";
                $("." + className).append(htmlStr);
            }
            for (var i = 0; i < obj.data.SelectedSeatList.length; i++) {
                var selectedSeatInfo = obj.data.SelectedSeatList[i];
                var selectedSeatName = selectedSeatInfo.RowNumber + selectedSeatInfo.ColumnName;
                $("." + selectedSeatName).addClass("selected");
            }
        }
    })
})

function getHtmlStr(allCounts, selectedCounts, soldCounts) {
    var soldRate = 100* (soldCounts / allCounts).toFixed(2);
    var htmlstr = "<p>" + soldCounts + "/" + allCounts + " " + soldRate + "%</p>" +
        "<p>Total Tickets:" + allCounts + "</p>" +
        "<p>Sold Tickets:" + soldCounts + "</p>" +
        "<p>Seat Selected:" + selectedCounts + "</p>";
    return htmlstr;
}