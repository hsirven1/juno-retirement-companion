/** Infer choice UI variant so questions don’t all look identical. */
export function getChoiceLayout(
  options: { label: string }[],
  multi: boolean,
): 'rows' | 'chips' | 'scale' {
  if (options.length === 0) return 'rows'
  const maxLen = Math.max(...options.map((o) => o.label.length))
  const avgLen =
    options.reduce((sum, o) => sum + o.label.length, 0) / options.length

  // Compact numeric / short single-select (e.g. 1 · 2-3 · Plusieurs)
  if (!multi && options.length <= 5 && maxLen <= 18 && avgLen <= 12) {
    return 'scale'
  }

  // Follow-up chips (Pourquoi ?, activities, short multi)
  if (maxLen <= 28 && (multi || options.length >= 4)) {
    return 'chips'
  }

  return 'rows'
}
