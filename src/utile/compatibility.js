import addHandler from './add-handler'
/*v1.0.0 兼容IE >= 9*/
/*rem自适应
(function (doc, win) {
   var docEl = doc.documentElement,
       recalc = function () {
           var clientWidth = docEl.clientWidth;
           if (!clientWidth) return;
           var tmp = clientWidth / 160;
           docEl.style.fontSize = (tmp < 10? 10 : tmp) + 'px';
           docEl.style.display = "none";
           docEl.clientWidth; // Force relayout - important to new Android devices
           docEl.style.display = "";
       };

   // Abort if browser does not support addEventListener
   if (!doc.addEventListener) return;

   // Test rem support
   var div = doc.createElement('div');
   div.setAttribute('style', 'font-size: 1rem');

   // Abort if browser does not recognize rem
   if (div.style.fontSize != "1rem") return;

   win.addEventListener('resize', recalc, false);
   doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);*/

// requestAnimationFrame 兼容性处理

(function () {    
    if (!Date.now)
        Date.now = function () {
            return new Date().getTime()
        };

    var vp,
        venders = ['webkit', 'mos'],
        animationframe_interval = 1000 / 70,        // 默认的时间间隔
        ios6Pattern = /iP(ad|hone|od).*OS 6/;

    if (!window.requestAnimationFrame) {
        for (let i = 0, len = venders.length; i < len; i++) {
            vp = venders[i];
            window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']
        }

    }
    // ios6 is buggy, use timeOut instead of requestAnimationFrame
    // 对于不支持requestAnimationFrame的情况也是用timeOut替代
    if (ios6Pattern.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            return window.requestAnimationFrame.animationID = setTimeout(function () {
                window.requestAnimationFrame.animationCallback = callback;
                callback();
            }, animationframe_interval);
        };
        
        // 设置初始的状态
        window.requestAnimationFrame.animationCallback = null;
        window.requestAnimationFrame.animationID = null;

        // 清除动画
        window.cancelAnimationFrame = function () {
            window.clearTimeout(window.requestAnimationFrame.animationID)
            window.requestAnimationFrame.animationCallback = null;
            window.requestAnimationFrame.animationID = null;
        }

        // add document listener
        if (document.visibilityState) {
            addHandler(document, 'visibilitychange', function () {
                if (document.visibilityState == 'hidden') {
                    // 当浏览器处于hidden状态时（最小化或后台运行），停止动画
                    window.cancelAnimationFrame(window.requestAnimationFrame.animationID)
                } else if (document.visibilityState == 'show') {
                    // 当浏览器处于show状态时，开始动画
                    window.requestAnimationFrame(window.requestAnimationFrame.animationCallback);
                }
            });
        }
    }
})()
