$(document).ready(function () {
    $(".list_out").click(function () {
        localStorage.setItem("user", "");
        location.href = "./Login.html";
    })
})