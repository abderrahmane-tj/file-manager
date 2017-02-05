<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>File Manager</title>
  <link rel="stylesheet" href="{{ url('/') }}/css/app.css">
</head>
<body>
<div id="root"></div>
@if(env('APP_ENV') === 'local')
<script>
  var LARAVEL_BASE_URL = "{{ url('/') }}/";
</script>
<script src="{{ url('/') }}/js/system.js"></script>
<script>System.import('app').catch(function(err){ console.error(err); });</script>
@else
<script src="{{ url('/') }}/js/app.js"></script>
@endif
</body>
</html>