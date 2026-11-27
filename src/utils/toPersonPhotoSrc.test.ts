import { toPersonPhotoSrc } from './toPersonPhotoSrc'

const prisonPhotoHref = (noms: string) => `/person-photo/${noms}`

describe('toPersonPhotoSrc', () => {
  it('uses the online check-in photo first', () => {
    expect(
      toPersonPhotoSrc({
        checkInPhotoUrl: 'https://photos.example.com/X000001.jpg',
        noms: 'A1234BC',
        hasPrisonPhoto: true,
        prisonPhotoHref,
      }),
    ).toBe('https://photos.example.com/X000001.jpg')
  })

  it('uses the prison photo when there is no online check-in photo', () => {
    expect(toPersonPhotoSrc({ checkInPhotoUrl: null, noms: 'A1234BC', hasPrisonPhoto: true, prisonPhotoHref })).toBe(
      '/person-photo/A1234BC',
    )
  })

  it('returns undefined when there is no prison photo', () => {
    expect(toPersonPhotoSrc({ noms: 'A1234BC', hasPrisonPhoto: false, prisonPhotoHref })).toBeUndefined()
  })

  it('returns undefined when there is no NOMS number', () => {
    expect(toPersonPhotoSrc({ noms: null, hasPrisonPhoto: true, prisonPhotoHref })).toBeUndefined()
  })
})
