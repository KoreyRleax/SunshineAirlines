$(document).ready(function () {
    var userId = localStorage.getItem("userId");
    if (userId != 0) {
        $(".headtitle").text("Edit User");
        showUserInfo(userId);
    } else {
        $(".headtitle").text("Add User");
    }
    $(".submit").click(function () {
        var email = $(".email").val();
        var firstName = $(".firstName").val();
        var lastName = $(".lastName").val();
        var phone = $(".phone").val();
        var address = $(".address").val();
        var dateOfBirth = $(".dateOfBirth").val();
        var photo=$(".photo").prop("src");
        photo=encodeURIComponent(photo);
        if ($(".roleUser").is(":checked")) {
            var roleId = 1;
        } else {
            var roleId = 2;
        }
        if ($(".genderMale").is(":checked")) {
            var gender = 'M';
        } else {
            var gender = 'F';
        }
        var params = "userId=" + userId + "&email=" + email + "&firstName=" + firstName +
            "&lastName=" + lastName + "&gender=" + gender + "&dateOfBirth=" + dateOfBirth +
            "&photo=" + photo + "&address=" + address + "&phone=" + phone + "&roleId=" + roleId;
        if (userId != 0) {
            $.ajax({
                url: "http://localhost:8080/SunshineAirlines/updateUser",
                type: "post",
                data: params + "&userId" + userId,
                success: function (msg) {
                    var obj = JSON.parse(msg);
                    if (obj.flag == "success") {
                        location.href="./UserManagement.html";
                    }else{
                        alert(obj.data);
                    }
                }
            })
        }
        else {
            $.ajax({
                url: "http://localhost:8080/SunshineAirlines/addUser",
                type: "post",
                data: params + "&userId" + userId,
                success: function (msg) {
                    var obj = JSON.parse(msg);
                    if (obj.flag == "success") {
                        location.href="./UserManagement.html";
                    }else{
                        alert(obj.data);
                    }
                }
            })
        }
    })
    $("#upload-input").change(function(){
        var file=this.files[0];
        var Reader=new FileReader();
        Reader.onload=function(e){
            $(".photo").prop("src",e.target.result);
        }
        Reader.readAsDataURL(file);
    })
})
function showUserInfo(userId) {
    $.ajax({
        url: "http://localhost:8080/SunshineAirlines/getUserInfo",
        type: "post",
        data: "&userId=" + userId,
        success: function (msg) {
            var obj = JSON.parse(msg);
            if (obj.flag == "success") {
                if (obj.data.RoleId == 1) {
                    $(".roleUser").prop("checked", true);
                } else {
                    $(".roleAdministrator").prop("checked", true);
                }
                if (obj.data.Gender == 'M') {
                    $(".genderMale").prop("checked", true);
                } else {
                    $(".genderFemale").prop("checked", true);
                }
                $(".email").val(obj.data.Email);
                $(".firstName").val(obj.data.FirstName);
                $(".lastName").val(obj.data.LastName);
                $(".phone").val(obj.data.Phone);
                $(".address").val(obj.data.Address);
                $(".dateOfBirth").val(obj.data.DateOfBirth);
                $(".photo").prop("src",obj.data.Photo);

            }
        }
    })
}