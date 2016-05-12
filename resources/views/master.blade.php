<!doctype html>
<html lang="pt-br" ng-app="nQueue">
<head>
    <meta charset="UTF-8">
    <title page-title></title>
    <!-- [Styles] -->
    <link rel="stylesheet" type="text/css" href="{!! asset('vendor/components-font-awesome/css/font-awesome.min.css')  !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vendor/bootstrap/dist/css/bootstrap.min.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('assets/css/animate.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('assets/css/style.css') !!}" id="loadBefore">
</head>
<body ng-controller="MainCtrl as Main"
      class="@{{ $state.current.data.specialClass }} mini-navbar">

<!--[Load View] -->
<div ui-view></div>
<!--[End Load View] -->

<!-- [Scritps] -->
<script src="http://code.jquery.com/jquery-2.1.1.js "></script>
<script src="{!! asset('assets/js/plugins/jquery-ui/jquery-ui.js') !!}"></script>
<script src="{!! asset('assets/js/plugins/metisMenu/jquery.metisMenu.js') !!}"></script>
<script src="{!! asset('assets/js/plugins/slimscroll/jquery.slimscroll.min.js') !!}"></script>
<script src="{!! asset('assets/js/plugins/pace/pace.min.js') !!}"></script>
<script src="{!! asset('vendor/moment/min/moment.min.js') !!}"></script>
<script src="{!! asset('vendor/moment/locale/pt-br.js') !!}"></script>
<script src="{!! asset('assets/js/nqueue.js') !!}"></script>

<!-- [AngularJS] -->
<script src="{!! asset('vendor/angular/angular.min.js') !!}"></script>
<script src="{{ asset('vendor/oclazyload/dist/ocLazyLoad.min.js') }}"></script>
<script src="{{ asset('vendor/satellizer/satellizer.min.js')}}"></script>
<script src="{{ asset('vendor/angular-ui-router/release/angular-ui-router.min.js') }}"></script>
<script src="{{ asset('assets/js/plugins/bootstrap-angularjs/ui-bootstrap-tpls-0.12.0.min.js') }}"></script>
<script src="{{ asset('vendor/angular-socket-io/socket.min.js') }}"></script>
<script src="{{ asset('assets/js/plugins/angular-moment/angular-moment.js') }}"></script>
<!-- [Application AngularJS]-->
<script src="{!! asset('app/nQueue.js') !!}"></script>
<script>angular.module('nQueue').constant("CSRF_TOKEN", '{!! csrf_token() !!}');</script>

</body>
</html>