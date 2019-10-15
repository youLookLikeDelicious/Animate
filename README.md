### JavaScript 动画   
使用的缓冲<br/>
> Bezier、0~π区间的sin(x)面积、二次函数
       
>允许使用rem作为长度单位 (统一处理成像素)  
自带banner动画（渐隐）   
    
...

### 调试
```
    npm install
    npm run dev
```

### 使用
```
    let el = document.querySelector('div')

    Animate.animate(el, {
        width:'400px',
        height: '500px',
        buffer: 'bezier(0.5, 2)'
    }, 1000)
```
