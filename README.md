### JavaScript 动画   
使用的缓冲<br/>
> Bezier、0~π区间的sin(x)面积、二次函数
       
>允许使用rem作为长度单位 (统一处理成像素)  
自带banner动画（渐隐效果）   
    
...
### 介绍
> Animate(el, config, [callback])   
>>config 是动画的配置    
>>callback 动画结束后的回调 
>>>config.ani 选填，预定义的动画，自动生成配置，如fadeIn, fadeOut, fadeToggle, slideUp, slideDown, slideToggle  
>>>config.duration 选填，动画执行的时间（毫秒计），默认700ms   
>>>config.delay 选填，动画延迟（毫秒计），默认0    
>>>config.times 选填，动画执行的次数，默认1   
>>>config.easing 选填, 缓冲. bezier(param1, [param2])

### 使用
```
    let el = document.querySelector('div')
    Animate(el, {
        width:'400px',
        height: '500px',
        easing: 'bezier(0.5, 2)',
        duration: 3000
    })

    # 自动渐隐渐显
    Animate(el, 'fadeToggle')

    # 自动上下滑动
    function slideToggle () {
            Animate(document.querySelector('#box3'), {ani: 'slideToggle', delay: 700}, slideToggle)
    }
    slideToggle()


    # banner动画
    ------------DOM结构-------------
    <div class="canvas">
        <a><img src=""/></a>
        <a><img src=""/></a>
        <a><img src=""/></a>
        ...
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            ...
        </ul>
    </div>
    ------------CSS样式-------------
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
    ------------行为-------------
    let canvase = document.querySelector('.canvas')
    Animate.bannerFader(canvase, {speed: 540, interval: 5000})
    ...
```
 ##### banner动画效果
![alt text](http://m.qpic.cn/psb?/V11HvW1h3vJkOa/Dyb1co*5u8DlViJu0*g8jwTfR0Cq*gKPkMnuooLnhLg!/b/dLYAAAAAAAAA&bo=ZwNYAQAAAAADBx8!&rf=viewer_4)   


