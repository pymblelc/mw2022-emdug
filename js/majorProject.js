var apikey = '62315adbdced170e8c83a2c1';
var urlVClassUsers = 'https://eduggan-7bb9.restdb.io/rest/vclassusers';
var urlVClassClassrooms = 'https://eduggan-7bb9.restdb.io/rest/vclassclassrooms';  
var urlVClassPinboards = 'https://eduggan-7bb9.restdb.io/rest/vclasspinboards';  

var arrBackgroundColours = [
   {colour: "yellow", hex: "#e4c05d"},
   {colour: "blue", hex: "#91bae2"},
   {colour: "purple", hex: "#b875f9"},
   {colour: "brown", hex: "#ccb292"},
]
var arrImageBorders = [
    {colour: "blue", hex: "#4deeea"},
    {colour: "green", hex: "#74ee15"},
    {colour: "yellow", hex: "#ffe700"},
    {colour: "pink", hex: "#f000ff"},
    
]

var arrVClassUsers = [];
var arrVClassClassrooms = [];
var arrVClassPinboards = [];

var currentUser = {};
var currentUserId = '';
var inClassUserDetails = {};

var currentClassName = {}

var stopMovement = false;
var initialHomeSetup = false;

var arrClassesToSort = [];

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
                //print all posts in posts container
                var postItem =  '<div class="postDisplay"><div class = "postNameDisplay">'+ response[i].UsersName +'</div><div class = "postContent"><div class = "postTitleDisplay">'+ response[i].PostTitle +'</div><div class = "postContentDisplay">'+ response[i].PostText +'</div></div></div>'
                $(postItem).prependTo("#postsContainer")
                //hide the div that says there are no posts
                $("#noPosts").hide()
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

function selectionSortClasses(theArray){
    console.log("i am sorting")
    //put your code here for the selection sort
    var pass = 0;
    var count = 0;
    var minimum = 0;
    
    while(pass < theArray.length - 1){
        count = pass + 1;
        minimum = pass;
        while(count < theArray.length-1){
            if(theArray[count].ClassName < theArray[minimum].ClassName){
                minimum = count;
            }
            count++;
        }
        var temp = theArray[minimum];
        theArray[minimum] = theArray[pass];
        theArray[pass] = temp;
        pass++;
    }
    //return theArray;
    //print divs
    for(var i = 0; i < theArray.length; i++){
        var borderColour = randBorderColour();
        var classItem = '<div><img class="classImg enterClass" id="' + theArray[i].ClassName + '"src="images/class.png" width="140" height="140" style="border: 5px solid '+ borderColour +';"><label class = "classImglbl" id="' + theArray[i]._id + 'lbl">'+ theArray[i].ClassName + '</label><label class="classCodeDisplay">'+theArray[i].ClassCode+'</label></div>';
        $(classItem).prependTo(".classroomDisplay")
        console.log("classAdded")
    }
}

function homePage(){
    $("#homePage").show();
    $("#bannerSetup").show();
    $("#register-form").hide();
    $("#login-form").hide();
    $(".furniture").hide();

    $("#switchToRegister").hide();
    $("#switchToLogin").hide();
    $("#join-form").hide();
    $("#homeImgJoin").hide();
    
    $('#welcome').text("Welcome " + currentUser.FullName);

    console.log (currentUser)
    console.log (currentUserId)

    //put on screen all classes that user has - linear search
    if(initialHomeSetup === false){
        console.log("printing")
        var count = 0;
        while (currentUser.UserClasses.length > count){
            var i = 0;
            var found = false;
            while (arrVClassClassrooms.length > i && found == false){
                if (currentUser.UserClasses[count] == arrVClassClassrooms[i].ClassCode){
                    //sort classes by name
                    tempItem = arrVClassClassrooms[i]
                    console.log(tempItem)
                    arrClassesToSort.push(tempItem)
                    console.log(arrClassesToSort)
                    found == true;
                }
            i ++;
            }
        count ++
        }
        //sort classes 
        console.log(arrClassesToSort)
        selectionSortClasses(arrClassesToSort)
        initialHomeSetup = true;
    }

}

