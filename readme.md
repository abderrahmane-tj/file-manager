## FileManager (Eveloved)

The file manager that will make it easy for you to browse your >20years worth of
files.

Stay tuned for more.


## Installation

```
$ composer install
$ npm install
```

To play around in dev mode, specify `APP_ENV=local` and then copy static assets
with Gulp and run gulp
````
$ gulp lazy-copy
$ gulp
````

To build the production version, specify `APP_ENV=production` and then run
````
$ gulp production
````

---
NB: In bothe scenarios, it is is very important to specify `APP_URL` for it is
intensively used in the front-end.