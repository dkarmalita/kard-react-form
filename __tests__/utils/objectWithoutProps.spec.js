import { objectWithoutProps } from 'utils/objectWithoutProps.js'

describe('utils/objectWithoutProps', function () {
  const objA = { A:'a', B:'b', C:'c' }
  const result = objectWithoutProps( objA, ['A', 'B'])

  it('total array has to have expected quantity of elements', function () {
    expect( result ).toEqual( { C:'c' } )
  })
})

