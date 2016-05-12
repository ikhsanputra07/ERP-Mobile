angular.module('app.controllers', ['ngMaterial'])

.config(function( $mdGestureProvider ) {
  $mdGestureProvider.skipClickHijack();
})
  

.controller('AppController', function($scope, $ionicSideMenuDelegate,$ionicHistory) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

   $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
})

.controller('menuutamaCtrl', function($scope,$http,$state,config) {


	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;
	
	if (name!=null && pass!=null){
		$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/res.users/search/',
					data: {'usn':name,
						   'pw':pass,
						   'domain':[['login','ilike',atob(name)]] ,
						   'fields':['display_name','email']},

					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
				
				}
			).then(
				function successCallback(response){
					console.log('success isi storage kosong dari server');
					$scope.name = response.data['Result'][0].display_name
					var login_username = response.data['Result'][0].display_name
					var login_userid = response.data['Result'][0].id
					$scope.email = response.data['Result'][0].email
				
					window.localStorage.setItem('login_user',JSON.stringify([login_username,login_userid]));
	   
				},
				function errorCallback(response){
					console.log('Data login kosong');
					$state.go('menulogin');
				}
			)
	}
	else{
		$state.go('menulogin');
	}
})
   
.controller('menuloginCtrl', function($scope, $window, LoginService, $state) {

	// if (! localStorage.reload) {
	// 	localStorage.setItem("reload","true");
	// 	window.location.reload();
	// }
	$scope.data = {};
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;

	if (name!=null && pass!=null){

	   
		 LoginService.loginUser(name, pass).success(function(data) {
			$state.go('menuutama');
		
		}).error(function(data) {
		
		});
	}
	$scope.login = function() {
		LoginService.loginUser(window.btoa($scope.data.username),window.btoa($scope.data.pass)).success(function(data) {
			$state.go('menuutama');

			window.localStorage.setItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd",window.btoa($scope.data.username))
			window.localStorage.setItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug",window.btoa($scope.data.pass))
		  
		}).error(function(data) {
			
		});
	}

})  

.controller('logoutCtrl', function($scope,$state,$window,$ionicPopup,$ionicSideMenuDelegate,$ionicHistory) {	

	$scope.logOut = function() {
      var confirmPopup = $ionicPopup.confirm({
         title: 'Log Out',
         template: 'Apa Anda Yakin?'
      });

      confirmPopup.then(function(res) {
         if(res) {
			$window.localStorage.clear();
			$state.go('menulogin');
			$ionicSideMenuDelegate.toggleLeft();
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			// window.location.reload();
         } else {
            console.log('batal');
         }

      });

	}

}) 

.controller('submenusalesCtrl', function($scope,config) {
		
})
   
.controller('menuactivityCtrl', function($scope,config) {
		

})
   
.controller('salesactivityCtrl', function($scope,$http,$state,$ionicLoading,$filter,$window,config) {
   
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug"));
	data_login = JSON.parse( window.localStorage.getItem('login_user'));
	var hari = ['ahad','senin','selasa','rabu','kamis','jumat','sabtu'];

	var current_local = JSON.parse(window.localStorage.getItem('current_activity_id'));

		$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/sales.activity/',
					data: {'usn':name,'pw':pass , 'fields':[]},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",  
					},
				}
			).then(
				function successCallback(response){
					console.log('success ambil data sales activity');					
					
					//get data sales activity dari server dan simpan di local storage 
					var sales_activity = response.data['Result'];
					window.localStorage.setItem( 'sales_data_activity', JSON.stringify(sales_activity));

					//fungsi untuk mengambil semua id dari sales
					id_sales = []; 
					for (i = 0; i < sales_activity.length; i++) {
						id_sales.push(sales_activity[i]['user_id'][0])
					}
					
					// fungsi untuk mendapatkan image dari tiap id yang ada
						$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/res.users/search/',
								data: {'usn':name,
									   'pw':pass,
									   'domain':[['id','in',id_sales]] ,
									   'fields':['image_small']},

								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								  
								},
							
							}
						).then(
							function successCallback(response){

							var img_data = response.data['Result'];
							for (is = 0 ; is < id_sales.length ; is++) {
								for (ii = 0 ; ii < img_data.length ; ii++ ) {
									if (id_sales[is] == img_data[ii].id) {
										sales_activity[is]['image'] = img_data[ii].image_small;
									}
								}
							}

				   			$scope.sda = sales_activity;
							},
							function errorCallback(response){
								console.log('error get image');
								// $state.go('menulogin');
							}
						)
					
					//saring data response terakhir dari sales yang login
					filter_userlogin = sales_activity.filter(function(jsonObject){
						return jsonObject.user_id[0] === data_login[1]
					})
				
				// fungsi untuk set data activity minggu terakhir dari user yang login (berhubungan dengan form update)
				if(current_local==null){
					
					$ionicLoading.show({
						content: 'Loading',
						animation: 'fade-in',
						showBackdrop: true,
						maxWidth: 200,
						showDelay: 0
					});	

				var currentWeekSalesData = function(hari,cek_terakhir){

					$http(
						{
							method: 'POST',
							url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.'+hari+'/search/',
							data: {
								'domain':[
											['activity_id','=',filter_userlogin[0]['id']],
										],
								'usn':name,'pw':pass ,'fields':[]},
							headers: {
								'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
							},		
						}
					).then(
						function successCallback(response){
							console.log('sukses isi storage kosong before plan'+h +'test'+hari+' dari server')
							var bp_update = response.data['Result'];

							window.localStorage.setItem('sales_activity_before_plan_'+hari, JSON.stringify(bp_update));
						},
						function errorCallback(response){
							console.log('erroor data kosong');
							// $state.go('formreviewactivity');
						}
					)
					$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.'+hari+'/search/',
								data: {
									'domain':[
												['activity_id','=',filter_userlogin[0]['id']],
											],
									'usn':name,'pw':pass ,'fields':[]},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								},		
							}
						).then(
							function successCallback(response){
								console.log('sukses isi storage kosong after plan'+h +'test'+hari+'dari server')
								var ap_update = response.data['Result'];

								window.localStorage.setItem( 'sales_activity_after_plan_'+hari, JSON.stringify(ap_update));
							},
							function errorCallback(response){
								console.log('erroor data kosong');
								// $state.go('formreviewactivity');
							}
						)
					$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.'+hari+'/search/',
								data: {
									'domain':[
												['activity_id','=',filter_userlogin[0]['id']],
											],
									'usn':name,'pw':pass ,'fields':[]},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								},		
							}
						).then(
							function successCallback(response){
								console.log('sukses isi storage kosong before actual'+h +'test'+hari+'dari server')
								var ba_update = response.data['Result'];

								window.localStorage.setItem( 'sales_activity_before_actual_'+hari, JSON.stringify(ba_update));
							},
							function errorCallback(response){
								console.log('erroor data kosong');
								// $state.go('formreviewactivity');
							}
						)
					$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.'+hari+'/search/',
								data: {
									'domain':[
												['activity_id','=',filter_userlogin[0]['id']],
											],
									'usn':name,'pw':pass ,'fields':[]},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								},		
							}
						).then(
							function successCallback(response){
								console.log('sukses isi storage kosong after actual'+h +'test'+hari+'dari server')
								var aa_update = response.data['Result'];
								if (cek_terakhir){
									 $ionicLoading.hide();
								}
								window.localStorage.setItem( 'sales_activity_after_actual_'+hari, JSON.stringify(aa_update));
							},
							function errorCallback(response){
								console.log('erroor data kosong');
								// $state.go('formreviewactivity');
							}
						)
				}
					for (h = 0 ; h < hari.length ; h++) {
						if (h==(hari.length-1)){
							currentWeekSalesData(hari[h],'ada')
						}
						else{
							currentWeekSalesData(hari[h])
						}
						
					 }
					window.localStorage.setItem('current_activity_id',JSON.stringify([filter_userlogin[0]['id']]));
				}
 				else if (current_local[0] < filter_userlogin[0]['id']) {
					$ionicLoading.show({
						content: 'Loading',
						animation: 'fade-in',
						showBackdrop: true,
						maxWidth: 200,
						showDelay: 0
					});	
				
				current_local.unshift(filter_userlogin[0]['id'])
				window.localStorage.setItem('current_activity_id',JSON.stringify(current_local));

				var currentWeekSalesDataAdd = function(hari,cek_terakhir){

					$http(
						{
							method: 'POST',
							url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.'+hari+'/search/',
							data: {
								'domain':[
											['activity_id','=',filter_userlogin[0]['id']],
										],
								'usn':name,'pw':pass ,'fields':[]},
							headers: {
								'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
							},		
						}
					).then(
						function successCallback(response){
							console.log('sukses tambah storage before plan'+h +'test'+hari+' dari server')
							sales_activity_before_plan_add = JSON.parse( window.localStorage.getItem('sales_activity_before_plan_'+hari));
							var bp_update = response.data['Result'];
							
							for (var i = 0;i<bp_update.length; i++) {
								sales_activity_before_plan_add.push(bp_update[i]);
							};

							window.localStorage.setItem('sales_activity_before_plan_'+hari, JSON.stringify(sales_activity_before_plan_add));
						},
						function errorCallback(response){
							console.log('erroor data kosong');
							// $state.go('formreviewactivity');
						}
					)
					$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.'+hari+'/search/',
								data: {
									'domain':[
												['activity_id','=',filter_userlogin[0]['id']],
											],
									'usn':name,'pw':pass ,'fields':[]},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								},		
							}
						).then(
							function successCallback(response){
								console.log('sukses tambah storage after plan'+h +'test'+hari+'dari server')
								sales_activity_after_plan_add = JSON.parse( window.localStorage.getItem('sales_activity_after_plan_'+hari));
								var ap_update = response.data['Result'];
							
							for (var i = 0;i<ap_update.length; i++) {
								sales_activity_after_plan_add.push(ap_update[i]);
							};

								window.localStorage.setItem( 'sales_activity_after_plan_'+hari, JSON.stringify(sales_activity_after_plan_add));
							},
							function errorCallback(response){
								console.log('erroor data kosong');
								// $state.go('formreviewactivity');
							}
						)
					$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.'+hari+'/search/',
								data: {
									'domain':[
												['activity_id','=',filter_userlogin[0]['id']],
											],
									'usn':name,'pw':pass ,'fields':[]},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								},		
							}
						).then(
							function successCallback(response){
								console.log('sukses tambah storage before actual'+h +'test'+hari+'dari server')
								sales_activity_before_actual_add = JSON.parse( window.localStorage.getItem('sales_activity_before_actual_'+hari));
								var ba_update = response.data['Result'];
							
							for (var i = 0;i<ba_update.length; i++) {
								sales_activity_before_actual_add.push(ba_update[i]);
							};

								window.localStorage.setItem( 'sales_activity_before_actual_'+hari, JSON.stringify(sales_activity_before_actual_add));
							},
							function errorCallback(response){
								console.log('erroor data kosong');
								// $state.go('formreviewactivity');
							}
						)
					$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.'+hari+'/search/',
								data: {
									'domain':[
												['activity_id','=',filter_userlogin[0]['id']],
											],
									'usn':name,'pw':pass ,'fields':[]},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								},		
							}
						).then(
							function successCallback(response){
								console.log('sukses tambah storage after actual'+h +'test'+hari+'dari server')
								sales_activity_after_actual_add = JSON.parse( window.localStorage.getItem('sales_activity_after_actual_'+hari));
								var aa_update = response.data['Result'];
								
								for (var i = 0;i<aa_update.length; i++) {
								sales_activity_after_actual_add.push(aa_update[i]);
								};
							
								window.localStorage.setItem( 'sales_activity_after_actual_'+hari, JSON.stringify(sales_activity_after_actual_add));
								
								if (cek_terakhir){
									 $ionicLoading.hide();
								}
							},
							function errorCallback(response){
								console.log('erroor data kosong');
								// $state.go('formreviewactivity');
							}
						)
				}
					for (h = 0 ; h < hari.length ; h++) {
						if (h==(hari.length-1)){
							currentWeekSalesDataAdd(hari[h],'ada')
						}
						else{
							currentWeekSalesDataAdd(hari[h])
						}
						
					 }
 				}

				},
				function errorCallback(response){
				 
				 	var get_sales_data_activity = JSON.parse( window.localStorage.getItem('sales_data_activity'));

					if (get_sales_data_activity == null) {
 					 	alert('Data tidak dapat ditampilkan')
					}
					else {
					 // tampilkan data yang ada pada local storage
					$scope.sda = get_sales_data_activity;
					$ionicLoading.hide();
					}
				}
			)          

	 $scope.viewsyncupdatedata = function () {
	 	get_update_data_temp = JSON.parse( window.localStorage.getItem('update_data_temp'));

	 	if (!get_update_data_temp) {
	 		alert ('Seluruh aktivitas telah tersinkronisasi dengan server!!!')
	 	}
	 	else {
	 		$state.go('previewsyncupdate')
	 	}
	 }
	 
	 $scope.updatedata = function () {
		get_sales_data_activity = JSON.parse( window.localStorage.getItem('sales_data_activity'));
		data_login = JSON.parse( window.localStorage.getItem('login_user'));
		filter_activityid = get_sales_data_activity.filter(function(jsonObject){
			return jsonObject.user_id[0] === data_login[1]
		}) 

	    curr_date = $filter('date')(new Date,"yyyy-MM-dd");
		
		for (i=0; i < 3; i++) {
			if ( curr_date >= filter_activityid[i]['begin'] && curr_date <= filter_activityid[i]['end'] ){
				var activity_id_update = filter_activityid[i]['id'];
				window.localStorage.setItem('activity_id_update',JSON.stringify([activity_id_update]));
				$state.go('formupdateactivity')
			}
		}

	 } 
})
   
