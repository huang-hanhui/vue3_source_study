/**
*
*   @Object.defineProperty(obj,propertyName,descriptor)
*
*   @obj: Object             “要定义属性的对象”
*   @propertyName: String    "要定义或者修改的属性名或者Symbol"
*   @descriptor: Object      "要定义或者修改的属性描述符"
* */

// 举例子
const obj = {}
Object.defineProperty(obj, 'name', {
    value: 'zhangsan',      // 属性值
    writable: false,        // 是否可写
    configurable: false,    // 是否可配置 删除
    enumerable: false       // 是否可枚举、遍历
})

obj.name = "lisi"
// console.log(obj.name)       修改无效
delete obj.name
// console.log(obj)            删除无效
for(key in obj){
    // console.log(key)        遍历无效
}

/**
*  @vue2 “双向数据绑定都是通过 defineProperty 的 getter,setter 来实现”
* */

const objVal = {}
Object.defineProperty(objVal, 'name', {
    set: (value) => {
        console.log('set 修改属性值', value)
    },
    get: () => {
        console.log('get 获取属性值')
        return 'zhangsan'
    }
})

console.log(objVal.name)                // get
console.log(objVal.name = 'lisi')       // set