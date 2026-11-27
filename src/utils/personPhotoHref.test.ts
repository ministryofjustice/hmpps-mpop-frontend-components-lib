import { PERSON_PHOTO_PATH, personPhotoHref } from './personPhotoHref'

describe('personPhotoHref', () => {
  it('builds the prison photo route for a NOMS number', () => {
    expect(personPhotoHref('A1234BC')).toBe('/person-photo/A1234BC')
  })

  it('encodes the NOMS number', () => {
    expect(personPhotoHref('A1/2')).toBe('/person-photo/A1%2F2')
  })

  it('matches the route path', () => {
    expect(PERSON_PHOTO_PATH).toBe('/person-photo/:nomsNumber')
  })
})
