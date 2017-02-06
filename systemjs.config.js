(function (global) {
  var LARAVEL_BASE_URL = "public/";
  if(typeof window !== 'undefined'){
    LARAVEL_BASE_URL = window['__LARAVEL_VARS'].base_url;
  }

  System.config({
    paths: {
      'npm:': LARAVEL_BASE_URL + 'node_modules/'
    },
    map: {
      app: LARAVEL_BASE_URL + 'js/app',
      react: 'npm:react/dist',
      'react-dom':'npm:react-dom/dist',
      'react-router':'npm:react-router/umd/ReactRouter.min.js',
      rxjs: 'npm:rxjs',
      classnames: 'npm:classnames',
      moment: 'npm:moment'
    },

    packages: {
      app: { main: './main.js', defaultExtension: 'js' },
      react: { main: './react.js', defaultExtension: 'js' },
      'react-dom': { main: './react-dom.js', defaultExtension: 'js' },
      rxjs: { defaultExtension: 'js' },
      classnames: { main: './index.js', defaultExtension: 'js' },
      moment: { main: './moment.js', defaultExtension: 'js' }
    }
  });
})(this);
