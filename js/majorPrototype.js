var apikey = '62315adbdced170e8c83a2c1';
var urlVClassUsers = 'https://eduggan-7bb9.restdb.io/rest/vclassusers';
var urlVClassClassrooms = 'https://eduggan-7bb9.restdb.io/rest/vclassclassrooms';  
var urlVClassPinboards = 'https://eduggan-7bb9.restdb.io/rest/vclasspinboards';  

var arrVClassUsers = [];
var arrVClassClassrooms = [];
var arrVClassPinboards = [];

var currentUser = {};
var currentUserId = '';
var inClassUserDetails = {};

var currentClassName = {}

var stopMovement = false;


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
        currentUserId = response._id
        console.log(response._id)
    });

}

function editUser(item, url, apikey){
    // item is "field1": "new value"
    var settings = {
        "async": true,
        "crossDomain": true,
        // url with object id e.g. "url": "https://eduggan-7bb9.restdb.io/rest/vclassusers/(ObjectID)",
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
        $("#bannerSetup").show();
        $("#login-form").show();
        $(".loader").hide();
        console.log(response);
        arrVClassClassrooms = response;
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

//app pinboards
function getVClassPinboards(url,apikey,relevantClassroom){
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
        for(var i=0; i<response.length; i++){
            if(response[i].ClassName == relevantClassroom){
                arrVClassPinboards.push(response[i])
            }
        }
    });
}

function addVClassPinboard(item, url, apikey){
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

    console.log (currentUser)
    console.log (currentUserId)

    //put on screen all classes that user has - linear search
    var count = 0;

    console.log(currentUser.UserClasses)
    console.log(currentUser.UserClasses[0])

    while (currentUser.UserClasses.length > count){
        var i = 0;
        var found = false;
        while (arrVClassClassrooms.length > i && found == false){
            if (currentUser.UserClasses[count] == arrVClassClassrooms[i].ClassCode){
                var classItem = '<div><img class="classImg enterClass" id="' + arrVClassClassrooms[i].ClassName + '"src="images/toaster.jpg" width="140" height="140"><label id="' + arrVClassClassrooms[i]._id + 'lbl">'+ arrVClassClassrooms[i].ClassName + '</label></div>';
                $(classItem).prependTo(".classroomDisplay")
                console.log("class appended")
                found == true;
            }
        i ++;
        }
    count ++
    }
}

//function to check if user has ability to create or add class - teacher or student
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
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//function to live stream camera feed
function init(){
    // activate camera through browser
    var video = document.getElementById('myVideo');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            $("#camera")[0].checked = true
            video.srcObject = stream;
            video.play();
        });
    };
}


function fishProgress() {
    var progressWidth = $("#progress").width() - 10;
    if(progressWidth>= 0){
        $("#progress").css({'width': progressWidth + 'px'});
    }
    if(progressWidth == 0){
        //display dead fish 
    }
}

function checkSound(){
    if($("#inClassUser").position().left > 700 && $("#inClassUser").position().left < 1400 && $("#inClassUser").position().top < 450){
        $("#music").trigger("play")
        $("#music")[0].volume = 0.2;
        console.log("music at 0.2")
        console.log($("#music")[0].volume)
        if($("#inClassUser").position().left > 850 && $("#inClassUser").position().left < 1350 && $("#inClassUser").position().top < 250){
            $("#music").trigger("play")
            $("#music")[0].volume = 0.6;
            console.log("music at 0.6")
            if($("#inClassUser").position().left > 1000 && $("#inClassUser").position().left < 1200 && $("#inClassUser").position().top < 200){
                $("#music").trigger("play")
                $("#music")[0].volume = 1;
                console.log("music at 1")
            }
        }
    }else{
        $("#music").trigger("pause")
    }

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
            "UserType":$('#userType option:selected').val(),
            "UserClasses": []
        };
        //store current user details in universal variable
        currentUser = tempItemUser;
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
        if(found === false){
            addVClassUser(currentUser, urlVClassUsers, apikey);
            console.log('submitted');
            //display next screen - home page
            homePage();
        }
    }else{
        $('#registerNotComplete').text("*Please fill out required information");
    }
})

//switch from login to register page
$('#btnRegisterPage').click(function(){
    $("#login-form").hide();
    $("#switchToRegister").hide();
    $("#switchToLogin").show();
    $("#register-form").show();
})

