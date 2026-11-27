import { tierUrlV3 } from './tierUrlV3'

describe('utils/tierUrlV3', () => {
  it('should return the v3 tier url when tierUrlV3 is called with a crn', () => {
    expect(tierUrlV3('https://tier-dummy-url', 'X000001')).toEqual('https://tier-dummy-url/v3/case/X000001')
  })

  it('should return an empty string when tierUrlV3 is called with an empty crn', () => {
    expect(tierUrlV3('https://tier-dummy-url', '')).toEqual('')
  })
})