.controller('formactivityCtrl', function($scope,$http,$state,$filter,config) {
	 
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;

	var getLs = function(key){
		return JSON.parse(window.localStorage.getItem(key));
	}
	// var temp_current_data = JSON.parse(window.localStorage.getItem('temporary_data_create_plan'));
	var temp_current_data = getLs('temporary_data_create_plan');	
	var data_login = getLs('login_user');

	var setLs =function(key,val){

		window.localStorage.setItem(key, JSON.stringify(val)); //set
		
		//refresh
		temp_current_data = getLs(key);
	}
	
	var create_pic = temp_current_data

	if(!temp_current_data){
		// preparation
		create_pic = {
			'pic' : data_login[0],
			'id_user' : data_login[1],
			'monday_before':[],
			'monday_after':[],
			'tuesday_before':[],
			'tuesday_after':[],
			'wednesday_before':[],
	 		'wednesday_after':[],
			'thursday_before':[],
			'thursday_after':[],
			'friday_before':[],
			'friday_after':[],
		};

		setLs('temporary_data_create_plan',[create_pic])
	}
	//nama user yang akan dikirim ke view
	$scope.user = data_login[0];
	$scope.temp_data = getLs('temporary_data_create_plan');

	// setting date
    $scope.dates = {};
    $scope.minDate = new Date();
    $scope.onlyWeekendsPredicate = function(date) {
       var day = date.getDay();
       return day === 1; }
	
	// fungsi On-Change pada date
	$scope.datechange = function() {

	temp_current_data = getLs('temporary_data_create_plan')

	   var begindate = new Date(
	      $scope.dates.myDate.getFullYear(),
	      $scope.dates.myDate.getMonth(),
	      $scope.dates.myDate.getDate());
	   var enddate = new Date(
	      $scope.dates.myDate.getFullYear(),
	      $scope.dates.myDate.getMonth(),
	      $scope.dates.myDate.getDate()+6);
		  $scope.beginDate = $filter('date')(begindate,"yyyy-MM-dd");
		  $scope.endDate = $filter('date')(enddate,"yyyy-MM-dd");

	$http(
			{
				method: 'POST',
				url: 'http://'+config['host']+':'+config['port']+'/openerp/sales.activity/search/',
				data: {
					'domain':[
								['user_id','=',temp_current_data[0].pic],
								['begin','=',$scope.beginDate],
								['end','=',$scope.endDate],
							],
					'usn':name,'pw':pass,'fields':['begin']},
				headers: {
					'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",

				},
			}
		).then(
			function successCallback(response){
				
				if (!response.data['Result'][0]){
			
				 //tambah field
				 temp_current_data[0]['begin']=$scope.beginDate;
				 temp_current_data[0]['end']=$scope.endDate;

				 // window.localStorage.setItem( 'temporary_data_create_plan', JSON.stringify(temp_current_data));
				 setLs('temporary_data_create_plan',temp_current_data)
				}
				else{
					alert('Aktivitas untuk tanggal ini telah dibuat, silahkan ganti dengan tanggal yang lain')
					
				}
			},
			function errorCallback(response){
				alert("Jaringan anda tidak tersedia")
			}
		)		 
	};

	$scope.salesactivity = function(){
		$state.go('salesactivity');
	}

	$scope.previewData = function() {
		console.log('clicked')
		temp_current_data = getLs('temporary_data_create_plan')
		// validasi
		if (temp_current_data[0].begin==null){
			window.alert('Tanggal Belum Diisi')
		}
		else if (temp_current_data[0]['monday_before'].length == 0 || temp_current_data[0]['monday_after'].length == 0) {
			alert("Form Monday Belum Diisi")
		}
		else if (temp_current_data[0]['tuesday_before'].length == 0 || temp_current_data[0]['tuesday_after'].length == 0){
			window.alert('Form Tuesday Belum Diisi')
		}
		else if (temp_current_data[0]['wednesday_before'].length == 0 || temp_current_data[0]['wednesday_after'].length == 0){
			window.alert('Form Wednesday Belum Diisi')
		}
		else if (temp_current_data[0]['thursday_before'].length == 0 || temp_current_data[0]['thursday_after'].length == 0){
			window.alert('Form Thusrday Belum Diisi')
		}
		else if (temp_current_data[0]['friday_before'].length == 0 || temp_current_data[0]['friday_after'].length == 0){
			window.alert('Form Friday Belum Diisi')
		}
		else {
			
			window.alert('Data telah lengkap')
			$state.go('previewcreateplan')
		}			
	}
})

