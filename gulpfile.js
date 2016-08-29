var gulp = require('gulp');
var uglify = require("gulp-uglify"); //js压缩
var pump = require("pump");
var less = require('gulp-less');
var minify = require('gulp-cssmin'); //css压缩
var imagemin = require('gulp-imagemin'); //图片压缩
var htmlmin = require('gulp-htmlmin');//html压缩
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');//
var plumber = require('gulp-plumber');//



gulp.task('compressLess',function(){
    //除了reset.less和test.less（**匹配src/less的0个或多个子文件夹）
    var steam = gulp.src(['./public/css/*.less','!src/less/**/{rest,test}.less'])
        .pipe(less())
        .pipe(minify()) //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        //当less有各种引入关系时，编译后不容易找到对应less文件，所以需要生成sourcemap文件，方便修改
        //确保本地已安装gulp-sourcemaps [cnpm install gulp-sourcemaps --save-dev]
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/public/css'));
    return steam;
});
gulp.task("compressJs",function(cb){
   pump([
       gulp.src(['./public/js/*.js','!./gulpfile.js']),
       uglify(),
       gulp.dest('./dist/public/js')
   ],cb)
});

gulp.task("compressImages",function(){
    gulp.src('./public/images/*')
        //当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
        .pipe(plumber({errorHandler: notify.onError('Error:<%= error.message %>')}))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/public/images'))
});

gulp.task("compressHtml",function(){
    gulp.src('./views/*.html')
        .pipe(htmlmin({collapseWhitespace: true,minifyCSS:true,minifyJS:true}))
        .pipe(gulp.dest('dist/views'))
});


gulp.task('default',['compressLess','compressJs','compressImages','compressHtml']);


//自动编译less
gulp.task('testWatch',function(){
    gulp.watch('public/**/*.less',['compressLess']); //当所有less文件发生改变时，调用compressLess任务
    gulp.watch('public/**/*.js',['compressJs']);
    gulp.watch('public/images/*',['compressImages']);
    gulp.watch('views/*.html',['compressHtml']);
});