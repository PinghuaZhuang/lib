/**
 * 开票任务状态枚举值
 * @description 1 开票进行中、2 开票部分失败、3 开票全部失败、4开票已完成
 */
export function iTaskStatusOptions() {
  return [
    { label: '开票进行中', value: '1' },
    { label: '开票部分失败', value: '2' },
    { label: '开票全部失败', value: '3' },
    { label: '开票已完成', value: '4' },
  ]
}

/**
 * 状态枚举值
 * @description 状态（0：无效，1：有效）
 */
export function iStatusOptions() {
  return [
    { label: '无效', value: '0' },
    { label: '有效', value: '1' },
  ]
}
