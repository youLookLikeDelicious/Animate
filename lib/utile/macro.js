"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.easingReg = exports.REM = exports.separatePI = exports.styleReg = void 0;
var styleReg = /(-?\d+\.?\d*)([a-z%]*)/;
exports.styleReg = styleReg;
var separatePI = Math.PI / 2;
exports.separatePI = separatePI;
var easingReg = /(\w+)\s*(\(?\s*[\d\,\. ]*\)?)/; // 将缓冲函数的参数和函数体分离
// 获取rem的值

exports.easingReg = easingReg;
var REM = window.getComputedStyle ? parseInt(window.getComputedStyle(document.body).fontSize) : parseInt(document.body.currentStyle['font-size']);
exports.REM = REM;