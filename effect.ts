/**
 * @description                             "effect学习"
 * @description 学习于 https://juejin.cn/post/6980187898045972487
 * */

/**
 * @description                             "依赖收集"
 * @function                                "effect"
 * @param {Function} fn                     "函数"
 * @param {ReactiveEffectOptions} options   "选项"
 * */

/**
 * @description                             "options的属性"
 * @param {boolean} lazy                    "是否懒执行"
 * @param {boolean} computed                "是否为 computed"
 * @param schedule                          "调度函数"
 * @param onTrack                           "追踪时触发"
 * @param onTrigger                         "触发回调时触发"
 * @param onStop                            "停止时触发"
 * */

interface ReactiveEffectOptions {
    lazy?: boolean,
    computed?: boolean,
    schedule?: (job: ReactiveEffect) => void,
    onTrack?: (event: DebuggerEvent) => void,
    onTrigger?: (event: DebuggerEvent) => void,
    onStop?: () => void
}

function effect<T = any>(
    fn: () => T,
    options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
    if (isEffect(fn)) {
        fn = fn.raw
    }
    const effect = createReactiveEffect(fn, options)
    if (!options.lazy) {
        effect()
    }
    return effect
}

/**
 * 当我们调用 effect 时，首先判断传入的 fn 是否是 effect，如果是，取出原始值，然后调用 createReactiveEffect 创建 新的effect，
 * 如果传入的 option 中的 lazy 不为为 true，则立即调用我们刚刚创建的 effect, 最后返回刚刚创建的 effect。
 * */


/**
 * @description                             "createReactiveEffect函数源码"
 * @param {Function} fn                     "原始函数"
 * @param {ReactiveEffectOptions} options   "options"
 * @return {ReactiveEffect}                 "创建的effect"
 * */

function createReactiveEffect<T = any>(
    fn: (...args: any[]) => T,
    options: ReactiveEffectOptions
): ReactiveEffect<T> {

    /**
     * @description                             "reactiveEffect的解释"
     * @function                                "reactiveEffect"
     * @param ...args                           "传入的参数"
     * @return {any}                            "返回的值"
     *
     * */
    const effect = function reactiveEffect(...args: any[]): any {

        /**
         * 如果 effect 不是激活状态，这种情况发生在我们调用了 effect 中的 stop 方法之后，
         * 那么先前没有传入调用 scheduler 函数的话，直接调用原始方法fn，否则直接返回
         * */
        if (!effect.active) {
            return options.schedule ? undefined : fn(...args)
        }
        /**
         * 首先判断是否当前 effect 是否在 effectStack 当中，如果在，则不进行调用，这个主要是为了避免死循环
         * */
        if (!effectStack.includes(effect)) {
            cleanup(effect)

            /**
             * 清除完依赖，就开始重新收集依赖。首先开启依赖收集，把当前 effect 放入 effectStack 中，
             * 然后讲 activeEffect 设置为当前的 effect，activeEffect 主要为了在收集依赖的时候使用，
             * 然后调用 fn 并且返回值，当这一切完成的时候，finally 阶段，会把当前 effect 弹出，恢复原来的收集依赖的状态，
             * 还有恢复原来的 activeEffect。
             * */
            try {
                enableTracking()
                effectStack.push(effect)
                activeEffect = effect
                return fn(...args)
            } finally {
                effectStack.pop()
                resetTracking()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    } as ReactiveEffect<T>

    /**
     * @description                             "effect"
     * @param id                                "自增id，唯一标识effect"
     * @param _isEffect                         "是否是effect"
     * @param active                            "effect是否激活"
     * @param raw                               "原始函数 fn"
     * @param deps                              "持有当前effect的dep数组"
     * @param options                           "创建effect时传入的options"
     * */

    effect.id = uid++
    effect._isEffect = true
    effect.active = true
    effect.raw = fn
    effect.deps = []
    effect.options = options

    return effect
}

/**
 * @description                             "cleanup清除依赖"
 * @function                                "cleanup"
 * @param {ReactiveEffect} effect           "effect"
 *
 * 清除依赖，每次 effect 运行都会重新收集依赖, deps 是持有 effect 的依赖数组，其中里面的每个
 * dep 是对应对象某个 key 的 全部依赖，我们在这里需要做的就是首先把 effect 从 dep 中删除，最后把 deps 数组清空。
 * */

function cleanup(effect: ReactiveEffect) {
    const {deps} = effect
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].remove(effect)
        }
        deps.length = 0
    }
}

/**
 * @description                             "track"
 * @function                                "track"
 * @param {object} target                   "target 表示触发 track 的对象"
 * @param {TrackOpTypes} type               "type 代表触发 track 类型"
 * @param {unknown} key                     "key 触发 track 的 object 的 key"
 * */

export const enum TrackOpTypes {
    GET = 'get',
    HAS = 'has',
    ITERATE = 'iterate',
}

