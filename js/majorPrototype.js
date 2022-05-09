var apikey = '62315adbdced170e8c83a2c1';
var urlVClassUsers = 'https://eduggan-7bb9.restdb.io/rest/vclassusers';
var urlVClassClassrooms = 'https://eduggan-7bb9.restdb.io/rest/vclassclassrooms';  

var arrVClassUsers = [];
var arrVClassClassrooms = [];

var currentUser = {};
var currentUserId = '';
var tempUserDetails = {};

/* --- Functions --- */

//app users
function getVClassUsers(url,apikey){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        }
    }
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        arrVClassUsers = response;
        currentUserId = response._id
    });
}

function addVClassUser(item, url, apikey){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(item)
    }
    
    $.ajax(settings).done(function (response) {
        console.log('Item successfully added');
        console.log(response);
    });
}

function editUser(item, url, apikey){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(item)
    }
    
    $.ajax(settings).done(function (response) {
        console.log('Item successfully added');
        console.log(response);
    });
}

//app classes
function getVClassClassrooms(url,apikey){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        }
    }
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        arrVClassClassrooms = response;
        //put on screen all classes that user has - linear search
        // var i = 0;
        // var count = 0;
        // var found = false;
        // while (currentUser.UserClasses.length > count){
        //     while (response.length > i && found == false){
        //         console.log (response[i].ClassCode)
        //         console.log (currentUser.UserClasses[count])
        //         if (response[i].ClassCode == currentUser.UserClasses[count]){
        //             var classItem = '<div class="classImg" id="' + response[i]._id + '" ><img class="classImg" src="' + /*response[i].ImgURL*/ 'https://i.etsystatic.com/17709177/r/il/4a73f1/2000608453/il_1588xN.2000608453_aqkw.jpg' + '">' + response[i].ClassName + "</div>";
        //             $("body").append(classItem);
        //             console.log("class appended")
        //             found == true;
        //         }
        //     i ++;
        //     }
        // count ++
        // }
    });
}

function addVClassClassroom(item, url, apikey){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": apikey,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(item)
    }
    
    $.ajax(settings).done(function (response) {
        console.log('Item successfully added');
        console.log(response);
    });
}

function homePage(){
    $("#register-form").hide();
    $("#login-form").hide();
    $(".furniture").hide();
    $("#switchToRegister").hide();
    $("#switchToLogin").hide();
    $(".joinClass").hide();
    $("#homeImgJoin").hide();

    window.scrollTo(0,0)
    $("body").css("background-color","white");

    $("#homePage").show();
    $('#welcome').text("Welcome " + currentUser.FullName);
    //run this function to put class divs on the screen - when working - running at the start for now
        //getVClassClassrooms(urlVClassClassrooms,apikey);
    //put an example class on screen  -- have response[i].ImgURL and arrVClassClassrooms[1]._id, arrVClassClassrooms[1].ClassName
    var classItem = '<div class="classImg" id="mathClassroom"><img src="' + "images/math.jpg" + '" width="100" height="90"><label>' + arrVClassClassrooms[1].ClassName + '</label></div>';

    console.log(classItem)
    //$("body").append(classItem);
}

//function to check if user has ability to create or add class 
function newClass(){
    if(currentUser.UserType == "student"){
        $("#addClass").show();
    }else{
        $("#createClass").show();
    }
}

//function for creating random class code
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/* --- Event Handlers --- */
//login
$('#btnLogin').click(function(){
    //if statement to check there is input
    if($('#loginEmail').val().length > 0 && $('#loginPassword').val().length > 0){
        //search through database to check there is a match of email and password
        var count = 0;
        var found = false; 
        while (arrVClassUsers.length > count && found == false){
            if (arrVClassUsers[count].Email == $('#loginEmail').val() && arrVClassUsers[count].Password == $('#loginPassword').val()){
                found = true;
                //store user info in currentUser universal variable
                var tempItemUser = {
                    "Email": arrVClassUsers[count].Email,
                    "FullName": arrVClassUsers[count].FullName, 
                    "Password": arrVClassUsers[count].Password, 
                    "UserType": arrVClassUsers[count].UserType,
                    "UserClasses": arrVClassUsers[count].UserClasses
                };
                currentUser = tempItemUser;
                currentUserId = arrVClassUsers[count]._id;
                console.log(currentUser)
                //take user to new page - home page 
                homePage();
                //put any of their existing classes on the screen 
            }
        count ++;
        }
        // if there is not a match provide error message 
        if(found == false){
            $('#loginNotComplete').text("*Password or email incorrect");
        }
    }else{
        $('#loginNotComplete').text("*Please fill out required information");
    }
})

