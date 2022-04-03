$(document).ready(function(){
    // 出发日期选择
    $(".departureDate").change(function(){
        var departureDate = $(".departureDate").val();
        $(".returnDate").prop("min",departureDate);
    })
    // 设置单程和往返程
    $(".wayRadio").change(function(){
       if($(this).val() == 1){
            $(".returnDateCondition").hide();
       }else{
            $(".returnDateCondition").show();
       }
    })


    //初始化城市
    //加载往返的城市
    $.ajax({
        type:"post",
        url:"http://localhost:8080/SunshineAirlines/getCityNames",
        data:"",
        success:function(msg){
            var json = JSON.parse(msg);
            if(json.flag == "success"){
                var optionHtml = "";
                for(var i=0;i<json.data.length;i++){
                    optionHtml+= "<option value='"+json.data[i].CityName+"'>"+json.data[i].CityName+"</option>";
                }
                $(".fromCity").html(optionHtml);
                $(".toCity").html(optionHtml);
            }
        }
    })
    
    // 查询search按钮的单击事件
    $(".searchFlight").click(function(){
        //1.获取条件值
        var fromCity = $(".fromCity").val();
        var toCity = $(".toCity").val();
        var departureDate = $(".departureDate").val();
        var cabinTypeId = $(".cabinType").val();
        var flightType = $(".flightType").val();
        var paramStr = "fromCity="+fromCity+"&toCity="+toCity+"&departureDate="+departureDate+"&cabinTypeId="+cabinTypeId+"&flightType="+flightType;
        //2.判断单程票还是双程票
        if($(".oneWay").prop("checked")){
            //单程
            loadSearchList("departureFlightList",paramStr);
            $(".returnFlighTitle").hide();
            $(".returnFlightList").hide();
        }else{
            //往返双程
            var returnDate = $(".returnDate").val();
            var departParamStr = paramStr;
            var returnParamStr =  "fromCity="+toCity+"&toCity="+fromCity+"&departureDate="+returnDate+"&cabinTypeId="+cabinTypeId+"&flightType="+flightType;
            loadSearchList("departureFlightList",departParamStr);  //出发航线
            loadSearchList("returnFlightList",returnParamStr);   //返程航线
            $(".returnFlighTitle").show();
            $(".returnFlightList").show();
        }
    })
})

// 航线查询方法：类名、参数字符串
function loadSearchList(className,paramStr){
    var cabinTypeId = $(".cabinType").val();
    $.ajax({
        type:"post",
        url:"http://localhost:8080/SunshineAirlines/getSearchFlight",
        data:paramStr,
        async:false,
        success:function(msg){
            var json = JSON.parse(msg);
            if(json.flag == "success"){
                var html = "";
                for(var i=0;i<json.data.length;i++){
                    var scheduleObj = json.data[i];
                    var scheduleId = scheduleObj.ScheduleId;
                    //判断数据类型（是无中转或有中转数据）
                    if(scheduleId != null && scheduleId != undefined){
                        html+= getNonStopHtmlStr(scheduleObj,cabinTypeId);  //没有中转
                    }else{
                        html+= get1StopHtmlStr(scheduleObj,cabinTypeId);  //有一次中转
                    }
                }
                $("."+className).html(html);
            }
        }
    })
}

