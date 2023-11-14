/**
 * @Set "定义:   Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用，
 *              Set对象是值的集合，你可以按照插入的顺序迭代它的元素。
 *              Set中的元素只会出现一次，即 Set 中的元素是唯一的"
 *
 * 增删改查
 * @add          "向集合中添加一个新的项"
 * @delete       "删除集合中的一个值"
 * @clear        "清空集合"
 * @has          "判断一个值是否在集合中"
 *
 * 遍历方法  new Set([1,2,3]) 由于 set 没有键名所以 值名即键名
 * @keys()        "返回键名的遍历器"         Array.from(set.keys()) [1,2,3]
 * @values()      "返回键值的遍历器"         Array.from(set.keys()) [1,2,3]
 * @entries()     "返回键值对的遍历器"       Array.from(set.keys()) [[1,1],[2,2],[3,3]]
 * @forEach()    "遍历集合中的每个元素"      set.forEach(value => console.log(value))     1,2,3
 *
 * 应用场景 去重,交集
 */

// let set = new Set()
// set.add(1)
// set.add(2)
// set.add(3)
// console.log(set)                 输出 {1,2,3}
// console.log(set.has(1))          输出 true
// console.log(set.delete(1))       输出 true
// console.log(set.clear())         输出 {}


/**
 *  @WeakSet     1、"WeakSet 对象是一些对象值的集合, 并且其中的每个对象值都只能出现一次。在WeakSet的集合中是唯一的"
 *               2、"与Set相比，WeakSet 只能是对象的集合，而不能是任何类型的任意值"
 *               3、"WeakSet集合中对象的引用为弱引用。 如果没有其他的对WeakSet中对象的引用，那么这些对象会被当成垃圾回收掉。
 *                 这也意味着WeakSet中没有存储当前对象的列表。 正因为这样，WeakSet 是不可枚举的"
 *               4、"WeakSet 的属性跟操作方法与 Set 一致，不同的是 WeakSet 没有遍历方法，因为其成员都是弱引用，
 *                 弱引用随时都会消失，遍历机制无法保证成员的存在"
 */




/**
 * @map             "Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。
 *                  一个Map对象在迭代时会根据对象中元素的插入顺序来进行 — 一个 for...of 循环在每次迭代后会返回一个形
 *                  式为[key，value]的数组"
 *
 * 操作方法
 * @set(key,value)    "向 Map 对象中添加一个键值对"
 * @get(key)          "返回 Map 对象中指定键的值"
 * @has(key)          "判断 Map 对象中是否包含指定的键"
 * @delete(key)       "删除 Map 对象中的指定键"
 * @clear()           "清空 Map 对象"
 *
 * 遍历方法
 * @keys()            "返回键名的遍历器"
 * @values()          "返回键值的遍历器"
 * @entries()         "返回所有成员的遍历器"
 * @forEach()         "遍历 Map 的所有成员"
 *
 * 应用场景
 * new Map(any,any)   "有序且唯一的键值存储器"
 */

//  let map = new Map()
//  map.set("名字",'zhangsan')
//  map.set(23,"年龄")
//  console.log(map)                  { '名字' => 'zhangsan', 23 => '年龄' }
//  console.log(map.get(23))          '年龄'
//  console.log(map.has(23))          true
//  console.log(map.delete(23))       true
//  map.clear()
//  console.log(map)                  {}


// let map = new Map()
// map.set('name','vue3js.cn')
// map.set('age','18')
//
// console.log([...map.keys()])  // ["name", "age"]
// console.log([...map.values()])  // ["vue3js.cn", "18"]
// console.log([...map.entries()]) // [['name','vue3js.cn'], ['age','18']]


/**
 * @WeakMap         "WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的"
 *
 * @与Map的区别
 * 1、Map 的键可以是任意类型，WeakMap 的键只能是对象类型
 * 2、WeakMap 键名所指向的对象，不计入垃圾回收机制
 * 3、WeakMap 的属性跟操作方法与 Map 一致，同 WeakSet 一样，因为是弱引用，所以 WeakMap 也没有遍历方法
 * */