//switch from register to login page
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
        //append class code to users array of classes in db and update universal variable
        currentUser.UserClasses.push(classCode)
        console.log(currentUser.UserClasses)
        // need url to be "https://eduggan-7bb9.restdb.io/rest/vclassusers/(ObjectID)"
        var urlEditUsers = 'https://eduggan-7bb9.restdb.io/rest/vclassusers/' + currentUserId;
        var tempItem = {"UserClasses": currentUser.UserClasses}
        editUser(tempItem, urlEditUsers, apikey)
        //put class div on screen 
        var classItem = '<div><img class="classImg enterClass" id="' + $('#className').val() + '"src="images/toaster.jpg" width="140" height="140"><label id="' + classCode + 'lbl">'+ $('#className').val() + '</label></div>';
        $(classItem).prependTo(".classroomDisplay")
    }else{
        $('#createClassNotComplete').text("*Please fill out required information");
    }
})

$('#btnExitCreate').click(function(){
    $("#createClass").hide();
})

$('#btnAddClass').click(function(){
    var newClassCode = $('#recieveClassCode').val()
    console.log(newClassCode)
    if(newClassCode.length > 0){
        //check if user doesnt already have class in class codes - so cant add double 
        var count = 0;
        var foundWithUser = false; 
        while (currentUser.UserClasses.length > count && foundWithUser === false){
            if (arrVClassClassrooms[count].ClassCode == newClassCode){
                foundWithUser = true //therefore dont continue to search through db
            }
            count ++;
        }
        //find class in db
        //TBF: eventually retrieve image from database as well.
        count = 0;
        var found = false
        while (arrVClassClassrooms.length > count && found === false && foundWithUser === false){
            if (arrVClassClassrooms[count].ClassCode == newClassCode){
                found = true;
                //append class code to users array of classes in db and update universal variable
                currentUser.UserClasses.push(newClassCode)
                console.log(currentUser.UserClasses)
                // need url to be "https://eduggan-7bb9.restdb.io/rest/vclassusers/(ObjectID)"
                var urlEditUsers = 'https://eduggan-7bb9.restdb.io/rest/vclassusers/' + currentUserId;
                var tempItem = {"UserClasses": currentUser.UserClasses}
                editUser(tempItem, urlEditUsers, apikey)
                //get corresponding class name
                var tempClassName = arrVClassClassrooms[count].ClassName;
                //put class div on screen 
                var classItem = '<div><img class="classImg enterClass" id="' + tempClassName + '"src="images/toaster.jpg" width="140" height="140"><label id="' + newClassCode + 'lbl">'+ tempClassName + '</label></div>';
                $(classItem).prependTo(".classroomDisplay")
            }
        count ++;
        }
        //if there is not a match or user already has class provide an error message
        if(found == false || foundWithUser == true){
            $('#classCodeNotValid').text("invalid class code or already added");
        }

    }else{
        $('#addClassNotComplete').text("*Please fill out required information");
    }
})

$('#btnExitAdd').click(function(){
    $("#addClass").hide();
})


//joining space
$('body').on('click', '.enterClass', function(){
    $("#homePage").hide();
    $(".classImg").hide();
    $(".joinClass").show();
    //start camera feed
    init();
    $("#camera").checked = true
    $("#homeImgJoin").show();
    currentClassName = $(this).attr('id')
    console.log($(this).attr('id'))
    //store class name in global variable
    $('#joinClassName').text(currentClassName);
    $("body").css("overflow", "hidden");
    
    //accessing all pinboard data relevant to the class 
    getVClassPinboards(urlVClassPinboards,apikey,currentClassName)
});

$('body').on('click', '#cameraSlider', function(){
    if($("#camera")[0].checked === false){
        $("#myVideo").css("opacity", "100%");
        //turn camera on
    }
    if($("#camera")[0].checked === true){
        $("#myVideo").css("opacity","0%");
        //turn camera off
        //$(".videoContainer").text(currentUser.FullName);
        //console.log(currentUser.FullName)
    }
});

//class space
$('#btnJoinClass').click(function(){
    if($('#nickname').val().length > 0 && $('#work').val().length > 0){
        var item = {
            "Nickname": $('#nickname').val(),
            "Work": $('#work').val(),
            "Camera":$('#camera:selected').val(),
            "Microphone":$('#microphone:selected').val(),
        }
        inClassUserDetails = item;
        $(".joinClass").hide();
        $(".classImg").hide();
        $("#topBanner").hide();
        $(".furniture").show();
        $("body").css("background-color","white");
        //moving elements from the previous screen to this one
        $("#myVideo").appendTo("#inClassUser");
        $("#cameraSwitchLogin").appendTo("#cameraSwitchInClass");
        $("#microphoneSwitchLogin").appendTo("#microphoneSwitchInClass");
        //adding the users nickname and what they're working on
        $('<label>'+ inClassUserDetails.Nickname + ' is working on ' + inClassUserDetails.Work + '</label>').appendTo(".videoContainer");

    }else{
        console.log(inClassUserDetails)
        $('#joinNotComplete').text("*Please fill out required information");
    }
});

