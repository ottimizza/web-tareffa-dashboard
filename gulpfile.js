var gulp = require("gulp");
var gzip = require("gulp-gzip");

gulp.task("compress", function() {
  return gulp
    .src(["./dist/web-tareffa-dashboard/*.*"])
    .pipe(gzip())
    .pipe(gulp.dest("./dist/web-tareffa-dashboard"));
});
