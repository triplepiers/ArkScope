const icon = key => `/assets/endfield/operators/icons/${key}.jpg`
export const professions = [
  ['guard', '近卫'], ['caster', '术师'], ['support', '辅助'],
  ['shielder', '重装'], ['vanguard', '先锋'], ['assault', '突击'],
].map(([value, label]) => ({ value, label, icon: icon(value) }))
export const elements = [
  ['fire', '灼热'], ['ice', '寒冷'], ['electric', '电磁'], ['nature', '自然'], ['physic', '物理'],
].map(([value, label]) => ({ value, label, icon: icon(value) }))
export function filterOperators(operators, profession = '', element = '') {
  return operators.filter(operator => (!profession || operator.prof === profession) && (!element || operator.elem === element))
}
