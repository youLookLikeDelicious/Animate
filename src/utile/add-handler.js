function addHandler (obj, type, handler, flag = false) {
    if (obj.addEventListener) {
        // 标准浏览器方式
        obj.addEventListener(type, handler, flag);
    } else if (obj.attachEvent) {
        // IE的方式
        obj.attachEvent('on' + type, handler);
    } else {
        // 使用DOM一级的方式,无法给同一个事件源添加多个监听器
        obj['on' + type] = handler;
    }
}
window.addHandler = addHandler
export default addHandler