// 没有中转的航线查询方法
function getNonStopHtmlStr(scheduleObj,cabinTypeId){
    //获取时间间隔字符串
    var flightTimeStr = getTimeDiffStr(scheduleObj.FlightTime);    
    var cabinTypeName = "";
    var price = scheduleObj.EconomyPrice;
    if(cabinTypeId == 1) {
        cabinTypeName="Economy";
        price = price.toFixed(2);
    }else if(cabinTypeId == 2) {
        cabinTypeName="Business";
        price = (price*1.25).toFixed(2);
    }else{
        cabinTypeName="First";
        price = (price*1.5).toFixed(2);
    }
    var dateStr = scheduleObj.Date.substring(0,16);
    var preArrivalTimeStr = scheduleObj.PreArrivalTime.substring(0,16);
    var ontimeRate = (scheduleObj.NotDelay*100/scheduleObj.AllCount).toFixed(2);    
    //无中转（non-stop），数据中有scheduleId这个字段
    var htmlStr="<div class='innermsg'>"+
        "<div class='optionone' style='margin: auto;'>"+
            "<input name='Flight' type='radio' />Select"+
            "</div>"+
            "<div class='innerlist'>"+
            "<p>$"+price+"</p>"+
            "<p>"+cabinTypeName+"</p>"+
            "<p>Flight "+scheduleObj.FlightNumber+"("+ontimeRate+"%)</p>"+
        "</div>"+
        "<div class='innerlist' style='width: 450px;'>"+
            "<div class='placelist'> "+
                "<p class='citymsg'>"+scheduleObj.DepartCityName+"/"+scheduleObj.DepartureAirportIATA+"</p>"+
                "<p class='datemsg'>"+dateStr+"</p>"+
            "</div>"+
            "<div class='placelist'> "+
                "<div class='citymsg'>"+scheduleObj.ArriveCityName+"/"+scheduleObj.ArrivalAirportIATA+"</div>"+
                "<div class='datemsg'>"+preArrivalTimeStr+"</div>"+ 
            "</div>"+
        "</div>"+
        "<div class='innerlist'>"+
            "<p>Non-stop </p>"+
            "<p>Total time:"+flightTimeStr+"</p>"+
            "<p style='color: red;'>"+scheduleObj.ResidueTickets+" available tickets</p>"+   
        "</div>"+
    "</div>";
    return htmlStr;
}
// 有中转的航线查询方法
function get1StopHtmlStr(scheduleObj,cabinTypeId){
    var cabinTypeName = "";
    var price = scheduleObj.S1EconomyPrice + scheduleObj.S2EconomyPrice;
    if(cabinTypeId == 1) {
        cabinTypeName="Economy";
        price = price.toFixed(2);
    }else if(cabinTypeId == 2) {
        cabinTypeName="Business";
        price = (price*1.25).toFixed(2);
    }else{
        cabinTypeName="First";
        price = (price*1.5).toFixed(2);
    }
    var s1OntimeRate = (scheduleObj.S1NotDelay*100/scheduleObj.S1AllCount).toFixed(2);
    var s2OntimeRate = (scheduleObj.S2NotDelay*100/scheduleObj.S2AllCount).toFixed(2);    
    var s1DateStr = scheduleObj.S1Date.substring(0,16);
    var s2DateStr = scheduleObj.S2Date.substring(0,16);
    var s1PreArrivalTimeStr = scheduleObj.S1PreArrivalTime.substring(0,16);
    var s2PreArrivalTimeStr = scheduleObj.S2PreArrivalTime.substring(0,16);
    var waitTime = (new Date(s2DateStr)-new Date(s1PreArrivalTimeStr))/60000;
    var waitTimeStr = getTimeDiffStr(waitTime);
    var totalTime = scheduleObj.S1FlightTime+ waitTime+ scheduleObj.S2FlightTime;
    var totalTimeStr = getTimeDiffStr(totalTime);
    var s1ResidueTickets = scheduleObj.S1ResidueTickets;
    var s2ResidueTickets = scheduleObj.S2ResidueTickets;
    var residueTickets = s1ResidueTickets<=s2ResidueTickets?s1ResidueTickets:s2ResidueTickets;
    var htmlStr="<div class='stopinnermsg'>"+
                    "<div class='optionone' style='margin: auto;'>"+
                    "<input name='Flight' type='radio' />Select"+
                    "</div>"+
                    "<div class='innerlist' style='height: 120px;'>"+
                        "<p  class=''>$"+price+"</p>"+
                        "<p  class=''>"+cabinTypeName+"</p>"+
                        "<p  class=''>Flight "+scheduleObj.S1FlightNumber+"("+s1OntimeRate+"%)</p>"+
                        "<p  class=''>Flight "+scheduleObj.S2FlightNumber+"("+s2OntimeRate+"%)</p>"+     
                    "</div>"+
                    "<div class='linelist' style='height: 204px;'>"+
                        "<div class='placelist'> "+                    
                            "<p class='citymsg'>"+scheduleObj.S1DepartCityName+"/"+scheduleObj.S1DepartureAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s1DateStr+"</p>"+
                            "<p class='citymsg'>"+scheduleObj.S1ArriveCityName+"/"+scheduleObj.S1ArrivalAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s1PreArrivalTimeStr+"</p>"+
                        "</div>"+
                        "<div class='stoplist'> "+
                            "<p>"+waitTimeStr+" transfer in "+scheduleObj.S1ArriveCityName+"/"+scheduleObj.S1ArrivalAirportIATA+"</p>"+
                        "</div>"+
                        "<div class='placelist'>"+                     
                            "<p class='citymsg'>"+scheduleObj.S2DepartCityName+"/"+scheduleObj.S2DepartureAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s2DateStr+"</p>"+
                            "<p class='citymsg'>"+scheduleObj.S2ArriveCityName+"/"+scheduleObj.S2ArrivalAirportIATA+"</p>"+
                            "<p class='datemsg'>"+s2PreArrivalTimeStr+"</p> "+               
                        "</div>"+
                    "</div>"+
                    "<div class='innerlist' >"+
                        "<p>1-stop </p>"+
                        "<p>Total time:"+totalTimeStr+"</p>"+
                        "<p>"+residueTickets+" available tickets</p> "+ 
                    "</div>"+
                "</div> ";
    return htmlStr;
}

//根据总分钟数获取XhXm的格式字符串：将分钟转换为小时和分钟
function getTimeDiffStr(timeDiff){
    var timeDiffHour = parseInt(timeDiff/60);
    var timeDiffMinute = timeDiff%60;
    var timeDiffStr = "";
    if(timeDiffHour >0){
        timeDiffStr+=timeDiffHour+" h ";
    }
    if(timeDiffMinute>0){
        timeDiffStr+=timeDiffMinute+" m";
    }
    return timeDiffStr;
}