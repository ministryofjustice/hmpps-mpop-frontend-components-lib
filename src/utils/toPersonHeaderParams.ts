import type { PersonHeaderParams, PersonHeaderParamsInput } from '../types/PersonHeader'
import { dateWithYear } from './dateWithYear'
import { getManagedByDetails } from './getManagedByDetails'
import { getRiskBadges } from './personRiskFlagSorter'
import { tierUrlV3 } from './tierUrlV3'
import { toTitleCase } from './toTitleCase'

export const toPersonHeaderParams = ({
  crn,
  name,
  dateOfBirth,
  tier,
  historyHref,
  tierUrl,
  professionalContact,
  managedByHref,
  riskFlags,
  riskBadgeData,
  personStatusTag,
  photo,
  riskBadges,
  riskData,
  roshLevel,
  useNDeliusRosh,
  collapsibleRiskFlags,
  riskHrefBase,
  showRisks,
}: PersonHeaderParamsInput): PersonHeaderParams => {
  const managedBy = getManagedByDetails(crn, professionalContact ?? null, managedByHref)

  return {
    name: `${name.forename} ${name.surname}`,
    crn,
    dob: dateOfBirth ? (dateWithYear(dateOfBirth) ?? undefined) : undefined,
    tier: toTitleCase(tier?.tierScore),
    provisional: tier?.provisional ?? false,
    historyHref: historyHref ?? (tierUrl ? tierUrlV3(tierUrl, crn) : undefined),
    managedBy: managedBy.text,
    managedByName: managedBy.name,
    managedByLocation: managedBy.location,
    managedByHref: managedBy.href,
    photo,
    riskBadges,
    riskData,
    roshLevel,
    useNDeliusRosh,
    personRiskFlags: riskBadgeData ?? (riskFlags ? getRiskBadges(riskFlags) : undefined),
    collapsibleRiskFlags,
    riskHrefBase,
    showRisks,
    personStatusTag,
  }
}