.controller('previewplanactivityCtrl', function($scope,$stateParams,$state,$http,$ionicLoading,config) {

    $scope.pic = $stateParams.pic;
    $scope.begin = $stateParams.begin;
    $scope.end = $stateParams.end; 
	
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;
	var id = $stateParams.id;
	
	var current_local = JSON.parse(window.localStorage.getItem('current_activity_id'));

		verifikasi = false
		for (var i = 0; i < current_local.length; i++) {

			if (id == current_local[i]){
				verifikasi = true
			}
		};
			
		if (verifikasi) {
			console.log("id dah ada bos")
		}
		else {

		 $ionicLoading.show({
		    content: 'Loading',
		    animation: 'fade-in',
		    showBackdrop: true,
		    maxWidth: 200,
		    showDelay: 0
		  });

			current_local.push(id);
			window.localStorage.setItem('current_activity_id',JSON.stringify(current_local));
			
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.senin/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before plan senin dari server')
						$scope.bp_senin = response.data['Result'];
						var bp_update_senin = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_senin'));

						for (var i = 0;i<bp_update_senin.length; i++) {
							currentObj.push(bp_update_senin[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_plan_senin',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.senin/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after plan senin dari server')
						$scope.ap_senin = response.data['Result'];
						var ap_update_senin = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_senin'));
						
						for (var i = 0;i<ap_update_senin.length; i++) {
							currentObj.push(ap_update_senin[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_plan_senin',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.senin/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before actual senin dari server')
						$scope.ba_senin = response.data['Result'];
						var ba_update_senin = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_senin'));
						
						for (var i = 0;i<ba_update_senin.length; i++) {
							currentObj.push(ba_update_senin[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_actual_senin',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.senin/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after actual senin dari server')
						$scope.aa_senin = response.data['Result'];
						var aa_update_senin = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_senin'));
						
						for (var i = 0;i<aa_update_senin.length; i++) {
							currentObj.push(aa_update_senin[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_actual_senin',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)

			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.selasa/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before plan selasa dari server')
						$scope.bp_selasa = response.data['Result'];
						var bp_update_selasa = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_selasa'));

						for (var i = 0;i<bp_update_selasa.length; i++) {
							currentObj.push(bp_update_selasa[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_plan_selasa',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.selasa/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after plan selasa dari server')
						$scope.ap_selasa = response.data['Result'];
						var ap_update_selasa = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_selasa'));
						
						for (var i = 0;i<ap_update_selasa.length; i++) {
							currentObj.push(ap_update_selasa[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_plan_selasa',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.selasa/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before actual selasa dari server')
						$scope.ba_selasa = response.data['Result'];
						var ba_update_selasa = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_selasa'));
						
						for (var i = 0;i<ba_update_selasa.length; i++) {
							currentObj.push(ba_update_selasa[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_actual_selasa',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.selasa/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after actual selasa dari server')
						$scope.aa_selasa = response.data['Result'];
						var aa_update_selasa = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_selasa'));
						
						for (var i = 0;i<aa_update_selasa.length; i++) {
							currentObj.push(aa_update_selasa[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_actual_selasa',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)

			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.rabu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before plan rabu dari server')
						$scope.bp_rabu = response.data['Result'];
						var bp_update_rabu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_rabu'));

						for (var i = 0;i<bp_update_rabu.length; i++) {
							currentObj.push(bp_update_rabu[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_plan_rabu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.rabu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after plan rabu dari server')
						$scope.ap_rabu = response.data['Result'];
						var ap_update_rabu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_rabu'));
						
						for (var i = 0;i<ap_update_rabu.length; i++) {
							currentObj.push(ap_update_rabu[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_plan_rabu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.rabu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before actual rabu dari server')
						$scope.ba_rabu = response.data['Result'];
						var ba_update_rabu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_rabu'));
						
						for (var i = 0;i<ba_update_rabu.length; i++) {
							currentObj.push(ba_update_rabu[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_actual_rabu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.rabu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after actual rabu dari server')
						$scope.aa_rabu = response.data['Result'];
						var aa_update_rabu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_rabu'));
						
						for (var i = 0;i<aa_update_rabu.length; i++) {
							currentObj.push(aa_update_rabu[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_actual_rabu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)

			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.kamis/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before plan kamis dari server')
						$scope.bp_kamis = response.data['Result'];
						var bp_update_kamis = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_kamis'));

						for (var i = 0;i<bp_update_kamis.length; i++) {
							currentObj.push(bp_update_kamis[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_plan_kamis',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.kamis/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after plan kamis dari server')
						$scope.ap_kamis = response.data['Result'];
						var ap_update_kamis = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_kamis'));
						
						for (var i = 0;i<ap_update_kamis.length; i++) {
							currentObj.push(ap_update_kamis[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_plan_kamis',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.kamis/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before actual kamis dari server')
						$scope.ba_kamis = response.data['Result'];
						var ba_update_kamis = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_kamis'));
						
						for (var i = 0;i<ba_update_kamis.length; i++) {
							currentObj.push(ba_update_kamis[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_actual_kamis',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.kamis/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after actual kamis dari server')
						$scope.aa_kamis = response.data['Result'];
						var aa_update_kamis = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_kamis'));
						
						for (var i = 0;i<aa_update_kamis.length; i++) {
							currentObj.push(aa_update_kamis[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_actual_kamis',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)

			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.jumat/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before plan jumat dari server')
						$scope.bp_jumat = response.data['Result'];
						var bp_update_jumat = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_jumat'));

						for (var i = 0;i<bp_update_jumat.length; i++) {
							currentObj.push(bp_update_jumat[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_plan_jumat',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.jumat/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after plan jumat dari server')
						$scope.ap_jumat = response.data['Result'];
						var ap_update_jumat = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_jumat'));
						
						for (var i = 0;i<ap_update_jumat.length; i++) {
							currentObj.push(ap_update_jumat[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_plan_jumat',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.jumat/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before actual jumat dari server')
						$scope.ba_jumat = response.data['Result'];
						var ba_update_jumat = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_jumat'));
						
						for (var i = 0;i<ba_update_jumat.length; i++) {
							currentObj.push(ba_update_jumat[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_actual_jumat',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.jumat/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after actual jumat dari server')
						$scope.aa_jumat = response.data['Result'];
						var aa_update_jumat = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_jumat'));
						
						for (var i = 0;i<aa_update_jumat.length; i++) {
							currentObj.push(aa_update_jumat[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_actual_jumat',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)

			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.sabtu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before plan sabtu dari server')
						$scope.bp_sabtu = response.data['Result'];
						var bp_update_sabtu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_sabtu'));

						for (var i = 0;i<bp_update_sabtu.length; i++) {
							currentObj.push(bp_update_sabtu[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_plan_sabtu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.sabtu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after plan sabtu dari server')
						$scope.ap_sabtu = response.data['Result'];
						var ap_update_sabtu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_sabtu'));
						
						for (var i = 0;i<ap_update_sabtu.length; i++) {
							currentObj.push(ap_update_sabtu[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_plan_sabtu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.sabtu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before actual sabtu dari server')
						$scope.ba_sabtu = response.data['Result'];
						var ba_update_sabtu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_sabtu'));
						
						for (var i = 0;i<ba_update_sabtu.length; i++) {
							currentObj.push(ba_update_sabtu[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_actual_sabtu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.sabtu/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after actual sabtu dari server')
						$scope.aa_sabtu = response.data['Result'];
						var aa_update_sabtu = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_sabtu'));
						
						for (var i = 0;i<aa_update_sabtu.length; i++) {
							currentObj.push(aa_update_sabtu[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_actual_sabtu',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)

			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.plan.ahad/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before plan ahad dari server')
						$scope.bp_ahad = response.data['Result'];
						var bp_update_ahad = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_ahad'));

						for (var i = 0;i<bp_update_ahad.length; i++) {
							currentObj.push(bp_update_ahad[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_plan_ahad',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.plan.ahad/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after plan ahad dari server')
						$scope.ap_ahad = response.data['Result'];
						var ap_update_ahad = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_ahad'));
						
						for (var i = 0;i<ap_update_ahad.length; i++) {
							currentObj.push(ap_update_ahad[i]);
						};
						
						window.localStorage.setItem('sales_activity_after_plan_ahad',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.ahad/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage before actual ahad dari server')
						$scope.ba_ahad = response.data['Result'];
						var ba_update_ahad = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_ahad'));
						
						for (var i = 0;i<ba_update_ahad.length; i++) {
							currentObj.push(ba_update_ahad[i]);
						};
						
						window.localStorage.setItem('sales_activity_before_actual_ahad',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.ahad/search/',
						data: {
							'domain':[
										['activity_id','=',parseInt(id)],
									],
							'usn':name,'pw':pass ,'fields':[]},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						console.log('sukses nambah storage after actual ahad dari server')
						$scope.aa_ahad = response.data['Result'];
						var aa_update_ahad = response.data['Result'];

						var currentObj = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_ahad'));
						
						for (var i = 0;i<aa_update_ahad.length; i++) {
							currentObj.push(aa_update_ahad[i]);
						};
						$ionicLoading.hide();
						window.localStorage.setItem('sales_activity_after_actual_ahad',JSON.stringify(currentObj));
					},
					function errorCallback(response){
						console.log('erroor data kosong');
					}
				)
				$ionicLoading.hide();
		}
			var bpsenin = []; var apsenin = []; var basenin = []; var aasenin = [];
			var bpselasa = []; var apselasa = []; var baselasa = []; var aaselasa = [];
			var bprabu = []; var aprabu = []; var barabu = []; var aarabu = [];
			var bpkamis = []; var apkamis = []; var bakamis = []; var aakamis = [];
			var bpjumat = []; var apjumat = []; var bajumat = []; var aajumat = [];
			var bpsabtu = []; var apsabtu = []; var basabtu = []; var aasabtu = [];
			var bpahad = []; var apahad = []; var baahad = []; var aaahad = []; 

			var idx = id;
			
			var get_sales_activity_before_plan_senin = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_senin'));

			for (var i = 0; i < get_sales_activity_before_plan_senin.length; i++) {

				if (idx == get_sales_activity_before_plan_senin[i].activity_id[0]){
					bpsenin.push(get_sales_activity_before_plan_senin[i])
				}
			};
			 
			$scope.bp_senin = bpsenin;	

			var get_sales_activity_after_plan_senin = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_senin'));

			for (var i = 0; i < get_sales_activity_after_plan_senin.length; i++) {

				if (idx == get_sales_activity_after_plan_senin[i].activity_id[0]){
					apsenin.push(get_sales_activity_after_plan_senin[i])
				}
			};
			 
			$scope.ap_senin = apsenin;

			var get_sales_activity_before_actual_senin = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_senin'));

			for (var i = 0; i < get_sales_activity_before_actual_senin.length; i++) {

				if (idx == get_sales_activity_before_actual_senin[i].activity_id[0]){
					basenin.push(get_sales_activity_before_actual_senin[i])
				}
			};
			 
			$scope.ba_senin = basenin;	

			var get_sales_activity_after_actual_senin = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_senin'));

			for (var i = 0; i < get_sales_activity_after_actual_senin.length; i++) {

				if (idx == get_sales_activity_after_actual_senin[i].activity_id[0]){
					aasenin.push(get_sales_activity_after_actual_senin[i])
				}
			};
			 
			$scope.aa_senin = aasenin;

			var get_sales_activity_before_plan_selasa = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_selasa'));

			for (var i = 0; i < get_sales_activity_before_plan_selasa.length; i++) {

				if (idx == get_sales_activity_before_plan_selasa[i].activity_id[0]){
					bpselasa.push(get_sales_activity_before_plan_selasa[i])
				}
			};
			 
			$scope.bp_selasa = bpselasa;	

			var get_sales_activity_after_plan_selasa = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_selasa'));

			for (var i = 0; i < get_sales_activity_after_plan_selasa.length; i++) {

				if (idx == get_sales_activity_after_plan_selasa[i].activity_id[0]){
					apselasa.push(get_sales_activity_after_plan_selasa[i])
				}
			};
			 
			$scope.ap_selasa = apselasa;

			var get_sales_activity_before_actual_selasa = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_selasa'));

			for (var i = 0; i < get_sales_activity_before_actual_selasa.length; i++) {

				if (idx == get_sales_activity_before_actual_selasa[i].activity_id[0]){
					baselasa.push(get_sales_activity_before_actual_selasa[i])
				}
			};
			 
			$scope.ba_selasa = baselasa;	

			var get_sales_activity_after_actual_selasa = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_selasa'));

			for (var i = 0; i < get_sales_activity_after_actual_selasa.length; i++) {

				if (idx == get_sales_activity_after_actual_selasa[i].activity_id[0]){
					aaselasa.push(get_sales_activity_after_actual_selasa[i])
				}
			};
			 
			$scope.aa_selasa = aaselasa;

			var get_sales_activity_before_plan_rabu = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_rabu'));

			for (var i = 0; i < get_sales_activity_before_plan_rabu.length; i++) {

				if (idx == get_sales_activity_before_plan_rabu[i].activity_id[0]){
					bprabu.push(get_sales_activity_before_plan_rabu[i])
				}
			};
			 
			$scope.bp_rabu = bprabu;	

			var get_sales_activity_after_plan_rabu = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_rabu'));

			for (var i = 0; i < get_sales_activity_after_plan_rabu.length; i++) {

				if (idx == get_sales_activity_after_plan_rabu[i].activity_id[0]){
					aprabu.push(get_sales_activity_after_plan_rabu[i])
				}
			};
			 
			$scope.ap_rabu = aprabu;

			var get_sales_activity_before_actual_rabu = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_rabu'));

			for (var i = 0; i < get_sales_activity_before_actual_rabu.length; i++) {

				if (idx == get_sales_activity_before_actual_rabu[i].activity_id[0]){
					barabu.push(get_sales_activity_before_actual_rabu[i])
				}
			};
			 
			$scope.ba_rabu = barabu;	

			var get_sales_activity_after_actual_rabu = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_rabu'));

			for (var i = 0; i < get_sales_activity_after_actual_rabu.length; i++) {

				if (idx == get_sales_activity_after_actual_rabu[i].activity_id[0]){
					aarabu.push(get_sales_activity_after_actual_rabu[i])
				}
			};
			 
			$scope.aa_rabu = aarabu;

			var get_sales_activity_before_plan_kamis = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_kamis'));

			for (var i = 0; i < get_sales_activity_before_plan_kamis.length; i++) {

				if (idx == get_sales_activity_before_plan_kamis[i].activity_id[0]){
					bpkamis.push(get_sales_activity_before_plan_kamis[i])
				}
			};
			 
			$scope.bp_kamis = bpkamis;	

			var get_sales_activity_after_plan_kamis = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_kamis'));

			for (var i = 0; i < get_sales_activity_after_plan_kamis.length; i++) {

				if (idx == get_sales_activity_after_plan_kamis[i].activity_id[0]){
					apkamis.push(get_sales_activity_after_plan_kamis[i])
				}
			};
			 
			$scope.ap_kamis = apkamis;

			var get_sales_activity_before_actual_kamis = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_kamis'));

			for (var i = 0; i < get_sales_activity_before_actual_kamis.length; i++) {

				if (idx == get_sales_activity_before_actual_kamis[i].activity_id[0]){
					bakamis.push(get_sales_activity_before_actual_kamis[i])
				}
			};
			 
			$scope.ba_kamis = bakamis;	

			var get_sales_activity_after_actual_kamis = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_kamis'));

			for (var i = 0; i < get_sales_activity_after_actual_kamis.length; i++) {

				if (idx == get_sales_activity_after_actual_kamis[i].activity_id[0]){
					aakamis.push(get_sales_activity_after_actual_kamis[i])
				}
			};
			 
			$scope.aa_kamis = aakamis;

			var get_sales_activity_before_plan_jumat = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_jumat'));

			for (var i = 0; i < get_sales_activity_before_plan_jumat.length; i++) {

				if (idx == get_sales_activity_before_plan_jumat[i].activity_id[0]){
					bpjumat.push(get_sales_activity_before_plan_jumat[i])
				}
			};
			 
			$scope.bp_jumat = bpjumat;	

			var get_sales_activity_after_plan_jumat = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_jumat'));

			for (var i = 0; i < get_sales_activity_after_plan_jumat.length; i++) {

				if (idx == get_sales_activity_after_plan_jumat[i].activity_id[0]){
					apjumat.push(get_sales_activity_after_plan_jumat[i])
				}
			};
			 
			$scope.ap_jumat = apjumat;

			var get_sales_activity_before_actual_jumat = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_jumat'));

			for (var i = 0; i < get_sales_activity_before_actual_jumat.length; i++) {

				if (idx == get_sales_activity_before_actual_jumat[i].activity_id[0]){
					bajumat.push(get_sales_activity_before_actual_jumat[i])
				}
			};
			 
			$scope.ba_jumat = bajumat;	

			var get_sales_activity_after_actual_jumat = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_jumat'));

			for (var i = 0; i < get_sales_activity_after_actual_jumat.length; i++) {

				if (idx == get_sales_activity_after_actual_jumat[i].activity_id[0]){
					aajumat.push(get_sales_activity_after_actual_jumat[i])
				}
			};
			 
			$scope.aa_jumat = aajumat;

			var get_sales_activity_before_plan_sabtu = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_sabtu'));

			for (var i = 0; i < get_sales_activity_before_plan_sabtu.length; i++) {

				if (idx == get_sales_activity_before_plan_sabtu[i].activity_id[0]){
					bpsabtu.push(get_sales_activity_before_plan_sabtu[i])
				}
			};
			 
			$scope.bp_sabtu = bpsabtu;	

			var get_sales_activity_after_plan_sabtu = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_sabtu'));

			for (var i = 0; i < get_sales_activity_after_plan_sabtu.length; i++) {

				if (idx == get_sales_activity_after_plan_sabtu[i].activity_id[0]){
					apsabtu.push(get_sales_activity_after_plan_sabtu[i])
				}
			};
			 
			$scope.ap_sabtu = apsabtu;

			var get_sales_activity_before_actual_sabtu = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_sabtu'));

			for (var i = 0; i < get_sales_activity_before_actual_sabtu.length; i++) {

				if (idx == get_sales_activity_before_actual_sabtu[i].activity_id[0]){
					basabtu.push(get_sales_activity_before_actual_sabtu[i])
				}
			};
			 
			$scope.ba_sabtu = basabtu;	

			var get_sales_activity_after_actual_sabtu = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_sabtu'));

			for (var i = 0; i < get_sales_activity_after_actual_sabtu.length; i++) {

				if (idx == get_sales_activity_after_actual_sabtu[i].activity_id[0]){
					aasabtu.push(get_sales_activity_after_actual_sabtu[i])
				}
			};
			 
			$scope.aa_sabtu = aasabtu;

			var get_sales_activity_before_plan_ahad = JSON.parse(window.localStorage.getItem('sales_activity_before_plan_ahad'));

			for (var i = 0; i < get_sales_activity_before_plan_ahad.length; i++) {

				if (idx == get_sales_activity_before_plan_ahad[i].activity_id[0]){
					bpahad.push(get_sales_activity_before_plan_ahad[i])
				}
			};
			 
			$scope.bp_ahad = bpahad;	

			var get_sales_activity_after_plan_ahad = JSON.parse(window.localStorage.getItem('sales_activity_after_plan_ahad'));

			for (var i = 0; i < get_sales_activity_after_plan_ahad.length; i++) {

				if (idx == get_sales_activity_after_plan_ahad[i].activity_id[0]){
					apahad.push(get_sales_activity_after_plan_ahad[i])
				}
			};
			 
			$scope.ap_ahad = apahad;

			var get_sales_activity_before_actual_ahad = JSON.parse(window.localStorage.getItem('sales_activity_before_actual_ahad'));

			for (var i = 0; i < get_sales_activity_before_actual_ahad.length; i++) {

				if (idx == get_sales_activity_before_actual_ahad[i].activity_id[0]){
					baahad.push(get_sales_activity_before_actual_ahad[i])
				}
			};
			 
			$scope.ba_ahad = baahad;	

			var get_sales_activity_after_actual_ahad = JSON.parse(window.localStorage.getItem('sales_activity_after_actual_ahad'));

			for (var i = 0; i < get_sales_activity_after_actual_ahad.length; i++) {

				if (idx == get_sales_activity_after_actual_ahad[i].activity_id[0]){
					aaahad.push(get_sales_activity_after_actual_ahad[i])
				}
			};
			 
			$scope.aa_ahad = aaahad;
})

.controller('formupdateactivityCtrl', function($scope,$stateParams,$state,$http,config) {
	
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd"));
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug"));

	id_activity_update = JSON.parse( window.localStorage.getItem('activity_id_update')); // ambil activity id yanga akan diupdate
	data_login = JSON.parse( window.localStorage.getItem('login_user'));
	
	$scope.username_update = data_login[0];
	
	//fungsi untuk mencari hari
	var day = ['ahad','senin','selasa','rabu','kamis','jumat','sabtu'];
	var date_current = new Date();
	$scope.date_cur = date_current;
	var get_day = day[date_current.getDay()];

		//ambil data dari before_actual yang akan di update
			$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.'+get_day+'/search/',
					data: {'usn':name,'pw':pass , 
						   'fields':[],
						   'domain':[
										['activity_id','=',id_activity_update[0]],
									],
						},

					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
				}
			).then(
				function successCallback(response){

					$scope.current_beforeactual = response.data['Result'];  
				},
				function errorCallback(response){
					get_update_data_sync_view = JSON.parse( window.localStorage.getItem('update_data_sync_view'));
					get_before_day = 'beforeactual'+get_day;
					get_before_add_day = 'beforeactualadd'+get_day;
					get_sales_data_activity = JSON.parse( window.localStorage.getItem('sales_data_activity'));
					filter_salesdataactivity = get_sales_data_activity.filter(function(jsonObject){
						return jsonObject.id === id_activity_update[0]
					})

					if (get_update_data_sync_view[0][get_before_day]) {

						$scope.current_beforeactual = get_update_data_sync_view[0][get_before_day];
						$scope.fBUpdate = get_update_data_sync_view[0][get_before_add_day];
					}
					else if (filter_salesdataactivity.length != 0) {

						beforeactual_mapping = [];
						
						for (bef_act_id = 0; bef_act_id < filter_salesdataactivity[0]['beforeactual'+get_day].length; bef_act_id++) {
							beforeactual_mapping.push({'id': filter_salesdataactivity[0]['beforeactual'+get_day][bef_act_id]});
						}

						get_sales_activity_before_actual = JSON.parse( window.localStorage.getItem('sales_activity_before_actual_'+get_day));

						for (gsaba = 0; gsaba < get_sales_activity_before_actual.length ; gsaba ++ ) {
							
							for(bai = 0; bai < beforeactual_mapping.length; bai++) {

								if ( beforeactual_mapping[bai].id == get_sales_activity_before_actual[gsaba].id) {
									beforeactual_mapping[bai]['partner_id'] = get_sales_activity_before_actual[gsaba].partner_id;
									beforeactual_mapping[bai]['location'] = get_sales_activity_before_actual[gsaba].location;
									beforeactual_mapping[bai]['plan_id'] = get_sales_activity_before_actual[gsaba].plan_id;
									beforeactual_mapping[bai]['batal'] = get_sales_activity_before_actual[gsaba].batal;
									beforeactual_mapping[bai]['name'] = get_sales_activity_before_actual[gsaba].name;
									beforeactual_mapping[bai]['activity_id'] = get_sales_activity_before_actual[gsaba].activity_id;
								}								
							}
						}

						$scope.current_beforeactual = beforeactual_mapping;
					}
					else{
						alert("Actual tidak bisa diupdate")
					}
				}
			)
		
		//ambil data dari after_actual yang akan di update			
			$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.'+get_day+'/search/',
					data: {'usn':name,'pw':pass , 
						   'fields':[],
							   'domain':[
										['activity_id','=',id_activity_update[0]],
									],

					},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					},
				
				}
			).then(
				function successCallback(response){
					$scope.current_afteractual = response.data['Result'];
	
				},
				function errorCallback(response){
					get_update_data_sync_view = JSON.parse( window.localStorage.getItem('update_data_sync_view'));
					get_after_day = 'afteractual'+get_day;
					get_after_add_day = 'afteractualadd'+get_day;
					get_sales_data_activity = JSON.parse( window.localStorage.getItem('sales_data_activity'));
					filter_salesdataactivity = get_sales_data_activity.filter(function(jsonObject){
						return jsonObject.id === id_activity_update[0]
					})

					if (get_update_data_sync_view[0][get_after_day]) {

						$scope.current_afteractual = get_update_data_sync_view[0][get_after_day];
						$scope.fAUpdate = get_update_data_sync_view[0][get_after_add_day];
					}
					else if (filter_salesdataactivity.length != 0) {

						afteractual_mapping = [];
						
						for (aft_act_id = 0; aft_act_id < filter_salesdataactivity[0]['afteractual'+get_day].length; aft_act_id++) {
							afteractual_mapping.push({'id': filter_salesdataactivity[0]['afteractual'+get_day][aft_act_id]});
						}

						get_sales_activity_after_actual = JSON.parse( window.localStorage.getItem('sales_activity_after_actual_'+get_day));

						for (gsaaa = 0; gsaaa < get_sales_activity_after_actual.length ; gsaaa ++ ) {
							
							for(aai = 0; aai < afteractual_mapping.length; aai++) {

								if ( afteractual_mapping[aai].id == get_sales_activity_after_actual[gsaaa].id) {
									afteractual_mapping[aai]['partner_id'] = get_sales_activity_after_actual[gsaaa].partner_id;
									afteractual_mapping[aai]['location'] = get_sales_activity_after_actual[gsaaa].location;
									afteractual_mapping[aai]['plan_id'] = get_sales_activity_after_actual[gsaaa].plan_id;
									afteractual_mapping[aai]['batal'] = get_sales_activity_after_actual[gsaaa].batal;
									afteractual_mapping[aai]['name'] = get_sales_activity_after_actual[gsaaa].name;
									afteractual_mapping[aai]['activity_id'] = get_sales_activity_after_actual[gsaaa].activity_id;
								}								
							}
						}		
						
						$scope.current_afteractual = afteractual_mapping;
					}
					else {
						alert("Actual tidak bisa diupdate")
					}
				}
			)

	//fungsi tambah form
	$scope.fBUpdate = [];
	$scope.fAUpdate = [];

	$scope.tambahformBeforeUp = function() {
		var newItemNo = $scope.fBUpdate.length+1;
	    // $scope.fBUpdate.push({'id':'bpu'+newItemNo});
	    $scope.fBUpdate.push({});
	};  
	$scope.tambahformAfterUp = function() {
		var newItemNo = $scope.fAUpdate.length+1;
	    // $scope.fAUpdate.push({'id':'apu'+newItemNo});
	    $scope.fAUpdate.push({});
	};
	
	//fungsi untuk nyari data
	$scope.getMatches = function(searchText){
		var res_matched = [];
		
		// cari via ajax
		res_matched = $http
	  	(
			{
				method: 'POST',
				url: 'http://'+config['host']+':'+config['port']+'/openerp/res.partner/search/',
				data: {
				'domain':[
							['is_company','=','false'],
							['customer','=','true'],
							['display_name','ilike',searchText]
						],
				'usn':name,'pw':pass ,'fields':['display_name']},
				headers: {
					'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
				  
				},
			}
		).then(function(response){
			// if success
			return response.data.Result
		},
		function(response){
			return []
		})
		
		return res_matched
	}

	//fungsi hapus form yang telah di send ke server (ket: yang tidak memiliki plan id)
	var dataHapusBef = [];
	var dataHapusAft = [];
	$scope.hapusBefore = function(index) {	
	dataHapusBef.push($scope.current_beforeactual[index].id);
	$scope.current_beforeactual.splice(index, 1);
	// console.log(dataHapusBef,'ini data yang dihapus')
	};
	
	$scope.hapusAfter = function(index) {
	dataHapusAft.push($scope.current_afteractual[index].id);
	$scope.current_afteractual.splice(index, 1);
	console.log(dataHapusAft,'ini data yang dihapus')
	};

	//fungsi remove form add
	$scope.removeBeforeUp = function() {
    var lastItem = $scope.fBUpdate.length-1;
    $scope.fBUpdate.splice(lastItem);
  	};

	$scope.removeAfterUp = function() {
    var lastItem = $scope.fAUpdate.length-1;
    $scope.fAUpdate.splice(lastItem);
  	};


  	$scope.backsalesactivity = function() {
  		$state.go('salesactivity');
  	}

	$scope.update = function() {

		var data1 = 'beforeactual'+get_day;
		var data2 = 'afteractual'+get_day;
		var data1add = 'beforeactualadd'+get_day;
		var data2add = 'afteractualadd'+get_day;
		
		var data_before = $scope.current_beforeactual;
		var data_after = $scope.current_afteractual;
		var data_beforeAdd = $scope.fBUpdate;
		var data_afterAdd = $scope.fAUpdate;

		var isi_update={}
		isi_update[data1]=[];
		isi_update[data2]=[];

		var data_readUp={}
		data_readUp[data1]=[];
		data_readUp[data2]=[];	
		data_readUp[data1add]=[];
		data_readUp[data2add]=[];			

		var get_update_data = JSON.parse( window.localStorage.getItem('update_data_temp'));

		//fungsi untuk validasi data telah diiisi semuanya
		val_updBefore =  false;
		val_updAfter =  false; 

		// loop data before actual
		for (val_dbu= 0 ; val_dbu < data_before.length ; val_dbu++) {
			if (data_before[val_dbu].name=="") {
				val_updBefore = true;
				break;
			}
		}
		for (val_dau= 0 ; val_dau < data_after.length ; val_dau++) {
			if (data_after[val_dau].name=="") {
				val_updAfter = true;
				break;
			}
		}

		//proses
		if (val_updBefore || val_updAfter) {
			alert('seluruh result harus terisi')
		}
		else {
				//mappiing untuk data yang akan diupdate
				for (dbu = 0; dbu < data_before.length; dbu++) {
					isi_update[data1].push([1,data_before[dbu].id,{'name':data_before[dbu].name,
					'batal': data_before[dbu].batal}])
				}
				for (dau = 0; dau < data_after.length; dau++) {
					isi_update[data2].push([1,data_after[dau].id,{'name':data_after[dau].name,
					'batal': data_after[dau].batal }])
				}
				// mapping untuk data yang akan ditambahkan pada saat update
				for (var dba = 0; dba < data_beforeAdd.length; dba++) {

					if(data_beforeAdd[dba]['customer']==null){
						partner_id = null
						toPush = [
							0,
							0,
							{
								'location':data_beforeAdd[dba]['location'],
								'name':data_beforeAdd[dba]['name']
							}
						]
					}else{
						
						partner_id = data_beforeAdd[dba]['customer'].id
						toPush = [
							0,
							0,
							{
								'partner_id':partner_id,
								'location':data_beforeAdd[dba]['location'],
								'name':data_beforeAdd[dba]['name']
							}
						]
					}
					
					isi_update[data1].push(toPush)
				};
				for (var daa = 0; daa < data_afterAdd.length; daa++) {
				
					if(data_afterAdd[daa]['customer']==null){
							partner_id = null
							toPush = [
								0,
								0,
								{
									'location':data_afterAdd[daa]['location'],
									'name':data_afterAdd[daa]['name']
								}
							]
						}else{
							partner_id = data_afterAdd[daa]['customer'].id
							toPush = [
								0,
								0,
								{
									'partner_id':partner_id,
									'location':data_afterAdd[daa]['location'],
									'name':data_afterAdd[daa]['name']
								}
							]
						}
						
						isi_update[data2].push(toPush)
					};
				// mapping untuk hapus data yang ada di server pada saat update (ket : hanya data tanpa plan_id)
				for (var drb = 0; drb < dataHapusBef.length; drb++) {
					isi_update[data1].push([2,dataHapusBef[drb]])
				};
				for (var dra = 0; dra < dataHapusAft.length; dra++) {
					isi_update[data2].push([2,dataHapusAft[dra]])
					};

				// mapping untuk data update yang akan ditampilkan pada form sync jika data belum terkirim
				for (dbuv = 0; dbuv < data_before.length; dbuv++) {
					data_readUp[data1].push({'partner_id':data_before[dbuv].partner_id,'location':data_before[dbuv].location,
					'name':data_before[dbuv].name,'plan_id':data_before[dbuv].plan_id,'batal': data_before[dbuv].batal, 
					'id' : data_before[dbuv].id})
				}
				for (dauv = 0; dauv < data_after.length; dauv++) {
					data_readUp[data2].push({'partner_id':data_after[dauv].partner_id,'location':data_after[dauv].location,
					'name':data_after[dauv].name,'plan_id':data_after[dauv].plan_id,'batal': data_after[dauv].batal, 
					'id' : data_after[dauv].id})
				}

				// mapping untuk data yang ditambahkan saat update yang akan ditampilkan pada form sync jika data belum terkirim
				for (dbav = 0; dbav < data_beforeAdd.length; dbav++) {
					
					if(data_beforeAdd[dbav]['customer']==null){
						customer = null
						toPush = {'customer':customer,'location':data_beforeAdd[dbav].location,'name':data_beforeAdd[dbav].name,
						'plan_id':false,'batal':false}
					}else{
						customer = data_beforeAdd[dbav]['customer'];
						toPush = {'customer':customer,'location':data_beforeAdd[dbav].location,'name':data_beforeAdd[dbav].name,
						'plan_id':false,'batal':false}
					}
					data_readUp[data1add].push(toPush)
				}
				for (daav = 0; daav < data_afterAdd.length; daav++) {
					
					if(data_afterAdd[daav]['customer']==null){
						customer = null
						toPush = {'customer':customer,'location':data_afterAdd[daav].location,'name':data_afterAdd[daav].name,
						'plan_id':false,'batal':false}
					}else{
						customer = data_afterAdd[daav]['customer'];
						toPush = {'customer':customer,'location':data_afterAdd[daav].location,'name':data_afterAdd[daav].name,
						'plan_id':false,'batal':false}
					}
					data_readUp[data2add].push(toPush)
				}

				// simpan data di localStorage
				if (get_update_data == null) {
					
					var update_data_temp = {'activity_id' : id_activity_update[0], 'data_val' : isi_update};
					window.localStorage.setItem('update_data_temp', JSON.stringify(update_data_temp));
					window.localStorage.setItem('update_data_sync_view', JSON.stringify([data_readUp]));
				}
				// jika data form local storage exist maka update ls tsb
				else {
					
					var get_update_data_add = JSON.parse( window.localStorage.getItem('update_data_temp'));
					var get_update_data_sync_view_add = JSON.parse( window.localStorage.getItem('update_data_sync_view'));
					
					get_update_data_add['data_val'][data1] = isi_update[data1];
					get_update_data_add['data_val'][data2] = isi_update[data2];	

					get_update_data_sync_view_add[0][data1] = data_readUp[data1];
					get_update_data_sync_view_add[0][data2] = data_readUp[data2];
					get_update_data_sync_view_add[0][data1add] = data_readUp[data1add];
					get_update_data_sync_view_add[0][data2add] = data_readUp[data2add];	

					window.localStorage.setItem('update_data_temp', JSON.stringify(get_update_data_add));
					window.localStorage.setItem('update_data_sync_view', JSON.stringify(get_update_data_sync_view_add));
				}

			var get_update_data = JSON.parse( window.localStorage.getItem('update_data_temp'));
			
			//fungsi kirim data yang akan diupdate ke server
			$http(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/update/sales.activity/',
						data: {
							'usn':name,'pw':pass ,'ids':get_update_data['activity_id'],'vals':get_update_data['data_val']
						},
						headers: {
							'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
						},		
					}
				).then(
					function successCallback(response){
						alert("sukses")
						window.localStorage.removeItem('update_data_temp'); //ls dihapus
						window.localStorage.removeItem('update_data_sync_view'); // ls dihapus

					//fungsi untuk get data dan kirim data update ke localstorage yang di tuju
						//ambil data dari before_actual yang akan di update
						$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.'+get_day+'/search/',
								data: {'usn':name,'pw':pass , 
									   'fields':[],
									   'domain':[
													['activity_id','=',id_activity_update[0]],
												],
									},

								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								  
								},
							}
						).then(
							function successCallback(response){
								var update_day_activity_before = JSON.parse( window.localStorage.getItem('sales_activity_before_actual_'+get_day));
								var data_update_before = response.data['Result'];

								//fungsi hapus data yang akan di update
								var newPushBefore = []
								angular.forEach(update_day_activity_before, function(val_hapusBefore,key_hapusBefore){
									if(val_hapusBefore['activity_id'][0] != id_activity_update[0]){
										newPushBefore.push(val_hapusBefore)
									}
								})

								// fungsi tambah data yang telah diupdate dan disimpan di local storage
								// tambahin dari response
								angular.forEach(data_update_before, function(val_tambahBefore,key_tambahBefore){
									newPushBefore.push(val_tambahBefore)
								})

								window.localStorage.setItem('sales_activity_before_actual_'+get_day, JSON.stringify(newPushBefore));
							},
							function errorCallback(response){
								console.log('gagal ambil data update before dari server')
							}
						)

						//ambil data dari after_actual yang akan di update			
						$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.'+get_day+'/search/',
								data: {'usn':name,'pw':pass , 
									   'fields':[],
										   'domain':[
													['activity_id','=',id_activity_update[0]],
												],

								},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								},
							
							}
						).then(
							function successCallback(response){
								var update_day_activity_after = JSON.parse( window.localStorage.getItem('sales_activity_after_actual_'+get_day));
								var data_update_after = response.data['Result'];
								
								//fungsi hapus data yang akan di update
								var newPushAfter = []
								angular.forEach(update_day_activity_after, function(val_hapusAfter,key_hapusAfter){
									if(val_hapusAfter['activity_id'][0] != id_activity_update[0]){
										newPushAfter.push(val_hapusAfter)
									}
								})

								// fungsi tambah data yang telah diupdate dan disimpan di local storage
								// tambahin dari response
								angular.forEach(data_update_after, function(val_tambahAfter,key_tambahAfter){
									newPushAfter.push(val_tambahAfter)
								})

								window.localStorage.setItem('sales_activity_after_actual_'+get_day, JSON.stringify(newPushAfter));
							},
							function errorCallback(response){
								console.log('gagal ambil data update after dari server')
							}
						)
							window.localStorage.removeItem('activity_id_update');
							$state.go('salesactivity')

					},
					function errorCallback(response){
						alert("Koneksi saat ini tidak tersedia, data anda akan kami simpan")
						$state.go('salesactivity');
					}
				)			
		}

	}
})

.controller('previewsyncupdateCtrl', function($http,$scope,$state,config) {
		
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;
	data_login = JSON.parse( window.localStorage.getItem('login_user'));

	$scope.username = data_login[0]; 

	var get_update_data_sync_view_add = JSON.parse( window.localStorage.getItem('update_data_sync_view'));

	$scope.befsenin = get_update_data_sync_view_add[0].beforeactualsenin;
	$scope.afsenin = get_update_data_sync_view_add[0].afteractualsenin;
	$scope.befselasa = get_update_data_sync_view_add[0].beforeactualselasa;
	$scope.afselasa = get_update_data_sync_view_add[0].afteractualselasa;
	$scope.befrabu = get_update_data_sync_view_add[0].beforeactualrabu;
	$scope.afrabu = get_update_data_sync_view_add[0].afteractualrabu;
	$scope.befkamis = get_update_data_sync_view_add[0].beforeactualkamis;
	$scope.afkamis = get_update_data_sync_view_add[0].afteractualkamis;
	$scope.befjumat = get_update_data_sync_view_add[0].beforeactualjumat;
	$scope.afjumat = get_update_data_sync_view_add[0].afteractualjumat;
	$scope.befsabtu = get_update_data_sync_view_add[0].beforeactualsabtu;
	$scope.afsabtu = get_update_data_sync_view_add[0].afteractualsabtu;
	$scope.befahad = get_update_data_sync_view_add[0].beforeactualahad;
	$scope.afahad = get_update_data_sync_view_add[0].afteractualahad;

	$scope.befaddsenin = get_update_data_sync_view_add[0].beforeactualaddsenin;
	$scope.afaddsenin = get_update_data_sync_view_add[0].afteractualaddsenin;
	$scope.befaddselasa = get_update_data_sync_view_add[0].beforeactualaddselasa;
	$scope.afaddselasa = get_update_data_sync_view_add[0].afteractualaddselasa;
	$scope.befaddrabu = get_update_data_sync_view_add[0].beforeactualaddrabu;
	$scope.afaddrabu = get_update_data_sync_view_add[0].afteractualaddrabu;
	$scope.befaddkamis = get_update_data_sync_view_add[0].beforeactualaddkamis;
	$scope.afaddkamis = get_update_data_sync_view_add[0].afteractualaddkamis;
	$scope.befaddjumat = get_update_data_sync_view_add[0].beforeactualaddjumat;
	$scope.afaddjumat = get_update_data_sync_view_add[0].afteractualaddjumat;
	$scope.befaddsabtu = get_update_data_sync_view_add[0].beforeactualaddsabtu;
	$scope.afaddsabtu = get_update_data_sync_view_add[0].afteractualaddsabtu;
	$scope.befaddahad = get_update_data_sync_view_add[0].beforeactualaddahad;
	$scope.afaddahad = get_update_data_sync_view_add[0].afteractualaddahad;

	$scope.sendbackupdate = function() {
		
		var day = ['ahad','senin','selasa','rabu','kamis','jumat','sabtu'];
		var date_current = new Date();
		var get_day = day[date_current.getDay()];
		
		var get_update_data = JSON.parse( window.localStorage.getItem('update_data_temp'));
		
		//fungsi kirim data yang akan diupdate ke server
		$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/update/sales.activity/',
					data: {
						'usn':name,'pw':pass ,'ids':get_update_data['activity_id'],'vals':get_update_data['data_val']
					},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					},		
				}
			).then(
				function successCallback(response){
					alert("sukses")
					window.localStorage.removeItem('update_data_temp'); //ls dihapus
					window.localStorage.removeItem('update_data_sync_view'); // ls dihapus

				//fungsi untuk get data dan kirim data update ke localstorage yang di tuju
					//ambil data dari before_actual yang akan di update
					$http(
						{
							method: 'POST',
							url: 'http://'+config['host']+':'+config['port']+'/openerp/before.actual.'+get_day+'/search/',
							data: {'usn':name,'pw':pass , 
								   'fields':[],
								   'domain':[
												['activity_id','=',id_activity_update[0]],
											],
								},

							headers: {
								'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
							  
							},
						}
					).then(
						function successCallback(response){
							var update_day_activity_before = JSON.parse( window.localStorage.getItem('sales_activity_before_actual_'+get_day));
							var data_update_before = response.data['Result'];

							//fungsi hapus data yang akan di update
							var newPushBefore = []
							angular.forEach(update_day_activity_before, function(val_hapusBefore,key_hapusBefore){
								if(val_hapusBefore['activity_id'][0] != id_activity_update[0]){
									newPushBefore.push(val_hapusBefore)
								}
							})

							// fungsi tambah data yang telah diupdate dan disimpan di local storage
							// tambahin dari response
							angular.forEach(data_update_before, function(val_tambahBefore,key_tambahBefore){
								newPushBefore.push(val_tambahBefore)
							})

							window.localStorage.setItem('sales_activity_before_actual_'+get_day, JSON.stringify(newPushBefore));
						},
						function errorCallback(response){
							console.log('gagal ambil data update before dari server')
						}
					)

					//ambil data dari after_actual yang akan di update			
					$http(
						{
							method: 'POST',
							url: 'http://'+config['host']+':'+config['port']+'/openerp/after.actual.'+get_day+'/search/',
							data: {'usn':name,'pw':pass , 
								   'fields':[],
									   'domain':[
												['activity_id','=',id_activity_update[0]],
											],

							},
							headers: {
								'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
							},
						
						}
					).then(
						function successCallback(response){
							var update_day_activity_after = JSON.parse( window.localStorage.getItem('sales_activity_after_actual_'+get_day));
							var data_update_after = response.data['Result'];
							
							//fungsi hapus data yang akan di update
							var newPushAfter = []
							angular.forEach(update_day_activity_after, function(val_hapusAfter,key_hapusAfter){
								if(val_hapusAfter['activity_id'][0] != id_activity_update[0]){
									newPushAfter.push(val_hapusAfter)
								}
							})

							// fungsi tambah data yang telah diupdate dan disimpan di local storage
							// tambahin dari response
							angular.forEach(data_update_after, function(val_tambahAfter,key_tambahAfter){
								newPushAfter.push(val_tambahAfter)
							})

							window.localStorage.setItem('sales_activity_after_actual_'+get_day, JSON.stringify(newPushAfter));
						},
						function errorCallback(response){
							console.log('gagal ambil data update after dari server')
						}
					)
						window.localStorage.removeItem('activity_id_update');
						$state.go('salesactivity')

				},
				function errorCallback(response){
					alert("Koneksi saat ini tidak tersedia, data anda akan kami simpan")
					$state.go('salesactivity');
				}
			)
	}

})
   
.controller('formdaymondayCtrl', function($scope,$stateParams,$http,$state,config) {
	
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;
	$scope.day = $stateParams.day;
	var hari = $stateParams.day;
	
	// get from localstorage
	var temp_current_data = JSON.parse(window.localStorage.getItem('temporary_data_create_plan'));

	//tampilin data yang sudah ada dan fungsi hapus data
	if (hari=='monday' && (temp_current_data[0]['monday_before'].length != 0 || temp_current_data[0]['monday_after'].length != 0)) {
		$scope.before_prev = temp_current_data[0]['monday_before']
		$scope.after_prev = temp_current_data[0]['monday_after']
    	
    	$scope.removeBefore = function(index) {
    	$scope.before_prev.splice(index, 1);
		};
    	$scope.removeAfter = function(index) {
    	$scope.after_prev.splice(index, 1);
		};

	}  
	else if (hari=='tuesday' && (temp_current_data[0]['tuesday_before'].length != 0 || temp_current_data[0]['tuesday_after'].length != 0)) {
		$scope.before_prev = temp_current_data[0]['tuesday_before']
		$scope.after_prev = temp_current_data[0]['tuesday_after']
	
    	$scope.removeBefore = function(index) {
    	$scope.before_prev.splice(index, 1);
		};
    	$scope.removeAfter = function(index) {
    	$scope.after_prev.splice(index, 1);
		};

	}  
	else if (hari=='wednesday' && (temp_current_data[0]['wednesday_before'].length != 0 || temp_current_data[0]['wednesday_after'].length != 0)) {
		$scope.before_prev = temp_current_data[0]['wednesday_before']
		$scope.after_prev = temp_current_data[0]['wednesday_after']
	
    	$scope.removeBefore = function(index) {
    	$scope.before_prev.splice(index, 1);
		};
    	$scope.removeAfter = function(index) {
    	$scope.after_prev.splice(index, 1);
		};

	} 
	else if (hari=='thursday' && (temp_current_data[0]['thursday_before'].length != 0 || temp_current_data[0]['thursday_after'].length != 0)) {
		$scope.before_prev = temp_current_data[0]['thursday_before']
		$scope.after_prev = temp_current_data[0]['thursday_after']

    	$scope.removeBefore = function(index) {
    	$scope.before_prev.splice(index, 1);
		};
    	$scope.removeAfter = function(index) {
    	$scope.after_prev.splice(index, 1);
		};	

	} 
	else if (hari=='friday' && (temp_current_data[0]['friday_before'].length != 0 || temp_current_data[0]['friday_after'].length != 0)) {
		$scope.before_prev = temp_current_data[0]['friday_before']
		$scope.after_prev = temp_current_data[0]['friday_after']
	
    	$scope.removeBefore = function(index) {
    	$scope.before_prev.splice(index, 1);
		};
    	$scope.removeAfter = function(index) {
    	$scope.after_prev.splice(index, 1);
		};
	} 
	//simpan data ke ls 

	$scope.backformactivity = function(){
		$state.go('formactivity');
	}

	$scope.savedata = function() {  

		if (hari == 'monday') {

			var monday_before = $scope.formBefore;
			var monday_after = $scope.formAfter;

			for (var mb = 0; mb < monday_before.length; mb++) {

				temp_current_data[0]['monday_before'].push(monday_before[mb])

			};
			for (var ma = 0; ma < monday_after.length; ma++) {

				temp_current_data[0]['monday_after'].push(monday_after[ma]) 

			};			
			// rewrite localStorage
			window.localStorage.setItem( 'temporary_data_create_plan', JSON.stringify(temp_current_data));
			window.alert('data telah disimpan')
			$state.go('formactivity')

		}
		else if (hari == 'tuesday') {

			var tuesday_before = $scope.formBefore;
			var tuesday_after = $scope.formAfter;
			
			for (var tb = 0; tb < tuesday_before.length; tb++) {

				temp_current_data[0]['tuesday_before'].push(tuesday_before[tb])

			};
			for (var ta = 0; ta < tuesday_after.length; ta++) {

				temp_current_data[0]['tuesday_after'].push(tuesday_after[ta]) 

			};			
			// rewrite localStorage
			window.localStorage.setItem( 'temporary_data_create_plan', JSON.stringify(temp_current_data));
			window.alert('data telah disimpan')
			$state.go('formactivity')
		}
		else if (hari == 'wednesday') {

			var wednesday_before = $scope.formBefore;
			var wednesday_after = $scope.formAfter;
			
			for (var wb = 0; wb < wednesday_before.length; wb++) {

				temp_current_data[0]['wednesday_before'].push(wednesday_before[wb])

			};
			for (var wa = 0; wa < wednesday_after.length; wa++) {

				temp_current_data[0]['wednesday_after'].push(wednesday_after[wa]) 

			};			
			// rewrite localStorage
			window.localStorage.setItem( 'temporary_data_create_plan', JSON.stringify(temp_current_data));
			window.alert('data telah disimpan')
			$state.go('formactivity')
		}
		else if (hari == 'thursday') {

			var thursday_before = $scope.formBefore;
			var thursday_after = $scope.formAfter;
			
			for (var thb = 0; thb < thursday_before.length; thb++) {

				temp_current_data[0]['thursday_before'].push(thursday_before[thb])

			};
			for (var tha = 0; tha < thursday_after.length; tha++) {

				temp_current_data[0]['thursday_after'].push(thursday_after[tha]) 

			};			
			// rewrite localStorage
			window.localStorage.setItem( 'temporary_data_create_plan', JSON.stringify(temp_current_data));
			window.alert('data telah disimpan')
			$state.go('formactivity')
		}
		else if (hari == 'friday') {

			var friday_before = $scope.formBefore;
			var friday_after = $scope.formAfter;
			
			for (var fb = 0; fb < friday_before.length; fb++) {

				temp_current_data[0]['friday_before'].push(friday_before[fb])

			};
			for (var fa = 0; fa < friday_after.length; fa++) {

				temp_current_data[0]['friday_after'].push(friday_after[fa]) 

			};			
			// rewrite localStorage
			window.localStorage.setItem( 'temporary_data_create_plan', JSON.stringify(temp_current_data));
			window.alert('data telah disimpan')
			$state.go('formactivity')
		}

	}

	//fungsi tambah form
	$scope.formBefore = [];
	$scope.formAfter = [];

	$scope.tambahformBefore = function() {
		var newItemNo = $scope.formBefore.length+1;
	    $scope.formBefore.push({'id':'before_plan'+newItemNo});
	};  
	$scope.tambahformAfter = function() {
		var newItemNo = $scope.formAfter.length+1;
	    $scope.formAfter.push({'id':'after_plan'+newItemNo});
	};
	// fungsi untuk nyari data
	$scope.getMatches = function(searchText){
		var res_matched = [];
		
		// cari via ajax
		res_matched = $http
	  	(
			{
				method: 'POST',
				url: 'http://'+config['host']+':'+config['port']+'/openerp/res.partner/search/',
				data: {
				'domain':[
							['is_company','=','false'],
							['customer','=','true'],
							['display_name','ilike',searchText]
						],
				'usn':name,'pw':pass ,'fields':['display_name']},
				headers: {
					'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
				  
				},
			}
		).then(function(response){
			// if success
			return response.data.Result
		},
		function(response){
			return []
		})
		
		return res_matched
	}
})

.controller('previewcreateplanCtrl', function($scope,$http,$state,config) {

	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;
	temp_current_data = JSON.parse(window.localStorage.getItem('temporary_data_create_plan'));

	$scope.pic = temp_current_data[0].pic;
	$scope.begin = temp_current_data[0].begin;
	$scope.end = temp_current_data[0].end;
	$scope.bpp_senin = temp_current_data[0].monday_before;
	$scope.app_senin = temp_current_data[0].monday_after;
	$scope.bpp_selasa = temp_current_data[0].tuesday_before;
	$scope.app_selasa = temp_current_data[0].tuesday_after;
	$scope.bpp_rabu = temp_current_data[0].wednesday_before;
	$scope.app_rabu = temp_current_data[0].wednesday_after;
	$scope.bpp_kamis = temp_current_data[0].thursday_before;
	$scope.app_kamis = temp_current_data[0].thursday_after;
	$scope.bpp_jumat = temp_current_data[0].friday_before;
	$scope.app_jumat = temp_current_data[0].friday_after;
	
	$scope.sendData = function() {
		console.log('clicked')
		temp_current_data = JSON.parse(window.localStorage.getItem('temporary_data_create_plan'));

		var send_data = [{
							'user_id' : temp_current_data[0].id_user,
							'begin': temp_current_data[0].begin,
							'end' : temp_current_data[0].end,
							'beforeplansenin':[],
							'afterplansenin':[],
							'beforeplanselasa':[],
							'afterplanselasa':[],
							'beforeplanrabu':[],
							'afterplanrabu':[],
							'beforeplankamis':[],
							'afterplankamis':[],
							'beforeplanjumat':[],
							'afterplanjumat':[],
						}];

		for (var tmb = 0; tmb < (temp_current_data[0].monday_before).length; tmb++) {

					send_data[0]['beforeplansenin'].push([0,0,{'partner_id':(temp_current_data[0].monday_before)[tmb].customer.id,
						'location':(temp_current_data[0].monday_before)[tmb].location,
						'name':(temp_current_data[0].monday_before)[tmb].objective}])
		};
		for (var tma = 0; tma < (temp_current_data[0].monday_after).length; tma++) {

					send_data[0]['afterplansenin'].push([0,0,{'partner_id':(temp_current_data[0].monday_after)[tma].customer.id,
						'location':(temp_current_data[0].monday_after)[tma].location,
						'name':(temp_current_data[0].monday_after)[tma].objective}])
		};
		for (var ttb = 0; ttb < (temp_current_data[0].tuesday_before).length; ttb++) {

					send_data[0]['beforeplanselasa'].push([0,0,{'partner_id':(temp_current_data[0].tuesday_before)[ttb].customer.id,
						'location':(temp_current_data[0].tuesday_before)[ttb].location,
						'name':(temp_current_data[0].tuesday_before)[ttb].objective}])
		};
		for (var tta = 0; tta < (temp_current_data[0].tuesday_after).length; tta++) {

					send_data[0]['afterplanselasa'].push([0,0,{'partner_id':(temp_current_data[0].tuesday_after)[tta].customer.id,
						'location':(temp_current_data[0].tuesday_after)[tta].location,
						'name':(temp_current_data[0].tuesday_after)[tta].objective}])
		};
		for (var twb = 0; twb < (temp_current_data[0].wednesday_before).length; twb++) {

					send_data[0]['beforeplanrabu'].push([0,0,{'partner_id':(temp_current_data[0].wednesday_before)[twb].customer.id,
						'location':(temp_current_data[0].wednesday_before)[twb].location,
						'name':(temp_current_data[0].wednesday_before)[twb].objective}])
		};
		for (var twa = 0; twa < (temp_current_data[0].wednesday_after).length; twa++) {

					send_data[0]['afterplanrabu'].push([0,0,{'partner_id':(temp_current_data[0].wednesday_after)[twa].customer.id,
						'location':(temp_current_data[0].wednesday_after)[twa].location,
						'name':(temp_current_data[0].wednesday_after)[twa].objective}])
		};
		for (var tthb = 0; tthb < (temp_current_data[0].thursday_before).length; tthb++) {

					send_data[0]['beforeplankamis'].push([0,0,{'partner_id':(temp_current_data[0].thursday_before)[tthb].customer.id,
						'location':(temp_current_data[0].thursday_before)[tthb].location,
						'name':(temp_current_data[0].thursday_before)[tthb].objective}])
		};
		for (var ttha = 0; ttha < (temp_current_data[0].thursday_after).length; ttha++) {

					send_data[0]['afterplankamis'].push([0,0,{'partner_id':(temp_current_data[0].thursday_after)[ttha].customer.id,
						'location':(temp_current_data[0].thursday_after)[ttha].location,
						'name':(temp_current_data[0].thursday_after)[ttha].objective}])
		};
		for (var tfb = 0; tfb < (temp_current_data[0].friday_before).length; tfb++) {

					send_data[0]['beforeplanjumat'].push([0,0,{'partner_id':(temp_current_data[0].friday_before)[tfb].customer.id,
						'location':(temp_current_data[0].friday_before)[tfb].location,
						'name':(temp_current_data[0].friday_before)[tfb].objective}])
		};
		for (var tfa = 0; tfa < (temp_current_data[0].friday_after).length; tfa++) {

					send_data[0]['afterplanjumat'].push([0,0,{'partner_id':(temp_current_data[0].friday_after)[tfa].customer.id,
						'location':(temp_current_data[0].friday_after)[tfa].location,
						'name':(temp_current_data[0].friday_after)[tfa].objective}])
		};

		console.log(send_data,'ini datanya')

		$http(
			{
				method: 'POST',
				url: 'http://'+config['host']+':'+config['port']+'/openerp/createsalesplan/',
				data: {
					'usn':name,'pw':pass ,'vals':send_data[0]},
				headers: {
					'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
				},		
			}
		).then(
			function successCallback(response){
				alert("sukses")
				window.localStorage.removeItem('temporary_data_create_plan');
				$state.go('salesactivity')
			},
			function errorCallback(response){
				alert("gagal")
				// $window.localStorage.clear();
				$state.go('salesactivity');
			}
		)			
	}



})

.controller('salestimelineCtrl', function($scope,$http,$state,$ionicLoading,$window,$filter,$ionicPopup,$ionicModal,config) {
	$ionicLoading.show(
		{	 
		    content: 'Loading',
		    animation: 'fade-in',
		    showBackdrop: true,
		    maxWidth: 200,
		    showDelay: 0

  		}
  	);


	

	var timeline = JSON.parse(window.localStorage.getItem("timeline2")); //data to fetch in view
	var reloadSalesTm =function(data){
		console.log('called')
		$scope.sales_tm = data
	}
	var updateSalesTm=function(data){
		for (var i = 0; i < data.length; i++) {
			$scope.sales_tm.push(data[i])
		};
	}

	var today = new Date()
	var yesterday = new Date()
	yesterday.setDate(yesterday.getDate()-1);
	today = $filter('date')(today, "yyyy-MM-dd");
	yesterday = $filter('date')(yesterday, "yyyy-MM-dd");
	console.log(today,yesterday)
	$scope.date = new Date();

	
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;
	$scope.doRefresh = function(){
		var timeline = function(data){
		var manager_group = data[0]['in_group_8']
		var sales_supra_group = data[0]['in_group_63']
		var direksi_group = data[0]['in_group_55']
		var data_timeline_group = function(condition){

			$http
		  	(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/salestimeline/AllData/',
					data: {
							'usn':name,
							'pw':pass,
							"params":{
								// "fields":'*',
								// "table":"sales_activity_plan",
								// 'AndOr':[],
								'condition':condition
								// "limit":100,
								// 'offset':0,
								// "order":"order by year_p DESC, week_no DESC, dow DESC, user_id, daylight, not_planned_actual"
							}
					},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
					
				
				}
			).then(
				function successCallback(response){
					console.log('success isi storage kosong dari server');
					console.log(response)
					window.localStorage.setItem('timeline2',JSON.stringify(response.data.data))
					reloadSalesTm(response.data.data)

					$scope.$broadcast('scroll.refreshComplete');
					if(response.data.data.length==0){
						alertPopup = $ionicPopup.alert({
						title: 'Warning',
						template: 'Hari ini dan kemarin belum ada data!!! Tekan tombol "Load" Untuk melihat data paling baru!!'
					});
					}
				},
				function errorCallback(response){
					$scope.$broadcast('scroll.refreshComplete');
					console.log(response)
					reloadSalesTm(timeline)
					console.log('erroor data kosong');
			
				}
			)
		}

		if (manager_group || sales_supra_group){
			// console.log(data[0]['kelompok_id'][0],"ini")
			var group_sales_line =function(data){
				// console.log(data,"sjadhkjsghadsgahudasgh")
		 			$http(
						{
							method: 'POST',
							url: 'http://'+config['host']+':'+config['port']+'/openerp/group.sales.line/ids/',
							data: {'usn':name,
								   'pw':pass,
								   // 'domain':[['login','ilike',atob(name)]] ,
								   // 'fields':['in_group_8','in_group_63','in_group_55','kelompok_id']},
								   'ids':data,
								   'fields':[]
								},
							headers: {
								'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
							  
							},
						
						}
					).then(
						function successCallback(response){
							// console.log(response.data["Result"],"oasodossjd")
							id_group_sales_line = []
							for (i=0;i<response.data["Result"].length;i++){
								
								id_group_sales_line.push(response.data["Result"][i]['name'][0])
							}
			   				console.log(id_group_sales_line)
			   				var condition ={"the_date":[today,yesterday],"user_id":id_group_sales_line}
							data_timeline_group(condition)
						},
						function errorCallback(response){
							$scope.$broadcast('scroll.refreshComplete');
							console.log(response)
							reloadSalesTm(timeline)
							console.log('erroor data kosong');
						}
					)
		 	}
			$http
		  	(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/group.sales/ids/',
					data: {
							'usn':name,
							'pw':pass,
							'ids':[data[0]['kelompok_id'][0]],
							'fields':['users_line'],
							
					},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
					
				
				}
			).then(
				function successCallback(response){
				console.log((response.data['Result'][0])['users_line'],"disini")
				group_sales_line((response.data['Result'][0])['users_line'])
				},
				function errorCallback(response){
					$scope.$broadcast('scroll.refreshComplete');
					console.log(response)
					reloadSalesTm(timeline)
					console.log('erroor data kosong');
				}
			)
			
		}
		else if (direksi_group){
			var condition ={"the_date":[today,yesterday]}
			data_timeline_group(condition)
		}
		else{
			var condition={"the_date":false}
			data_timeline_group(condition)
		}

			
	}



	$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/res.users/search/',
					data: {'usn':name,
						   'pw':pass,
						   'domain':[['login','ilike',atob(name)]] ,
						   'fields':['in_group_8','in_group_63','in_group_55','kelompok_id']},

					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
				
				}
			).then(
				function successCallback(response){
					console.log(response.data["Result"],"iniii")
					timeline(response.data["Result"])
	   
				},
				function errorCallback(response){
					$scope.$broadcast('scroll.refreshComplete');
					console.log(response)
					reloadSalesTm(timeline)
					console.log('erroor data kosong');
				}
			)

	}

	var timeline = function(data){
		var manager_group = data[0]['in_group_8']
		var sales_supra_group = data[0]['in_group_63']
		var direksi_group = data[0]['in_group_55']
		var data_timeline_group = function(condition){

			$http
		  	(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/salestimeline/AllData/',
					data: {
							'usn':name,
							'pw':pass,
							"params":{
								// "fields":'*',
								// "table":"sales_activity_plan",
								// 'AndOr':[],
								'condition':condition
								// "limit":100,
								// 'offset':0,
								// "order":"order by year_p DESC, week_no DESC, dow DESC, user_id, daylight, not_planned_actual"
							}
					},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
					
				
				}
			).then(
				function successCallback(response){
					console.log('success isi storage kosong dari server');
					console.log(response)
					window.localStorage.setItem('timeline2',JSON.stringify(response.data.data))
					reloadSalesTm(response.data.data)

					$ionicLoading.hide();
					if(response.data.data.length==0){
						alertPopup = $ionicPopup.alert({
						title: 'Warning',
						template: 'Hari ini dan kemarin belum ada data!!! Tekan tombol "Load" Untuk melihat data paling baru!!'
					});
					}
				},
				function errorCallback(response){
					$ionicLoading.hide();
					// console.log(response)
					reloadSalesTm(timeline)
					// console.log('erroor data kosong');
			
				}
			)
		}

		if (manager_group || sales_supra_group){
			// console.log(data[0]['kelompok_id'][0],"ini")
			var group_sales_line =function(data){
				// console.log(data,"sjadhkjsghadsgahudasgh")
		 			$http(
						{
							method: 'POST',
							url: 'http://'+config['host']+':'+config['port']+'/openerp/group.sales.line/ids/',
							data: {'usn':name,
								   'pw':pass,
								   // 'domain':[['login','ilike',atob(name)]] ,
								   // 'fields':['in_group_8','in_group_63','in_group_55','kelompok_id']},
								   'ids':data,
								   'fields':[]
								},
							headers: {
								'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
							  
							},
						
						}
					).then(
						function successCallback(response){
							// console.log(response.data["Result"],"oasodossjd")
							id_group_sales_line = []
							for (i=0;i<response.data["Result"].length;i++){
								
								id_group_sales_line.push(response.data["Result"][i]['name'][0])
							}
			   				console.log(id_group_sales_line)
			   				var condition ={"the_date":[today,yesterday],"user_id":id_group_sales_line}
							data_timeline_group(condition)
						},
						function errorCallback(response){
							
						}
					)
		 	}
			$http
		  	(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/group.sales/ids/',
					data: {
							'usn':name,
							'pw':pass,
							'ids':[data[0]['kelompok_id'][0]],
							// 'domain':[['login','ilike',atob(name)]] ,
							// 'domain':[['kelompok_id','=',8]] ,
							'fields':['users_line'],
							
					},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
					
				
				}
			).then(
				function successCallback(response){
				console.log((response.data['Result'][0])['users_line'],"disini")
				group_sales_line((response.data['Result'][0])['users_line'])
				},
				function errorCallback(response){
				$ionicLoading.hide();
					// console.log(response)
					reloadSalesTm(timeline)
					// console.log('erroor data kosong');
				}
			)
			
		}
		else if (direksi_group){
			var condition ={"the_date":[today,yesterday]}
			data_timeline_group(condition)
		}
		else{
			var condition={"the_date":false}
			data_timeline_group(condition)
		}

			
	}



	$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/res.users/search/',
					data: {'usn':name,
						   'pw':pass,
						   'domain':[['login','ilike',atob(name)]] ,
						   'fields':['in_group_8','in_group_63','in_group_55','kelompok_id']},

					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
				
				}
			).then(
				function successCallback(response){
					console.log(response.data["Result"],"iniii")
					timeline(response.data["Result"])
	   
				},
				function errorCallback(response){
					$ionicLoading.hide();
					// console.log(response)
					reloadSalesTm(timeline)
				}
			)


	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope,
		hardwareBackButtonClose: false
	  }).then(function(modal) {
	  	console.log(modal)
	    $scope.modal = modal;
	  });
	 $scope.openModal = function(tm) {   
          $scope.user = tm;
          $scope.modal.show();
        };
 
	$scope.limit = 20;
	// console.log(timeline,"datanya")
	var limit_data = 0
	var offset_data = -20

	
	

	$scope.loadMore = function () {

		$scope.limit += 20; 


		if ($scope.limit >= $scope.sales_tm.length ){
			var load_timeline = function(data){
				limit_data+=20
				offset_data+=20
				var manager_group = data[0]['in_group_8']
				var sales_supra_group = data[0]['in_group_63']
				var direksi_group = data[0]['in_group_55']
				var load_timeline_group =function(condition){
					console.log(condition,"ini kondisinya")
				 	$http
				  	(
						{
							method: 'POST',
							url: 'http://'+config['host']+':'+config['port']+'/openerp/salestimeline/GetUpdate/',
							data: {
									'usn':name,
									'pw':pass,
									"params":{
										// "fields":'*',
										// "table":"sales_activity_plan",
										// 'AndOr':[],
										'condition':condition,
										"limit":limit_data,
										'offset':offset_data,
										// "order":"order by year_p DESC, week_no DESC, dow DESC, user_id, daylight, not_planned_actual"
									}
							},
							headers: {
								'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
							  
							},
							
						
						}
						).then(
							function successCallback(response){
								console.log('success isi storage kosong dari server');
								console.log(response)
								
								updateSalesTm(response.data.data)

								$ionicLoading.hide();
							},
							function errorCallback(response){
								$ionicLoading.hide();
								alertPopup = $ionicPopup.alert({
								title: 'Warning',
								template: 'Tidak ada koneksi internet!!'
							});
								
							}
						)
				 }

				 if(manager_group || sales_supra_group){
				 	var group_sales_line_load =function(data){
					// console.log(data,"conditionnya")
			 			$http(
							{
								method: 'POST',
								url: 'http://'+config['host']+':'+config['port']+'/openerp/group.sales.line/ids/',
								data: {'usn':name,
									   'pw':pass,
									   'ids':data,
									   'fields':[]
									},
								headers: {
									'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
								  
								},
							
							}
						).then(
							function successCallback(response){
								// console.log(response.data["Result"],"oasodossjd")
								id_group_sales_line = []
								for (i=0;i<response.data["Result"].length;i++){
									
									id_group_sales_line.push(response.data["Result"][i]['name'][0])
								}
				   				// console.log(id_group_sales_line)
				   				var condition ={"the_date__lt":yesterday,"user_id":id_group_sales_line}
								load_timeline_group(condition)
							},
							function errorCallback(response){
								
							}
						)
			 		}
			 		$http
		  			(
					{
						method: 'POST',
						url: 'http://'+config['host']+':'+config['port']+'/openerp/group.sales/ids/',
						data: {
							'usn':name,
							'pw':pass,
							'ids':[data[0]['kelompok_id'][0]],
							// 'domain':[['login','ilike',atob(name)]] ,
							// 'domain':[['kelompok_id','=',8]] ,
							'fields':['users_line'],
							
					},
					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
					
				
					}
				).then(
					function successCallback(response){
					// console.log((response.data['Result'][0])['users_line'],"disini")
					group_sales_line_load((response.data['Result'][0])['users_line'])
					},
					function errorCallback(response){
				
					}
					)
				 }
				 else if (direksi_group){
				 	var condition = {"the_date__lt":yesterday}
				 	load_timeline_group(condition)
				 }
				 else{
				 	var condition = {"the_date__lt":false}
				 	load_timeline_group(condition)
				 }
				  
			}




			$http(
				{
					method: 'POST',
					url: 'http://'+config['host']+':'+config['port']+'/openerp/res.users/search/',
					data: {'usn':name,
						   'pw':pass,
						   'domain':[['login','ilike',atob(name)]] ,
						   'fields':['in_group_8','in_group_63','in_group_55','kelompok_id']},

					headers: {
						'Authorization': 'Basic ' + "cmV6YTpzdXByYWJha3Rp",
					  
					},
				
				}
			).then(
				function successCallback(response){
					// console.log(response.data["Result"],"iniii")
					// var res_users =  response.data["Result"]
					// console.log(manager_group)
					load_timeline(response.data["Result"])
	   
				},
				function errorCallback(response){
					
				}
			)

		
			}

	};
	// $scope.loadMore();
	$scope.colortext= {
        "color" : "red",
    }

  
	reloadSalesTm(timeline)
})


.controller('menutoogleCtrl', function($scope,$http,$state,config,menu) { 
	var name =(window.localStorage.getItem("dhaussjauhxdjuzlgzuglscfasshdausdjfkjzasd")) ;
	var pass =(window.localStorage.getItem("uhadlfdlfgghfrejajkfdfhzjudfakjhbfkjagfjufug")) ;
	$scope.logOut = function() {
		// $window.localStorage.clear();
		// $state.go('menulogin');
		// window.location.reload();
      var confirmPopup = $ionicPopup.confirm({
         title: 'Log Out',
         template: 'Apa Anda Yakin?'
      });

      confirmPopup.then(function(res) {
         if(res) {
			$window.localStorage.clear();
			$state.go('menulogin');
			window.location.reload();
         } else {
            console.log('batal');
         }
      });

	}

	// console.log(menu)
	$scope.myHTML = "<li class='active has-sub'><a href='#'><span>SALES</span></a> <ul> <li class='has-sub'><a href='#'><span>SALES</span></a> <ul> <li><a href='#'><span>Quotation</span></a></li> <li><a href='#' menu-close=\'\'><span>Sales Order </span></a></li> </ul> </li> <li class='has-sub'><a href='#'><span>MATERIAL REQUEST</span></a> <ul> <li><a href='#' menu-close=\'\'><span>Internal Move Request</span></a></li> <li><a href='#' menu-close=\'\'><span>Internal Move</span></a></li> </ul> </li> <li class='has-sub'><a href='#'><span>PRODUCT</span></a> <ul> <li><a href='#' menu-close=\'\'><span>Product</span></a></li> </ul> </li> <li class='has-sub'><a href='#'><span>ACTIVITY</span></a> <ul> <li><a menu-close=\'\' class='menu-link' href='#/form-activity'><span>Create Activity</span></a></li> <li><a href='#/sales-activity' menu-close=\'\'><span>Sales Activity </span></a></li> <li><a href='#' menu-close=\'\'><span>Weekly Status</span></a></li> <li><a href='#/salestimeline' menu-close=\'\'><span>Activity Timeline</span></a></li> </ul> </li> </ul> </li> <li class='active has-sub'><a href='#'><span>HUMAN RESOURCES</span></a></li> <li class='active has-sub'><a href='#'><span>REPORTING</span></a></li> <li class='active has-sub'><a href='#'><span>MESSAGING</span></a></li> <li class='active has-sub' ng-click='logOut()'><a><span>LOG OUT</span></a></li> "


})