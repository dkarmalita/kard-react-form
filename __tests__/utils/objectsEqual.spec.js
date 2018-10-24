import { objectsEqual } from 'utils/objectsEqual'

const assert = { isTrue: function (x) { expect(x).toBeTruthy() }, isFalse: function (x) { expect(x).toBeFalsy(); } }

describe('utils/objectsEqual', function () {
  it('whole set of usecases', function () {
    assert.isTrue(objectsEqual(null,null));
    assert.isFalse(objectsEqual(null,undefined));
    assert.isFalse(objectsEqual(/abc/, /abc/));
    assert.isFalse(objectsEqual(/abc/, /123/));
    var r = /abc/;
    assert.isTrue(objectsEqual(r, r));

    assert.isTrue(objectsEqual("hi","hi"));
    assert.isTrue(objectsEqual(5,5));
    assert.isFalse(objectsEqual(5,10));

    assert.isTrue(objectsEqual([],[]));
    assert.isTrue(objectsEqual([1,2],[1,2]));
    assert.isFalse(objectsEqual([1,2],[2,1]));
    assert.isFalse(objectsEqual([1,2],[1,2,3]));

    assert.isTrue(objectsEqual({},{}));
    assert.isTrue(objectsEqual({a:1,b:2},{a:1,b:2}));
    assert.isTrue(objectsEqual({a:1,b:2},{b:2,a:1}));
    assert.isFalse(objectsEqual({a:1,b:2},{a:1,b:3}));

    assert.isTrue(objectsEqual({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}));
    assert.isFalse(objectsEqual({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:27}}));

    Object.prototype.equals = function (obj) { return objectsEqual(this, obj); };
    var assertFalse = assert.isFalse,
        assertTrue = assert.isTrue;

    assertFalse({}.equals(null));
    assertFalse({}.equals(undefined));

    assertTrue("hi".equals("hi"));
    assertTrue(new Number(5).equals(5));
    assertFalse(new Number(5).equals(10));
    assertFalse(new Number(1).equals("1"));

    assertTrue([].equals([]));
    assertTrue([1,2].equals([1,2]));
    assertFalse([1,2].equals([2,1]));
    assertFalse([1,2].equals([1,2,3]));
    assertTrue(new Date("2011-03-31").equals(new Date("2011-03-31")));
    assertFalse(new Date("2011-03-31").equals(new Date("1970-01-01")));

    assertTrue({}.equals({}));
    assertTrue({a:1,b:2}.equals({a:1,b:2}));
    assertTrue({a:1,b:2}.equals({b:2,a:1}));
    assertFalse({a:1,b:2}.equals({a:1,b:3}));

    assertTrue({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}.equals({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}));
    assertFalse({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}.equals({1:{name:"mhc",age:28}, 2:{name:"arb",age:27}}));

    var a = {a: 'text', b:[0,1]};
    var b = {a: 'text', b:[0,1]};
    var c = {a: 'text', b: 0};
    var d = {a: 'text', b: false};
    var e = {a: 'text', b:[1,0]};
    var i = {
        a: 'text',
        c: {
            b: [1, 0]
        }
    };
    var j = {
        a: 'text',
        c: {
            b: [1, 0]
        }
    };
    var k = {a: 'text', b: null};
    var l = {a: 'text', b: undefined};

    assertTrue(a.equals(b));
    assertFalse(a.equals(c));
    assertFalse(c.equals(d));
    assertFalse(a.equals(e));
    assertTrue(i.equals(j));
    assertFalse(d.equals(k));
    assertFalse(k.equals(l));

    // from comments on stackoverflow post
    assert.isFalse(objectsEqual([1, 2, undefined], [1, 2]));
    assert.isFalse(objectsEqual([1, 2, 3], { 0: 1, 1: 2, 2: 3 }));
    assert.isFalse(objectsEqual(new Date(1234), 1234));

    // no two different function is equal really, they capture their context variables
    // so even if they have same toString(), they won't have same functionality
    var func = function (x) { return true; };
    var func2 = function (x) { return true; };
    assert.isTrue(objectsEqual(func, func));
    assert.isFalse(objectsEqual(func, func2));
    assert.isTrue(objectsEqual({ a: { b: func } }, { a: { b: func } }));
    assert.isFalse(objectsEqual({ a: { b: func } }, { a: { b: func2 } }));
  })
})
