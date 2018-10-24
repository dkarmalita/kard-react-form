import { combineArraysUnique } from 'utils/combineArraysUnique'

describe('utils/combineArraysUnique', function () {
  const arrA = ['A', 'A', 'B', 'B', 'D']
  const arrB = ['B', 'B', 'C', 'C', 'E']
  const result = combineArraysUnique( arrA, arrB )

  it('combine empty arrays', function () {
    expect( combineArraysUnique() ).toEqual([])
  })

  it('total array has to have expected quantity of elements', function () {
    expect( result.length ).toBe( 5 )
  })

  it('total array has to have expected content', function () {
    expect( result ).toEqual( ['A', 'B', 'D', 'C', 'E'] )
  })
})
