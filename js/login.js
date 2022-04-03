$(document).ready(function () {
    var userInfo = localStorage.getItem("user");
    try {
        var user = JSON.parse(userInfo);
        var date = new Date(user.loginDate);
        date.setDate(date.getDate() + 7);
        if (new Date() < date){
            jump(user);
        }
    } catch (error) {

    }
    $(".loginButton").click(function () {
        var email = $(".email").val();
        var password = $(".password").val();
        $.ajax({
            url: "http://localhost:8080/SunshineAirlines/login",
            type: "post",
            data: "email=" + email + "&password=" + password,
            success: function (msg) {
                var obj = JSON.parse(msg);
                if (obj.flag == "success") {
                    var user = obj.data;
                    if($(".is7day").is(":checked")){
                        user.loginDate=new Date();
                    }
                    localStorage.setItem("user", JSON.stringify(user));
                    jump(user);
                } else {
                    $(".alertInfo").text(obj.data);
                }
            }
        })
    })
})
function jump(user) {
    if (user.RoleId == 1) {
        location.href = "./OfficeUserMenu.html";
    }
    if (user.RoleId == 2) {
        location.href = "./UserManagement.html";
    }
}