var gulp = require('gulp');
var uglify = require("gulp-uglify"); //jsѹ��
var pump = require("pump");
var less = require('gulp-less');
var minify = require('gulp-cssmin'); //cssѹ��
var imagemin = require('gulp-imagemin'); //ͼƬѹ��
var htmlmin = require('gulp-htmlmin');//htmlѹ��
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');//
var plumber = require('gulp-plumber');//



gulp.task('compressLess',function(){
    //����reset.less��test.less��**ƥ��src/less��0���������ļ��У�
    var steam = gulp.src(['./public/css/*.less','!src/less/**/{rest,test}.less'])
        .pipe(less())
        .pipe(minify()) //����IE7������������compatibility���� .pipe(cssmin({compatibility: 'ie7'}))
        //��less�и��������ϵʱ������������ҵ���Ӧless�ļ���������Ҫ����sourcemap�ļ��������޸�
        //ȷ�������Ѱ�װgulp-sourcemaps [cnpm install gulp-sourcemaps --save-dev]
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
        //�������쳣ʱ��ʾ���� ȷ�����ذ�װgulp-notify��gulp-plumber
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


//�Զ�����less
gulp.task('testWatch',function(){
    gulp.watch('public/**/*.less',['compressLess']); //������less�ļ������ı�ʱ������compressLess����
    gulp.watch('public/**/*.js',['compressJs']);
    gulp.watch('public/images/*',['compressImages']);
    gulp.watch('views/*.html',['compressHtml']);
});