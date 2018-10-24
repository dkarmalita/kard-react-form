// @kard js snippet
/**
 * objectsEqual Deeply chack two objects for equality
 * idea: https://stackoverflow.com/a/16788517
 * @param  {Object}  x - the first object to compare
 * @param  {Object}  y - the second object to compare
 * @return {Boolean} - true when objects equal, false in another case
 */
export function objectsEqual( x, y ){
  if( x === null || x === undefined || y === null || y === undefined ){ return x === y }

  // after this just checking type of one would be enough
  if( x.constructor !== y.constructor ){ return false }

  // if they are functions, they should exactly refer to same one (because of closures)
  if( x instanceof Function ){ return x === y }

  // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
  if( x instanceof RegExp ){ return x === y }
  if( x === y || x.valueOf() === y.valueOf()){ return true }
  if( Array.isArray( x ) && x.length !== y.length ){ return false }

  // if they are dates, they must had equal valueOf
  if( x instanceof Date ){ return false }

  // if they are strictly equal, they both need to be object at least
  if( !( x instanceof Object )){ return false }
  if( !( y instanceof Object )){ return false }

  // recursive object equality check
  var p = Object.keys( x )
  return Object.keys( y ).every( function( i ){ return p.indexOf( i ) !== -1 })
        && p.every( function( i ){ return objectsEqual( x[i], y[i]) })
}
