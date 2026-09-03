import type { Locale } from '../i18n/types'
import type { LilleResource, ResourceType } from '../data/lilleResources'
import type { Messages } from '../i18n/messages'

export function getResourceTypeLabel(
  type: ResourceType,
  copy: Messages,
): string {
  return copy.resources.types[type] ?? type
}

export function getCommitmentLabel(
  resource: LilleResource,
  copy: Messages,
): string {
  const level = resource.commitment.level
  const cadence = resource.commitment.cadence
  const byLevel = copy.resources.commitmentLevels
  if (level in byLevel) {
    return byLevel[level as keyof typeof byLevel]
  }
  if (cadence.includes('weekly')) return copy.resources.commitmentLevels.weekly
  if (cadence.includes('monthly')) return copy.resources.commitmentLevels.monthly
  if (cadence.includes('flexible')) return copy.resources.commitmentLevels.flexible
  return copy.resources.commitmentLevels.low
}

export function makeResourceLabelFns(copy: Messages, _locale: Locale) {
  return {
    typeLabel: (resource: LilleResource) =>
      getResourceTypeLabel(resource.resourceType, copy),
    commitmentLabel: (resource: LilleResource) =>
      getCommitmentLabel(resource, copy),
  }
}
