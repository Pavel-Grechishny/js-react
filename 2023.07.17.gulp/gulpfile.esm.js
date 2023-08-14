'use strict'

// импорт
import {src, dest, parallel, series, watch} from 'gulp'; // импорт по именам
import pug from 'gulp-pug'; // импорт по умолчанию
import stylus from 'gulp-stylus';
import clean from 'gulp-clean';
import nop from 'gulp-nop';
import terser from 'gulp-terser';
import bs from 'browser-sync';
// import autoPrefixer from 'gulp-autoprefixer';


const SRC = './src/';
const DEST = './_dest/';
const JS_SOURCE = SRC + '*.js';
const PUG_SOURCE = SRC + '*.pug';
const STYL_SOURCE = SRC + '*.styl';
const browserSync = bs.create();

let minification = false;




// синаксис в формате стрелочной функции
// перенос файлов pug из src в _dest
export const html = () => 
    src([PUG_SOURCE, '!./src/_includes/**/*.*']) // ! - исключение
        .pipe(pug({pretty: !minification})) // pretty:true - не минимизирует файл
        .pipe(dest(DEST));

// перенос файлов styl-css из src в _dest
export const css = () => 
    src(SRC + '*.styl', {sourcemaps: !minification})
        .pipe(stylus({compress: minification}))
        .pipe(dest(DEST, {sourcemaps: true}));

// перенос файлов js из src в _dest
export function js() {
    return src(SRC + '*.js', {sourcemaps: !minification}) // * - берем все js файлы
        .pipe(minification ? terser() : nop())
        .pipe(dest(DEST, {sourcemaps: true}))
};

// ===================================================
// MERGE PROJECT

const BSreload = async () => {
    browserSync.reload();
}

const serv = cb => {
    browserSync.init({server:{baseDir:DEST}});
    watch(DEST + '**/*.*', BSreload);
    watch(PUG_SOURCE, html);
    watch(STYL_SOURCE, css);
    watch(JS_SOURCE, js);
    cb();
}

export const cleanDir = () =>
    src(DEST + '**/*.*', {read:true}) // **/*.* все файлы из папки // read:true - не читать
        .pipe(clean());

// const upServer = () => console.log('[ Pass - upServer ]');

const useMinim = cb => {
    minification = true;
    console.log('[ Work - useMinim ]');
    cb();
}

const make = parallel(html, css, js);

export const dev = series(make, serv);
export const prod = series(cleanDir, useMinim, make, serv);



// ==============================================
// Первый вариант экспорта
// function defaultTask(cb) {
//     // pleace code for your default task here
//     cb();
// } 

// export default defaultTask;



// ==============================================
// Второй вариант экспорта

export default function defaultTask(callback) {
    // pleace code for your default task here
    console.log('defaultTask');
    callback();
} 

export function myTask(callback) {
    // pleace code for your default task here
    console.log('myTask');
    callback();
} 

