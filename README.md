# AngularJS + VanillaCSS CRUD
Code documentation: http://talitapagani.com/s2it-test-dev/docs/

This repository was created as a technical test proposed by S2IT engineers during a recruitment proccess.
It's a CRUD single-page application built with AngularJS and VanillaCSS (in other words, with no CSS frameworks). The application is a to-do list, where the user can add, view, update or delete tasks. The data is saved in the LocalStorage. The layout is responsive to be used in desktop, tablet and smartphone.

## File structure
```
|-- assets
|--|-- css
|--|-- img
|--|-- js
|-- docs
|-- lib
```

### Root directory
The root directory contains the single HTML file of this application.

### Assets
This path stores the CSS, Images and Scripts developed for the application. If external CSS or JavaScript is used, it must the stored in the `lib` folder instead.

### Docs
Contains the documentation pages for the JavaScript code. You can access the documentation at http://talitapagani.com/s2it-test-dev/docs/

### Lib
Contains external libraries and frameworks in CSS or JavaScript.

## Dependencies
This application need to run in a web server. In your local machine, you can use WAMP, XAMPP, etc. Also, it's recommended that you install JSDoc:
```
npm install jsdoc
```