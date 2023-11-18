/**
 * @function isRef                      "判断是否为 ref 对象"
 * @param   {any} r                     "ref 对象"
 * @param   {boolean} [vIsRef=true]     "是否为 ref 对象"
 * r is Ref "判断是否为 ref 对象"
 *
 * */

function isRef(r: any): r is Ref {
    return Boolean(r && r.__v_isRef === true)
}

/**
 * @function ref                        "ref函数"
 * @param   {any} value                 "是否存入一个类型"
 * @param   {boolean} shallow           "是否为浅层响应式"
 * */

function ref(value?: unknown) {
    return createRef(value, shallow = false)
}

function shallowRef(value?: unknown) {
    return createRef(value, shallow = true)
}


/**
 * @function createRef                  "创建 ref 对象"
 * @param   {any} rawValue              "原始值"
 * @param   {boolean} shallow           "是否为浅层响应式"
 * */
function createRef(rawValue: unknown, shallow: boolean) {
    // 判断是否是 ref 对象
    if (isRef(rawValue)) {
        return rawValue
    }
    return new RefImpl(rawValue, shallow)
}

/**
 * class RefImpl
 * @param   {any} _value                    "proxy 对象"
 * @param   {any} _rawValue                 "原始值"
 * @param   {boolean} _shallow              "是否为浅层响应式"
 * @param   {boolean} __v_isRef             "是否为 ref 对象"
 * @param   {any} dep                       "依赖收集"
 * public                          "公共"
 * private                         "私有"
 * readonly                        "只读"
 * */

class RefImpl {
    private _value: any
    private _rawValue: any

    public __v_isRef = true
    public dep?: any = undefined

    // 构造函数 传入 raw 和 shallow
    constructor(value: any, public readonly _shallow: boolean) {
        // 存储 raw
        this._rawValue = _shallow ? value : toRaw(value)
        // 如果是不是 shallow 则, 存储 reactive proxy 否则存储传入参数
        this._value = _shallow ? value : reactive(value)
    }


    // getter value 拦截器
    get value() {
        // track Ref 依赖收集
        trackRefValue(this)
        return this._value;
    }

    // setter value 拦截器
    set value(newVal: any) {
        // 如果是需要深度响应式的则获取 入参的raw
        newVal = this._shallow ? newVal : toRaw(newVal)

        if (hasChanged(newVal, this._rawValue)) {
            // 存储新的 row
            this._rawValue = newVal

            // 更新 value , 如果是深入创建的还需要转化为 reactive 代理
            this._value = this._shallow ? newVal : toReactive(newVal)
            // trigger Ref 依赖更新
            triggerRefValue(this, newVal);
        }

    }
}

/**
 * @function trackRefValue               "依赖收集"
 * @function triggerRefValue             "触发依赖收集"
 * */

function trackRefValue(ref: any) {
    if (isTracking()) {
        // 获取 raw ref 数据
        ref = toRaw(ref)
        // 如果当前 ref 还未初始化 dep则创建
        if (!ref.dep) {
            ref.dep = createDep()
        }

        // 如果是开发环境,则传入 track 细节
        if (__DEV__) {
            trackEffect(ref.dep, {
                target: ref,
                type: TrackOpTypes.GET,
                key: 'value'
            })
        } else {
            trackEffects(ref.dep)
        }
    }
}

function triggerRefValue(ref: any, newVal: any) {
    // 获取 raw ref 数据
    ref = toRaw(ref)
    // 如果当前是开发环境则发送具体触发细节
    if (__DEV__) {
        triggerEffects(ref.dep,{
            target: ref,
            // SET 引起的变化
            type: TriggerOpTypes.SET,
            key: 'value',
            newVal
        })
    }
}

const userInfo = ref(123)
console.log(userInfo)