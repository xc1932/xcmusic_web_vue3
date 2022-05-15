import { ref, watch, onMounted } from 'vue'
export default function useProcessBarController(processbarWidth, processProp) {
    const process = ref(0)
    const mouseEvent = {
        hasDown: false,     //标记鼠标是否按下，按下才处理mousemove事件
        hasMoved: false,    //标记是否拖动鼠标，拖动了则不处理click事件,mousedown => mouseup => mouseup
        startX: 0,          //记录鼠标按下时的起始位置
        startProcess: 0     //记录鼠标按下时的进度 !important
    }

    const lineRef = ref(null)
    const circleRef = ref(null)
    let count = 0   //判断是否第一次muted
    // 根据用户传入数据初始化进度
    watch(
        processProp,
        async (newProcessProp) => {
            if (count > 0) {
                // 添加过渡
                addTransition()
            }
            process.value = newProcessProp;
            count++
        },
        { immediate: true }
    );

    // 1.根据点击确定改变进度
    const onclickHandler = function (e) {
        // 如果处理了拖动事件，就不处理点击了
        if (mouseEvent.hasMoved) {
            // 重置鼠标移动的标志位
            mouseEvent.hasMoved = false
            return
        }
        // 添加过渡
        addTransition()
        // 设置新的进度
        const rectLeft = e.currentTarget.getBoundingClientRect().left
        const offsetX = e.clientX - rectLeft
        process.value = Math.min(Math.max(offsetX / processbarWidth, 0), 1)
    }

    // 2.根据拖动改变进度    
    const mouseDownHandelr = function (e) {
        // 记录鼠标按下时的状态(起始位置和进度)
        mouseEvent.hasDown = true
        mouseEvent.startX = e.clientX
        mouseEvent.startProcess = process.value
    }

    const mouseMoveHandelr = function (e) {
        if (!mouseEvent.hasDown) return
        // 移除过渡
        removeTransition()
        // 计算增加的进度
        const offsetX = e.clientX - mouseEvent.startX
        const incrementProcess = offsetX / processbarWidth
        // 在原有进度(鼠标按下时记录的进度 !important )的基础上增加进度
        process.value = Math.min(Math.max(mouseEvent.startProcess + incrementProcess, 0), 1)
        mouseEvent.hasMoved = true
    }

    const mouseUpHandelr = function () {
        // 重置鼠标按下的标志位
        mouseEvent.hasDown = false
    }

    onMounted(() => {
        window.addEventListener('mousemove', mouseMoveHandelr)
        window.addEventListener('mouseup', mouseUpHandelr)
        // important！！！！
        window.addEventListener("dragstart", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    })

    // 添加过渡
    const addTransition = function () {
        lineRef.value.style.transition = 'width 0.5s ease'
        circleRef.value.style.transition = 'left 0.5s ease'
    }

    // 移除过渡
    const removeTransition = function () {
        // 移除过渡
        lineRef.value.style.transition = ''
        circleRef.value.style.transition = ''
    }

    return {
        process,
        onclickHandler,
        mouseDownHandelr,
        mouseMoveHandelr,
        mouseUpHandelr,
        lineRef,
        circleRef
    }
}