# JavaScript 动画   
[![Current Release](https://img.shields.io/npm/v/@blog1997/animate)](Current-Release)
[![License](https://img.shields.io/github/license/youLookLikeDelicious/Animate)](License)
[![Min](https://img.shields.io/bundlephobia/min/@blog1997/animate)](min)
[![coverage](https://img.shields.io/codecov/c/github/youLookLikeDelicious/Animate)](coverage)
>允许使用rem作为长度单位 (统一处理成px)  
附带banner动画（渐隐效果）   
兼容性 IE >= 9
...
### 语法
>Animate(el, config [, callback])

#### 参数
##### el 
    执行动画的dom元素
##### config

```javascript
{   
    ani: String, // 选填，预定义的动画，如fadeIn, fadeOut, fadeToggle, slideUp, slideDown, slideToggle  
    duration: Number, // 选填，动画执行的时间（毫秒计），默认700ms   
    delay: Number,  // 选填，动画延迟（毫秒计），默认0    
    times: Number,  // 选填，动画执行的次数，默认1   
    easing: String, // 选填, 缓冲. 'bezier(param1 [,param2])' | 'swing'  | 'liner'
}
```
##### callback
    回调函数，会将el作为参数调用

### 安装
```npm
    npm install @blog1997/animate
```
### 使用
```javascript
    import animate from '@blog1997/animate'
```
### hello world
```javascript
    Animate(document.querySelector('div'), {
        width:  '400px',
        height: '12rem',
        easing: 'bezier(0.5, 2)',
        duration: 3000
    })

    # 自动渐隐渐显
    Animate(el, 'fadeToggle')
```
slideToggle也对display = 'none',并且没有指定宽高的元素有效。会根据元素中的内容自动调整尺寸。
```javascript
    # 自动上下滑动
    function slideToggle () {
        Animate(document.querySelector('div'), {
            ani: 'slideDown', 
            delay: 700
        })
    }
```
