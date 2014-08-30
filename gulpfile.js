var gulp = require("gulp");
var jshint = require("gulp-jshint");
var browserify = require("gulp-browserify");

// var traceur = require("gulp-traceur");

// gulp.task("default", function () {
//   return gulp.src("src/kraken.js")
//     .pipe(traceur({sourceMap: true}))
//     .pipe(gulp.dest("dist"));
// });

// Basic usage
gulp.task("default", function() {
  gulp.src("src/kraken.js")
    .pipe(browserify({
      standalone: "Kraken",
    }))
    .pipe(gulp.dest("dist"))
});

gulp.task("lint", function() {
  gulp.src("./src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
