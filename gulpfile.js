const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const plumber = require("gulp-plumber");
const livereload = require("gulp-livereload");
const sass = require("gulp-sass");
const babel = require("gulp-babel");

gulp.task("sass", () => {
  gulp
    .src("./public/src/css/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest("./public/css"))
    .pipe(livereload());
});

gulp.task("js", () => {
  gulp
    .src("./public/src/js/*.js")
    .pipe(babel({ presets: ["env"] }))
    .pipe(gulp.dest("./public/js"))
    .pipe(livereload());
});

gulp.task("watch", () => {
  gulp.watch("./public/src/css/*.scss", ["sass"]);
  gulp.watch("./public/src/js/*.js", ["js"]);
});

gulp.task("develop", () => {
  livereload.listen();
  nodemon({
    script: "bin/www",
    ext: "js handlebars coffee",
    stdout: false
  }).on("readable", function() {
    this.stdout.on("data", chunk => {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task("default", ["sass", "js", "develop", "watch"]);