//function to check if user has ability to create or add class - teacher or student
function newClass(){
    if(currentUser.UserType == "student"){
        $("#addClass").show();
    }else{
        $("#createClass").show();
        $("#createClass1").show();
        $("#createClass2").hide();

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

function randBackgroundColour(){
    var randElement = Math.floor(Math.random() * arrBackgroundColours.length)
    return arrBackgroundColours[randElement].hex
}

function randBorderColour(){
    var randElement = Math.floor(Math.random() * arrImageBorders.length)
    return arrImageBorders[randElement].hex
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
}

function checkSound(){
    if($("#inClassUser").position().left > 700 && $("#inClassUser").position().left < 1400 && $("#inClassUser").position().top < 400){
        $("#music").trigger("play")
        $("#music")[0].volume = 0.2;
        if($("#inClassUser").position().left > 850 && $("#inClassUser").position().left < 1350 && $("#inClassUser").position().top < 450){
            $("#music").trigger("play")
            $("#music")[0].volume = 0.6;
            if($("#inClassUser").position().left > 1000 && $("#inClassUser").position().left < 1200 && $("#inClassUser").position().top < 300){
                $("#music").trigger("play")
                $("#music")[0].volume = 1;
            }
        }
    }else{
        $("#music").trigger("pause")
    }

}

function checkFish(){
    if($("#inClassUser").position().left < 320 && $("#inClassUser").position().top > 400){
        $("#fishPrompt").show()
    }else{
        $("#fishPrompt").hide()
    }
}

function checkPinboard(){
    if($("#inClassUser").position().left > 490 && $("#inClassUser").position().left < 870 && $("#inClassUser").position().top < 320){
        $("#pinboardPrompt").show()
        console.log("it is shown")
    }else{
        $("#pinboardPrompt").hide()
        console.log("it is hidden")
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
    $("#greyScreen").show();
})

$('#btnCreateClass').click(function(){
    //checking user has inputted a class name
    if(($('#className').val()).length > 0){
        var classCode = generateString(8);
        console.log(classCode);
        var tempItemClassroom = {ClassName: $('#className').val(),ClassCode: classCode};
        addVClassClassroom(tempItemClassroom, urlVClassClassrooms, apikey);
        //display the class code
        $("#createClass1").hide();
        $("#createClass2").show();
        $('#generateClassCode').text(classCode);
        //append class code to users array of classes in db and update universal variable
        currentUser.UserClasses.push(classCode)
        console.log(currentUser.UserClasses)
        // need url to be "https://eduggan-7bb9.restdb.io/rest/vclassusers/(ObjectID)"
        var urlEditUsers = 'https://eduggan-7bb9.restdb.io/rest/vclassusers/' + currentUserId;
        var tempItem = {"UserClasses": currentUser.UserClasses}
        editUser(tempItem, urlEditUsers, apikey)
        //put class div on screen 
        var borderColour = randBorderColour();
        var classItem = '<div><img class="classImg enterClass" id="' + $('#className').val() + '"src="images/class.png" width="140" height="140" style="border: 5px solid '+ borderColour +';"><label class = "classImglbl" id="' + classCode + 'lbl">'+ $('#className').val() + '</label><label class="classCodeDisplay">'+ classCode+'</label></div>';
        $(classItem).prependTo(".classroomDisplay")

    }else{
        $('#createClassNotComplete').text("*Please fill out required information");
    }
})

$('#btnExitCreate').click(function(){
    $("#createClass").hide();
    $("#greyScreen").hide();
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
                var borderColour = randBorderColour();
                var classItem = '<div><img class="classImg enterClass" id="' + tempClassName + '"src="images/class.png" width="140" height="140" style="border: 5px solid '+ borderColour +';"><label class = "classImglbl" id="' + newClassCode + 'lbl">'+ tempClassName + '</label><label class="classCodeDisplay">'+newClassCode+'</label></div>';
                $(classItem).prependTo(".classroomDisplay")

                //clear input box
                $('#recieveClassCode').val('')
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
    $("#greyScreen").hide();
})


//joining space
$('body').on('click', '.enterClass', function(){
    $("#homePage").hide();
    // $(".classImg").hide();
    $(".joinClass").show();
    //randomise class background colour 
    colour = randBackgroundColour()
    console.log(colour)
    $("#background").css("background-color", colour )

    //start camera feed
    init();
    $("#camera").checked = true
    $("#homeImgJoin").show();
    currentClassName = $(this).attr('id')
    console.log($(this).attr('id'))
    //store class name in global variable
    $('#joinClassName').text(currentClassName);
    $('#classroomName').text('- - - - - - - - ' + currentClassName + ' - - - - - - - -')
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
        $("#join-form").hide();
        $("#bannerSetup").hide();
        $(".furniture").show();
        //moving elements from the previous screen to this one
        $("#myVideo").appendTo("#inClassUser");
        $("#cameraSwitchLogin").appendTo("#cameraSwitchInClass");
        $("#microphoneSwitchLogin").appendTo("#microphoneSwitchInClass");
        //adding the users nickname and what they're working on
        $('<div id = "inClassUserDescriptionHTML">'+ inClassUserDetails.Nickname + ' is working on ' + inClassUserDetails.Work + '</div>').appendTo("#inClassUser");
        //clear input boxes
        $('#nickname').val('')
        $('#work').val('')
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
        checkFish();
        checkPinboard();

    }
    //down
    if (event.which == 40 || event.which == 83 && userBottom < maxBottom) {
        $("#inClassUser").animate({top:"+=50px"});
        window.scrollBy(0,50)
        checkSound();
        checkFish();
        checkPinboard();
    }

    //up//
    if (event.which == 38 || event.which == 87 && userTop > 0) {
        $("#inClassUser").animate({top:"-=50px"});
        window.scrollBy(0,-50)
        checkSound();
        checkFish();
        checkPinboard();
    }
    //left// 
    if (event.which == 37 || event.which == 65 && userLeft > 0) {
        $("#inClassUser").animate({left:"-=50px"});
        window.scrollBy(-50,0)
        checkSound();
        checkFish();
        checkPinboard();
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

$('#homeImgJoin').click(function(){
    homePage();
}); 

$('#homeImgInClass').click(function(){
    homePage();
    $('#inClassUserDescriptionHTML').remove();
    $("#myVideo").appendTo("#outOfClassUser");

}); 

//pinboard feature 
$('#pinboard').click(function(){
    $("#forum").show();
    $("#pinboardName").text('Pinboard: ' + currentClassName)
    //so that the user doesnt move around still
    stopMovement = true;
});

$('#btnExitPinboard').click(function(){
    $("#forum").hide();
    stopMovement = false;
});

$('#btnCreatePost').click(function(){
    $("#postsContainer").hide();
    $("#createPostContainer").show();
    $('#btnCreatePost').css('background-color','hsl(44, 70%, 53%)')
    $('#btnPosts').css("background-color","hsl(44, 98%, 59%)")
});

$('#btnPosts').click(function(){
    $("#createPostContainer").hide();
    $("#postsContainer").show();
    $('#btnPosts').css('background-color','hsl(44, 70%, 53%)')
    $('#btnCreatePost').css('background-color','hsl(44, 98%, 59%)')
});

//making a new post
$('#btnSubmitPost').click(function(){
    //making the error message blank
    $('#postNotComplete').hide();
    //making a new post
    if($('#postTitle').val().length > 0 && $('#postText').val().length > 0){
        var postText = $('#postText').val()
        var postTitle = $('#postTitle').val()

        var tempPostInfo = {
            "ClassName": currentClassName,
            "PostTitle": postTitle, 
            "PostText": postText, 
            "UsersName": currentUser.FullName, 
        };
        console.log(tempPostInfo)
        //input data in database
        addVClassPinboard(tempPostInfo, urlVClassPinboards, apikey);
        console.log('posted!');
        //display blank input boxes 
        $('#postTitle').val('');
        $('#postText').val('');
        //put data on the screen 
        var postItem =  '<div class="postDisplay"><div class = "postNameDisplay">'+ currentUser.FullName +'</div><div class = "postContent"><div class = "postTitleDisplay">'+ postTitle +'</div><div class = "postContentDisplay">'+ postText +'</div></div></div>'
        $(postItem).prependTo("#postsContainer")
        //get rid of no posts div 
        $("#noPosts").hide()
    }else{
        $('#postNotComplete').show();
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
