### JavaScript 动画   
       
>允许使用rem作为长度单位 (统一处理成像素)  
附带banner动画（渐隐效果）   
    
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

### 安装
```
    npm install xy-animate
```
### 使用
```
    import animate from 'xy-animate'
```
### hellow world
```
    let el = document.querySelector('div')
    animate(el, {
        width:'400px',
        height: '500px',
        easing: 'bezier(0.5, 2)',
        duration: 3000
    })

    # 自动渐隐渐显
    animate(el, 'fadeToggle')

    # 自动上下滑动
    function slideToggle () {
            animate(document.querySelector('#box3'), {ani: 'slideToggle', delay: 700}, slideToggle)
    }
    slideToggle()
```

