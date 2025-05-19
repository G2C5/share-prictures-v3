import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import throttle from 'lodash/throttle'

interface UseBottomRequestOptions {
  threshold?: number;
  elRef?: Ref<HTMLElement | Window | null>;
}

export default function useInfiniteScroll({
  threshold = 100, // 触底阈值
  elRef, // 监听元素：默认window
}: UseBottomRequestOptions) {
  let el: HTMLElement | Window = window
  const isBottom = ref(false) // 触底 状态
  const handleScroll = throttle(() => {
    if (!elRef || !elRef.value || elRef.value instanceof Window) {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement
      isBottom.value = scrollTop + clientHeight >= scrollHeight - threshold
    } else {
      const { scrollTop, clientHeight, scrollHeight } = elRef.value
      isBottom.value = scrollTop + clientHeight >= scrollHeight - threshold
    }
  }, 300)

  onMounted(() => {
    if (elRef && elRef.value) el = elRef.value
    el.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    el.removeEventListener('scroll', handleScroll)
  })

  return { isBottom }
}
