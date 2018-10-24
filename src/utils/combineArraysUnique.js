// @kard js snippet
/**
 * Add elements from arrB to arrA. Each element is addad only if
 * is absent in the arrA.
 * @param  {Array} arrA - array of unique errors ids
 * @param  {Array} arrB - array of unique errors ids to add to errorsBuffer
 * @return {Array]} - combined array of errors
 */
export const combineArraysUnique = ( a1 = [], a2 = []) => {
  const acc = []// .concat( arrA )

  const addEl = ( el ) => { if( !~acc.indexOf( el )){ acc.push( el ) } }

  // Add only items are not in the list yet
  a1.forEach( addEl )

  // Add only items are not in the list yet
  a2.forEach( addEl )

  return acc
}