//register
$('#btnRegister').click(function(){
    //making sure input in text boxes
    if($('#registerEmail').val().length > 0 && $('#fullName').val().length > 0 && $('#registerPassword').val().length > 0) {
        var tempItemUser = {
            "Email": $('#registerEmail').val(),
            "FullName":$('#fullName').val(), 
            "Password":$('#registerPassword').val(), 
            "UserType":$('#userType:selected').val(),
//****** fix later - figure out data types *****//
            "UserClasses": []
        };
        //store current user details in universal variable
        currentUser = tempItemUser;
        console.log(currentUser)
        //ensure that user isnt already in db 
        var count = 0;
        var found = false; 
        while (arrVClassUsers.length > count && found == false){
            if (arrVClassUsers[count].Email == currentUser.Email){
                $('#registerNotComplete').text("*Email already registered, please login.");
                found = true
            }
        count ++;
        }
        //if not already in the db add their details 
        if(found == false){
            addVClassUser(currentUser, urlVClassUsers, apikey);
            console.log('submitted');
            //display next screen - home page
            homePage();
        }
    }else{
        $('#registerNotComplete').text("*Please fill out required information");
    }
})

$('#btnRegisterPage').click(function(){
    $("#login-form").hide();
    $("#switchToRegister").hide();
    $("#switchToLogin").show();
    $("#register-form").show();
})

$('#btnLoginPage').click(function(){
    $("#login-form").show();
    $("#switchToRegister").show();
    $("#switchToLogin").hide();
    $("#register-form").hide();
})

$('#imgNewClass').click(function(){
    newClass();
})

$('#btnCreateClass').click(function(){
    //checking user has inputted a class name
    if(($('#className').val()).length > 0){
        var classCode = generateString(8);
        console.log(classCode);
        var tempItemClassroom = {ClassName: $('#className').val(),ClassCode: classCode};
        addVClassClassroom(tempItemClassroom, urlVClassClassrooms, apikey);
        $('#generateClassCode').text("Your class code is: " + classCode);
//********** TBF: CREATE A CLASS DIV. and put it on the screen as soon as they create class ******** //
    }else{
        $('#createClassNotComplete').text("*Please fill out required information");
    }
})
$('#btnExitCreate').click(function(){
    $("#createClass").hide();
})


$('#btnAddClass').click(function(){
    var newClassCode = $('#recieveClassCode').val()
    if(newClassCode.length > 0){
        //append class code to class code UserClasses in db and add it to the screen 
        //replace user classes in the object of current user (universal variable)
//*** fix dodgy class array -->  data types */
        currentUser.UserClasses[currentUser.Userclasses.length + 1] = newClassCode;
        var urlEditUsers = 'https://eduggan-7bb9.restdb.io/rest/vclassusers/' + currentUserId;
        //add new class to user classes array in database
        var tempItem = {"UserClasses": currentUser.UserClasses}
        editUser(tempItem, urlEditUsers, apikey)
//******      TBF:  PUT Div on screen as soon as they create a class    *************** //
        
    }else{
        $('#addClassNotComplete').text("*Please fill out required information");
    }
})
$('#btnExitAdd').click(function(){
    $("#addClass").hide();
})

//joining a class 
$('body').on('click', '#mathClassroom', function(){
    $("#homePage").hide();
    $(".classImg").hide();
    $(".joinClass").show();
    $("#homeImgJoin").show();
    $('#joinClassName').text($(this).attr('id'));
});

