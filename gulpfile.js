// Создание общей константы
const { src, dest, parallel, watch, series, task } = require("gulp");
// Создание констант для плагинов
const pug          = require("gulp-pug");
const sass         = require("gulp-sass")(require('sass'));
const browsersync  = require("browser-sync").create();

// Функция компиляции pug в html
function pugCompiler() {
    return src("src/*.pug")
        .pipe(pug({
            pretty: true,
        }))
        .pipe(dest("project/"))
        .pipe(browsersync.stream())
}
// Функция компиляции scss в css
function sassCompiler() {
    return src("src/scss/*.scss")
        .pipe(sass())
        .pipe(dest("project/css/"))
        .pipe(browsersync.stream())
}

// Функция для запуска локального сервера
function browserSync() {
    browsersync.init({
        server: { baseDir: "project/" },
        notify: false,
    })
}
// Функция для отслеживания файлов
function watchFiles() {
    watch("src/**/*.pug", pugCompiler)
    watch("src/**/*.scss", sassCompiler)
}
// Экспорт функций
exports.pugCompiler = pugCompiler;
exports.sassCompiler = sassCompiler;
exports.browserSync = browserSync;

// Основные задачи
const mainTasks = parallel(pugCompiler, sassCompiler);
// Построение сценария выполнения задач
const dev = series(mainTasks, parallel(watchFiles, browserSync));
// Выполнение сценария по умолчанию
task('default', dev);