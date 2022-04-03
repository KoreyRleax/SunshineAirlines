$(document).ready(function () {
    getUserList(0, "", 1);
    $("#show").click(function(){
        var RoleId=$(".RoleId").val();
        var userName=$(".userName").val();
        getUserList(RoleId,userName,1);
    })
    $(".step-backward").click(function () {
        if (searchObj.startPage == 1) {
            alert("已经是第一页了！");
        } else {
            getUserList(searchObj.roleId, searchObj.name, 1);
        }
    })
    $(".chevron-left").click(function () {
        if (searchObj.startPage == 1) {
            alert("已经是第一页了！");
        } else {
            getUserList(searchObj.roleId, searchObj.name, searchObj.startPage - 1);
        }
    })
    $(".chevron-right").click(function () {
        if (searchObj.startPage == searchObj.pages) {
            alert("已经是最后一页了！");
        } else {
            getUserList(searchObj.roleId, searchObj.name,searchObj.startPage + 1);
        }
    })
    $(".step-forward").click(function () {
        if (searchObj.startPage == searchObj.pages) {
            alert("已经是最后一页了！");
        } else {
            getUserList(searchObj.roleId, searchObj.name, searchObj.pages);
        }
    })
    $(".NUM .pages").change(function(){
        getUserList(searchObj.roleId,searchObj.name,parseInt($(this).val()))
    })
    $("#goAddUser").click(function(){
        localStorage.setItem("userId",0);
        location.href="./EditUser.html";
    })
})
searchObj = {};
function getUserList(roleId, name, startPage) {
    searchObj.roleId = roleId;
    searchObj.name = name;
    searchObj.startPage = startPage;
    $.ajax({
        url: "http://localhost:8080/SunshineAirlines/userList",
        type: "post",
        data: "&roleId=" + roleId + "&name=" + name + "&startPage=" + startPage + "&pageSize=10",
        success: function (msg) {
            var obj = JSON.parse(msg);
            // console.log(obj);
            if (obj.flag == "success") {
                var tableHtml = "";
                for (var i = 0; i < obj.data.length; i++) {
                    var displayRoleId = obj.data[i].RoleId == 1 ? 'Office User' : 'Administrator';
                    var displayGender = obj.data[i].Gender == 'M' ? 'Male' : 'Female';
                    tableHtml += "<tr>";
                    tableHtml += "<td>" + obj.data[i].Email + "</td>";
                    tableHtml += "<td>" + obj.data[i].FirstName + " " + obj.data[i].LastName + "</td>";
                    tableHtml += "<td>" + displayGender + "</td>";
                    tableHtml += "<td>" + obj.data[i].DateOfBirth + "</td>";
                    tableHtml += "<td>" + obj.data[i].Phone + "</td>";
                    tableHtml += "<td>" + displayRoleId + "</td>";
                    tableHtml += "<td><input class='editUser' onClick='editUser(" + obj.data[i].UserId + ")' style='width: 80px;  font-size: 16px;' type='button' value='Edit'/></td>";
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
function editUser(userId) {
    localStorage.setItem("userId",userId);
    location.href="./EditUser.html";
}