$('#btnJoinClass').click(function(){
    if($('#nickname').val().length > 0 && $('#work').val().length > 0){
        var item = {
            "Nickname": $('#nickname').val(),
            "Work": $('#work').val(),
            "Camera":$('#camera:selected').val(),
            "Microphone":$('#microphone:selected').val(),
        }
        tempUserDetails = item;
        $(".joinClass").hide();
        $(".classImg").hide();
        $("#topBanner").hide();
        $(".furniture").show();
        $("body").css("background-color","white");
        $("#user").show();
    }else{
        console.log(tempUserDetails)
        $('#joinNotComplete').text("*Please fill out required information");
    }
});

$('#btnShortcut').click(function(){
    $("#register-form").hide();
    $(".furniture").show();
    $("body").css("background-color","white");
    $("#user").show();
    $("#btnShortcut").hide();
    $("#btnShortcut2").hide();
    $("#topBanner").hide();
    
});

$('#btnShortcut2').click(function(){
    $("#register-form").hide();
    $("#btnShortcut2").hide();
    $("#btnShortcut").hide();
    homePage();
});

$("body").keydown(function(event){
    var userRight = $("#user").position().left + 60;
    var userLeft = $("#user").position().left - 100;
    var userBottom = $("#user").position().top + 300;
    var userTop = $("#user").position().top - 60;
    var maxRight = $("#backgroundImg").width();
    var maxBottom = $("#backgroundImg").height();

    //right//
    if (event.which == 39 && userRight < maxRight) {
       $("#user").animate({left:"+=50px"});
        window.scrollBy(50,0)
    }
    //down
    if (event.which == 40 && userBottom < maxBottom) {
       $("#user").animate({top:"+=50px"});
        window.scrollBy(0,50)
    }

    //up//
    if (event.which == 38 && userTop > 0) {
       $("#user").animate({top:"-=50px"});
        window.scrollBy(0,-50)
    }
    //left// 
    if (event.which == 37 && userLeft > 0) {
       $("#user").animate({left:"-=50px"});
        window.scrollBy(-50,0)
    }
});


var zoomCount = 0
//zoom in 
$("#zoomIn").click(function(){
    if (zoomCount < 2){
        var backgroundHeight = $('#backgroundImg').height() * 1.2;
        var userHeight = $('#user').height() * 1.2;
        $('#backgroundImg').css({'width': 'auto', 'height': backgroundHeight + 'px'});
        $('#user').css({'width': userHeight + 'px', 'height': userHeight + 'px'});
        zoomCount = zoomCount + 1
        console.log(zoomCount)
    }
});

//zoom out 
$("#zoomOut").click(function(){
    var count = 0
    if (zoomCount > -1){
        var backgroundHeight = $('#backgroundImg').height() * 0.8;
        var userHeight = $('#user').height() * 0.8;
        $('#backgroundImg').css({'width': 'auto', 'height': backgroundHeight + 'px'});
        $('#user').css({'width': userHeight + 'px', 'height': userHeight + 'px'});
        zoomCount = zoomCount -1
    }


});

$('#homeImg').click(function(){
    homePage();
});

$('#homeImgJoin').click(function(){
    homePage();
});

$('#pinboard').click(function(){
    $("#forum").show();
});

$('#btnExitPinboard').click(function(){
    $("#forum").hide();
});

//feeding fish 
$('.fishBowl' || '.fish').click(function(){
    //left
    $(".fish").animate({left:"-=10px"},1000);
    //rotate 
    $(".fish").css('transform', 'rotateY(-180deg)');
    //right
    $(".fish").animate({left:"+=10px"},1000);

    //$(".fish").animate({left:"+10px"},1000);
   // $(".fish").animate({right: '10px'}, 1000);
    var progressWidth = $("#progress").width() + 10;
    if(progressWidth<= 90){
        $("#progress").css({'width': progressWidth + 'px'});
    }     
});

function fishProgress() {
    var progressWidth = $("#progress").width() - 10;
    if(progressWidth>= 0){
        $("#progress").css({'width': progressWidth + 'px'});
    }
    if(progressWidth == 0){
        //display dead fish 
    }
}




/* --- Code to run at start --- */
getVClassUsers(urlVClassUsers,apikey);
getVClassClassrooms(urlVClassClassrooms,apikey);

//fish bowl - goes down every 10 mins
setTimeout(fishProgress, 600000);

