// Compares two arrays of a simple type values
export const arraysEqual = ( a1, a2 ) => a1.length === a2.length && a1.every(( v, i ) => v === a2[i])