//moving user
$("body").keydown(function(event){
    var userRight = $("#inClassUser").position().left + 60;
    var userLeft = $("#inClassUser").position().left - 100;
    var userBottom = $("#inClassUser").position().top + 300;
    var userTop = $("#inClassUser").position().top - 60;
    var maxRight = $("#backgroundImg").width();
    var maxBottom = $("#backgroundImg").height();

    if(stopMovement === false){
            //right//
    if (event.which == 39 || event.which == 68 && userRight < maxRight) {
        $("#inClassUser").animate({left:"+=50px"});
        window.scrollBy(50,0)
        checkSound();

    }
    //down
    if (event.which == 40 || event.which == 83 && userBottom < maxBottom) {
        $("#inClassUser").animate({top:"+=50px"});
        window.scrollBy(0,50)
        checkSound();
    }

    //up//
    if (event.which == 38 || event.which == 87 && userTop > 0) {
        $("#inClassUser").animate({top:"-=50px"});
        window.scrollBy(0,-50)
        checkSound();
    }
    //left// 
    if (event.which == 37 || event.which == 65 && userLeft > 0) {
        $("#inClassUser").animate({left:"-=50px"});
        window.scrollBy(-50,0)
        checkSound();
    }
    }
});

// var zoomCount = 0
// //zoom in 
// $("#zoomIn").click(function(){
//     if (zoomCount < 2){
//         var backgroundHeight = $('#backgroundImg').height() * 1.2;
//         var userHeight = $('#user').height() * 1.2;
//         $('#backgroundImg').css({'width': 'auto', 'height': backgroundHeight + 'px'});
//         $('#user').css({'width': userHeight + 'px', 'height': userHeight + 'px'});
//         zoomCount = zoomCount + 1
//         console.log(zoomCount)
//     }
// });

// //zoom out 
// $("#zoomOut").click(function(){
//     var count = 0
//     if (zoomCount > -1){
//         var backgroundHeight = $('#backgroundImg').height() * 0.8;
//         var userHeight = $('#user').height() * 0.8;
//         $('#backgroundImg').css({'width': 'auto', 'height': backgroundHeight + 'px'});
//         $('#user').css({'width': userHeight + 'px', 'height': userHeight + 'px'});
//         zoomCount = zoomCount -1
//     }
// });

$('#homeImg').click(function(){
    homePage();
}); // TBF!

$('#homeImgJoin').click(function(){
    homePage();
}); // TBF!

//pinboard feature 
$('#pinboard').click(function(){
    $("#forum").show();
    $("#pinboardName").text('Pinboard: ' + currentClassName)
    //so that the user doesnt move around still
    stopMovement = true;
    console.log(arrVClassPinboards)
    //print all posts in posts container
    for(var i=0; i<arrVClassPinboards.length; i++){
        var postItem = '<div class="postItem" id="' + arrVClassPinboards[i].PostTitle + '">'+ arrVClassPinboards[i].PostTitle + '</div>';
        $(postItem).prependTo("#postsContainer")
    }
});

$('#btnExitPinboard').click(function(){
    $("#forum").hide();
    stopMovement = false;
});

$('#btnCreatePost').click(function(){
    $("#postsContainer").hide();
    $("#createPostContainer").show();
    $('#btnCreatePost').css('background-color:hsl(44, 70%, 53%)')
    $('#btnPosts').css("background-color: hsl(44, 98%, 59%)")
});

$('#btnPosts').click(function(){
    $("#createPostContainer").hide();
    $("#postsContainer").show();
    $('#btnPosts').css('background-color','hsl(44, 70%, 53%)')
    $('#btnCreatePost').css('background-color','hsl(44, 98%, 59%)')
});

//making a new post
$('#btnSubmitPost').click(function(){
    console.log($('#postText').val())
    //making a new post
    if($('#postTitle').val().length > 0 && $('#postText').val().length > 0){
        var tempPostInfo = {
            "ClassName": currentClassName,
            "PostTitle":$('#postTitle').val(), 
            "PostText":$('#postText').val(), 
        };
        console.log(tempPostInfo)
        //input data in database
        addVClassPinboard(tempPostInfo, urlVClassPinboards, apikey);
        console.log('posted!');
        //display blank input boxes 
        $('#postTitle').val('');
        $('#postText').val('');
    }else{
        $('#postNotComplete').text("*Not Complete");
    }
});


//feeding fish feature
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



/* --- Code to run at start --- */
getVClassUsers(urlVClassUsers,apikey);
getVClassClassrooms(urlVClassClassrooms,apikey);


//fish bowl - goes down every 10 mins
setTimeout(fishProgress, 600000);

