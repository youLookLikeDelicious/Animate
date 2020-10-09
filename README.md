# JavaScript 动画   
[![Current Release](https://img.shields.io/npm/v/@blog1997/animate)](https://www.npmjs.com/package/@blog1997/animate)
[![License](https://img.shields.io/github/license/youLookLikeDelicious/Animate)](https://github.com/youLookLikeDelicious/Animate/blob/master/LICENSE.md)
[![Min](https://img.shields.io/bundlephobia/min/@blog1997/animate)]()
[![coverage](https://img.shields.io/codecov/c/github/youLookLikeDelicious/Animate)](https://codecov.io/gh/youLookLikeDelicious/Animate)
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
该动画插件自带一个渐隐效果的banner动画。  
### 语法
Animate.bannerFader(element [, config])

### 参数
#### element 
HTMLElement
#### config (选填)
Object  
```javascript
{
    speed: Number,   // 每张图片渐隐的时间
    interval: Number // 图片渐隐之后间隔的时间
}
```
HTML结构如下
```html
<div class="container">
    <a href="/"><img src=""/></a>
    <a href="/"><img src=""/></a>
    <a href="/"><img src=""/></a>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
    </ul>
</div>
```
给结构赋予样式
```css
.canvas{
    left: 0;
    top: 0;
    font-size: 0;
    overflow: hidden;
    width: 880px;
    height: 350px;
    position: relative;
}
.canvas a{
    position: absolute;
}
.canvas ul{
    width: 150px;
    height: 27px;
    z-index: 4;
    position: absolute;
    left: 230px;
    bottom: 7px;
    text-align: center;
    line-height: 27px;
}
.canvas img{
    width: 880px;
    height: 350px;
}
.canvas li{
    width:18px;
    height: 18px;
    border-radius: 17px;
    margin-right:15px;
    display: inline-block;
    transition: 0.3s;
    line-height: 18px;
}
.canvas li:after{
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 6px;
    display: inline-block;
    border: 2px solid #FFFFF0;
    vertical-align: middle;
    margin: 0;
    padding: 0;
}
.canvas ul .on{
    background: rgba(255,255,230, 0.5);
    box-shadow: 0 0 5px white;
}
.canvas ul .on:after{
    background-color: #FFFFF0;
}
```
给结构赋予相关的行为
```javascript
import '@blog1997/animate/banner-animation'
Animate.bannerFader(document.querySelector('.container'), {speed: 540, interval: 5000})
```
