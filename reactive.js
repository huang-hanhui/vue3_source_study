/**@function Reflect    "反射"
 *
 * @param target        "目标对象"
 * @param key           "属性名"
 * @param receiver      "代理对象"
 *
 * Reflect 操作符 作用和 proxy 类型
 * 1. Reflect.get(target,key,receiver)
 * 2. Reflect.set(target,key,value,receiver)
 * 3. Reflect.deleteProperty(target,key)
 *
 * */
function reactive(obj) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key)
            // track(target,key) 依赖收集
            console.log("获取某个元素")
            return res
        },
        set(target, key, value, receiver) {
            const res = Reflect.set(target, key, value)
            // trigger(target,key) 触发依赖
            console.log("修改触发")
            return res
        }
    })
}

const userInfo = reactive({
    name: "huanghanhui",
    age: 23,
    sex: "男",
    phone: "13580652939",
    email: "huang13580652939@163.com",
    address: "广州",
    tag: ["vue", "react", "angular"]
})

console.log(userInfo.name)
userInfo.name = "zhangsan"
// console.log(userInfo)
