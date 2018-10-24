import { arraysEqual } from 'utils/arraysEqual'

describe('utils/arraysEqual', function () {
  const arrA = ['A', 'A', 'B', 'B', 'D']
  const arrB = ['A', 'A', 'B', 'B', 'D']
  const arrC = ['A', 'A', 'B']
  const arrD = ['A', 'B', 'A', 'B', 'D']

  it('two arrays equal case', function () {
    expect( arraysEqual(arrA,arrB) ).toBeTruthy()
  })

  it('two arrays different content case', function () {
    expect( arraysEqual(arrA,arrC) ).toBeFalsy()
  })

  it('two arrays different order case', function () {
    expect( arraysEqual(arrA,arrD) ).toBeFalsy()
  })
})