function track(target: object, type: TrackOpTypes, key: unknown) {
    /**
     * 如果 shouldTrack 为 false 或者 activeEffect 为空，则不进行依赖收集。
     * */
    if (!shouldTrack || activeEffect === undefined) {
        return
    }

    /**
     * 接着 targetMap 里面有没有该对象，没有新建 map，然后再看这个 map 有没有这个对象的对应 key 的 依赖 set 集合，没有则新建一个。
     * */
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    /**
     * 如果对象对应的 key 的 依赖 set 集合也没有当前 activeEffect，
     * 则把 activeEffect 加到 set 里面，同时把 当前 set 塞到 activeEffect 的 deps 数组。
     * */
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
        activeEffect.deps.push(dep)
        /**
         * 最后如果是开发环境而且传入了 onTrack 函数，则触发 onTrack。
         * 所以 deps 就是 effect 中所依赖的 key 对应的 set 集合数组， 毕竟一般来说，effect
         * 中不止依赖一个对象或者不止依赖一个对象的一个key，而且 一个对象可以能不止被一个 effect 使用，所以是 set 集合数组。
         * */
        if (__DEV__ && activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key
            })
        }
    }
}

/**
 * @description                             "trigger介绍"
 * @function                                "trigger"
 * @param {object} target                   "target 表示触发 track 的对象"
 * @param {TrackOpTypes} type               "type 代表触发 track 类型"
 * @param {unknown} key                     "key 触发 track 的 object 的 key"
 * @param {unknown} newValue                "触发 track 的新值"
 * @param {unknown} oldValue                "触发 track 的旧值"
 * @param {set<unknown>} oldTarget          "触发 track 的旧 target"
 * */

const enum TriggerOpTypes {
    SET = 'set',
    ADD = 'add',
    DELETE = 'delete',
    CLEAR = 'clear',
}

function trigger(
    target: object,
    type: TriggerOpTypes,
    key?: unknown,
    newValue?: unknown,
    oldValue?: unknown,
    oldTarget?: Map<unknown, unknown> | set<unknown>
) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        // never been tracked
        return
    }


    const effects = new Set<ReactiveEffect>()
    const computedRunners = new Set<ReactiveEffect>()

    /**
     * add 方法是将 effect 添加进不同分组的函数，其中 effect !== activeEffect 这个是为了避免死循环，
     * 在下面的注释也写的很清楚，避免出现 foo.value++ 这种情况。至于为什么是 set 呢，要避免 effect 多次运行。
     * 就好像循环中，set 触发了 trigger ，那么 ITERATE 和 当前 key 可能都属于同个 effect，这样就可以避免多次运行了。
     *
     * */
    const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                if (effect !== activeEffect || !shouldTrack) {
                    if (effect.options.computed) {
                        computedRunners.add(effect)
                    } else {
                        effects.add(effect)
                    }
                } else {
                    // the effect mutated its own dependency during its execution.
                    // this can be caused by operations like foo.value++
                    // do not trigger or we end in an infinite loop
                }
            })
        }
    }

    /**
     * 下面根据触发 key 类型的不同进行 effect 的处理。如果是 clear 类型，则触发这个对象所有的 effect。如果 key 是 length ,
     * 而且 target 是数组，则会触发 key 为 length 的 effects ，以及 key 大于等于新 length的 effects， 因为这些此时数组长度变化了。
     * */

    if (type === TriggerOpTypes.CLEAR) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add)
    } else if (key === "length" && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === "length" || key >= (newValue as number)) {
                add(dep)
            }
        })

        /**
         * 下面则是对正常的新增、修改、删除进行 effect 的分组, isAddOrDelete 表示新增 或者不是数组的删除，
         * 这为了对迭代 key的 effect 进行触发，如果 isAddOrDelete 为 true 或者是 map 对象的设值，则触发
         * isArray(target) ? 'length' : ITERATE_KEY 的 effect ，如果 isAddOrDelete 为 true 且 对象为 map，
         * 则触发 MAP_KEY_ITERATE_KEY 的 effect
         * */
    } else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key))
        }

        // also run for iteration key on ADD | DELETE | Map.SET
        const isAddOrDelete = type === TriggerOpTypes.ADD || (type === TriggerOpTypes.DELETE && isArray(target))
        if (isAddOrDelete || (type === TriggerOpTypes.SET && target instanceof Map)) {
            add(depsMap.get(isArray(target) ? "length" : ITERATE_KEY))
        }
        if (isAddOrDelete && target instanceof Map) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
        }

    }

    /**
     * 最后是运行 effect， 像上面所说的，computed effects 会优先运行，因为 computed effects 在运行过程中，
     * 第一次会触发上游把cumputed effect收集进去，再把下游 effect 收集起来。
     * */

    const run = (effect: ReactiveEffect) => {
        if (__DEV__ && effect.options.onTrigger) {
            effect.options.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue,
                oldTarget
            })
        }

        if (effect.options.scheduler) {
            effect.options.scheduler(effect)
        } else {
            effect()
        }
    }

    // Important: computed effects must be run first so that computed getters
    // can be invalidated before any normal effects that depend on them are run.
    computedRunners.forEach(run)
    effects.forEach(run)
}

/**
 * @description                                 "stop"
 * @function                                    "stop"
 * @param {ReactiveEffect} effect               "effect"
 *
 * 当我们调用 stop 方法后，会清空其他对象对 effect 的依赖，同时调用 onStop 回调，最后将 effect 的激活状态设置为 false
 * */

function stop(effect: ReactiveEffect) {
    if (effect.active) {
        cleanup(effect)
        if (effect.options.onStop) {
            effect.options.onStop()
        }
        effect.active = false
    }
}
