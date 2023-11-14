// target   要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理
// handler  一个通常以函数作为属性的对象，用来定制拦截行为
// const proxy = new Proxy(target, handler)

const proxy = new Proxy({}, {
    // get              属性读取操作的捕捉器。
    // set              属性设置操作的捕捉器。
    // has              in 操作符的捕捉器。
    // deleteProperty   delete 操作符的捕捉器。
    // ownKeys          Object.getOwnPropertyNames 方法和 Object.getOwnPropertySymbols 方法的捕捉器。
    // apply            函数调用操作的捕捉器。
    // construct        new 操作符的捕捉器
    // Reflect          反射
    get(target, key, receiver) {
        return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver);
    },
    has(target, p) {
        return Reflect.has(target, p);
    },
    deleteProperty(target, p) {
        return Reflect.deleteProperty(target, p);
    },
    ownKeys(target) {
        return Reflect.ownKeys(target);
    },
    apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, argArray);
    },
    construct(target, argArray, newTarget) {
        return Reflect.construct(target, argArray, newTarget);
    },
    defineProperty(target, p, attributes) {
        return Reflect.defineProperty(target, p, attributes);
    },
});

const origin = {

}
const obj = new Proxy(origin,{
    // target 代理对象 key  代理对象的属性名 receiver  代理对象的属性值
    get(target,key,receiver){
        return "huanghanhui"
    },
})

// console.log(obj.name)        huanghanhui
// console.log(obj.nickName)    huanghanhui

// console.log(origin.name)     undefined
// console.log(origin.name)     undefined



/*
* proxy 的应用场景 (校验器)
* new Proxy(target, handler)
* 1. 代理对象的属性 target
* 2. 代理对象的方法 handleFunction
*/

const target = {
    _id: '100',
    _name: 'huanghanhui',
}

const validators = {
    name:(value) => {
        return typeof value === 'string'
    },
    _id: (value) => {
        return typeof value === 'number' && value > 108
    }
}

const createValidator = (target,validator) => {
    return new Proxy(target,{
        _validator: validator,
       /*
       *    target-目标对象 key-属性名 value-属性值 proxy-代理对象本身 就是 new Proxy(target,{})
       *    箭头函数  set: (target,key,value,proxy) =>{}
       *    普通函数  set: function (target,key,value,proxy){}
       *    缩写函数  set(target,key,value,proxy){}
       * */

        // set: (target,key,value,proxy) =>{
        //     let validatorRes = validator[key](value)
        //     if (validatorRes) return Reflect.set(target,key,value,proxy)
        //     throw Error(`Cannot set ${key} on ${value}. invalid type`)
        // },


        // set: function (target,key,value,proxy){
        //     let validatorRes = this._validator[key](value)
        //     if (validatorRes) return Reflect.set(target,key,value,proxy)
        //     throw Error(`Cannot set ${key} on ${value}. invalid type`)
        // },
        set (target,key,value,proxy){
            let validatorRes = this._validator[key](value)
            if (validatorRes) return Reflect.set(target,key,value,proxy)
            throw Error(`Cannot set ${key} on ${value}. invalid type`)
        },
    })
}

const proxyValidator = createValidator(target,validators)
// console.log(proxyValidator.name = "xiaohei")
// console.log(proxyValidator.name = 123123)   Cannot set name on 123123. invalid type


/*
* proxy 的应用场景 (私有属性拦截器)
* 开头为下划线的属性为大家约定的私有属性 _id , _name
* */

const targetVal = {
    _id: 100,
    name: 'huanghanhui',
}

const proxyVal = new Proxy(targetVal,{
    get:(target,key,proxy) =>{
        if (key[0] === "_") {
            throw Error(`Cannot get ${key} on restricted`)
        }
        return Reflect.get(target,key,proxy)
    },
    set:(target,key,value,proxy) =>{
        if (key[0] === "_") {
            throw Error(`Cannot set ${key} on restricted`)
        }
        return Reflect.set(target,key,value,proxy)
    }
})
console.log(proxyVal.name)
// console.log(proxyVal._id)            Cannot get _id on restricted
// console.log(proxyVal._id = 123123)   Cannot set _id on restricted