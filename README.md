# vue3_source_study

#### 1、学习 proxy
#### 2、Object.defineProperty 与 proxy 的对比

    1)、vue2 对象新增属性，视图不更新原因 data中的数据在初始化在 create之前就完成了，
        并且会对 data 绑定一个观察者 Observer（getter,setter） ，之后data中的字段
        发生更新 会通知依赖收集器 Dep 触发视图更新，而 Object.defineProperty 是对 
        对象上的属性的操作，而非对象本身操作，所以 Observer 不能监听到他的变化，导致
        视图不会刷新
        
        而要使对象新增的属性被 observer 观察者注意到，从而触发视图的更新，要使用 Vue
        提供的全局 $set ，本质是手动给新增的属性添加观察者 observer

    2)、使用 defineProperty 时，我们 修改 原来的 obj 对象就可以触发拦截，而使用 proxy (ref ,reactive) 
        就必须修改代理对象，即 Proxy 的实例才可以触发拦截

#### 3、重温 set、map 
    Set 集合，是由一堆无序的、相关联的，且不重复的内存结构【数学中称为元素】组成的组合

    Map 字典（dictionary）是一些元素的集合。每个元素有一个称作key 的域，不同元素的key 各不相同

    共同点：集合、字典都可以存储不重复的值
    不同点：集合是以[值，值]的形式存储元素，字典是以[键，值]的形式存储


#### 4、reactive 源码学习

#### 5、ref 源码学习及基本实现

#### 6、effect 源码学习