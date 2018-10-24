// @kard js snippet
/**
 * Return an object copy without listed props
 * @param  {Object}           obj  - object to clone
 * @param  {Array of Strings} keys - list of props to remove
 * @return {Object} - the object clone without the listed props in it
 */
export function objectWithoutProps( obj, keys ){
  var target = {}
  for( var i in obj ){
    if( keys.indexOf( i ) >= 0 ) continue
    target[i] = obj[i]
  }
  return target
}
