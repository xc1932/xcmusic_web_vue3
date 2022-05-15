// 1.生成一个长度为n，元素为 < n 的不重复索引的随机数组。
export function createRandomIndexArr(n) {
    if (n === 0) return undefined
    if (n === 1) return [0]
    const resArr = []
    // 填充一个有序数组
    for (let i = 0; i < n; i++) {
        resArr[i] = i
    }
    return shuffle(resArr)
}

// 打乱一个数组
export function shuffle(arr) { 
    for (let i = arr.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (1 + i))
        swap(arr,i,randomIndex)
    }
    return arr
}

// 交换数组中的两个元素
function swap(arr, index1, index2) {
    let temp = arr[index1]
    arr[index1] = arr[index2]
    arr[index2] = temp
}