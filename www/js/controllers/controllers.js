var oauthApp = angular.module('oauthApp.controllers', []);
var getrespone;
var getid;
oauthApp.controller('welcomeCtrl', function ($scope, $state, $cookieStore) {
    
    /**
     * SOCIAL LOGIN
     * Facebook and Google
     */
    // FB Login
    $scope.fbLogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
               getUserInfo(); 
                connectMicrogear();
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'email,user_photos,user_videos'});

        function getUserInfo() {
            // get basic info
            FB.api('/me', function (response) {
                console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
                getrespone=response.name
                getid=response.id
                // get profile picture
                FB.api('/me/picture?type=normal', function (picResponse) {
                    console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
                    response.imageUrl = picResponse.data.url;
                    // store data to DB - Call to API
                    // Todo
                    // After posting user data to server successfully store user data locally
                    var user = {};
                    user.name = response.name;
                    user.email = response.email;
                    if(response.gender) {
                        response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
                    } else {
                        user.gender = '';
                    }
                    user.profilePic = picResponse.data.url;
                    $cookieStore.put('userInfo', user);
                    $state.go('dashboard');

                });
            }
                 
            );

        }
    };
    // END FB Login
    

    
});
// .controller('genbouttonandonclick', function($scope, $window, $state, $cookieStore) {
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  
// })

// Dashboard/Profile Controller
oauthApp.controller('dashboardCtrl', function ($scope, $window, $state, $cookieStore,$ionicPopup) {
    $scope.showButton = true;

    $scope.items = ["NGT01 คุณนิยม","NGT02 คุณเบท","NGT03 คุณติ๊ง","NGT04 คุณโอ๋"];   //set button
    if(status == 0){ 
        connectMicrogear(); 
        // for (var i = 1; i <= 6; i++) { 
        // $scope.items.push(i); 
        // console.log(i); 
    //} 
    } 
    else{ 
        // for (var i = 1; i <= 4; i++) { 
        //     $scope.items.push(i); 
        //     console.log(i); 
        // } 
    }

    // Set user details
    $scope.user = $cookieStore.get('userInfo');
    
    // Logout user
  $scope.logout = function () { 
        if(status == 1){ 
            microgear.disconnect(); 
        } 
        $cookieStore.remove("userInfo"); 
        $state.go('welcome'); 
        $window.location.reload(); 
    };
    // $scope.voteteame = function () {
    //     console.log("sanding massage");
    //     var name=getrespone;
    //     console.log(getrespone);
    //      microgear.chat("server",name+"|"+"2");
    //     // console.log("server",getresponse+"|"+"1");
    // };



    $scope.set = function(index) {
        console.log("sanding massage"+index);
        var name=getrespone;
        var id=getid;
        console.log("ID: "+id+" name :"+getrespone+" vote :"+index);
         
        var confirmPopup = $ionicPopup.confirm({
            title: 'ยืนยันการโหวด',
            template: 'คุณต้องการจะโหวดให้ทีม ' + index+' ใช่หรือไม่ ?'
        });

        confirmPopup.then(function(res) {
            console.log(5 );
            
            console.log(22222 );
            if(res) {
                console.log(6);
                        if (onstatus==4) {
                         $scope.showButton = false;                                                 
                        microgear.chat("server",id+"|"+name+"|"+index);                                                     
                       console.log('You are sure');
                       $scope.textshow = true;                      
                       }

                       var alertPopup = $ionicPopup.alert({
     title: 'สถานะการโหวต',
     template: 'คุณ '+name+' โหวตให้กับ '+index
   });

   alertPopup.then(function(res) {
     if(res) {
       console.log('You are ok ');
       microgear.disconnect();
        $cookieStore.remove("userInfo"); 
        $state.go('welcome'); 
       $window.location.reload();
     } 
   });
               
            } else {
                console.log(7);
            console.log('You are not sure');
         }
        
            
      });
        
    };

    // $scope.$on("$ionicView.afterEnter", function(event, data){

       

    //    $scope.textshow



    // });


});
