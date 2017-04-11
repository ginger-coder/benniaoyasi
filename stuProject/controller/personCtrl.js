var personCenter = angular.module('personCenterCtrl', []);

personCenter.controller('personCtrl', ['$scope', '$rootScope', '$cookies', '$sce', 'httpService', function($scope, $rootScope, $cookies, $sce, httpService) {

  //右边栏显示隐藏
  $rootScope.isShowRightBar = false;

  $scope.ifreamePay = 'http://www.gogo-talk.com/index.php?c=search&a=getsearch&mobile=';
  //订单页
  $scope.trustSrc = $sce.trustAs($sce.RESOURCE_URL, 'http://www.gogo-talk.com/index.php?c=search&a=getsearch&mobile=' + $rootScope.userName);

  $scope.personData = {};

  $scope.gender = true;
  httpService.get(_AjaxURL.GetStudentInfo, {

    })
    .success(function(res) {
      if (res.result == 1) {
        var data = res.data;

        $scope.personData.Name = data.Name;
        $scope.personData.NameEn = data.NameEn;
        $scope.personData.FatherName = data.FatherName;
        $scope.personData.Age = data.Age;

        if (data.Gender == '女') {
          $scope.personData.Gender = 0;
          $scope.gender = false;
        } else if(data.Gender == '男' || data.Gender == '未完善'){
          $scope.personData.Gender = 1;
          $scope.gender = true;
        }
        
      }else if(res.result >= 1000){
          $cookies.remove('tonken');
          $cookies.remove('username');
          $cookies.remove('isComplete');
          $cookies.remove('password');
          $cookies.remove('bookingId');
          // alert('登录时间太久，请重新登录');
          $rootScope.$state.go('index.login');
      }
    })

  $scope.UpdateMyInfo = function() {
    var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    var EnNameReg = /^[a-zA-Z]+$/;

    if ($('#person1').val() == '' || $('#person2').val() == '' || $('#age').val() == '') {
      layer.msg('用户信息不能为空', {
        icon: 2
      })
      return false;

    } else if (!nameReg.test($scope.personData.Name) || !nameReg.test($scope.personData.FatherName)) {

      layer.msg('姓名不能有数字或特殊符号', {
        icon: 2
      })
      return false;

    }else if( !EnNameReg.test($scope.personData.NameEn) ){
      layer.msg('英文名字不能有空格等特殊字符', {
        icon: 2
      })
      return false;

    } else if ($scope.personData.Age <= 0) {
      layer.msg('年龄不能为负数', {
        icon: 2
      })
      return false;
    } else {
      layer.load();
      $('#saveMyinfo').attr('disabled',true);
      httpService.post(_AjaxURL.UpdateStudentInfo, $scope.personData)
        .success(function(res) {
          if (res.result == 1) {
           
           setTimeout(function(){
            $('#saveMyinfo').attr('disabled',false);
            layer.closeAll('loading');
              layer.msg('修改成功', {
                            icon: 1
                          });
           },1000);
            
          }else if(res.result >= 1000){
              $cookies.remove('tonken');
              $cookies.remove('username');
              $cookies.remove('isComplete');
              $cookies.remove('password');
              $cookies.remove('bookingId');
              // alert('登录时间太久，请重新登录');
              $rootScope.$state.go('index.login');
          } else {
            layer.msg(res.msg, {
              icon: 2
            });
          }
        })

    }



  }
}])