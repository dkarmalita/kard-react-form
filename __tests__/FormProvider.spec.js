import { mount } from 'enzyme';

import React, { Component } from 'react'
import { FormProvider, withFormContext } from 'FormProvider'

// >> -------------------------------------------------------------------------

  const testFieldName = 'testField'
  const testInitialValue = 'test value'
  const testStateUpdate = {
    value: 'updated value',
    dirty: false,
    errors: [],
    valid: true,
    touched: false,
    focused: false,
    reset: jest.fn()
  }
  const setStateCb = jest.fn()

// ----------------------------------------------------------------------------

  let ref = null
  let lastFormProviderOnChange = null

  class TestProbeComponent extends Component {
    constructor(props){
      super(props)
      ref = this
    }
    render(){
      return null
    }
  }

  const TestProbe = withFormContext(TestProbeComponent)

// << -------------------------------------------------------------------------

describe('FormProvider', function () {

  const wrapper = mount(
    <FormProvider
      initialValue={{
        [testFieldName]: testInitialValue
      }}>
      <TestProbe />
    </FormProvider>
  );

  const instance = wrapper.instance();
  const formLink = ref.props.formLink

  it('getFieldInitialValue', function () {
    expect( formLink.getFieldInitialValue(testFieldName) )
    .toEqual(testInitialValue)
  })

  it('set/getFieldState (no cb)', function () {
    formLink.setFieldState(testFieldName, testStateUpdate)
    expect( formLink.getFieldState(testFieldName) )
    .toEqual(testStateUpdate)
  })

  it('setFieldState (cb)', function () {
    formLink.setFieldState(testFieldName, testStateUpdate, setStateCb)
    expect( setStateCb ).toHaveBeenCalled()
  })

  it('getFormState', function () {
    expect( formLink.getFormState() )
    .toEqual( { dirty: false, touched: false, valid: false } )
  })

  it('getFormValue', function () {
    expect( formLink.getFormValue() )
    .toEqual( { testField: 'updated value' } )
  })

  it('getFieldsState', function () {
    expect( formLink.getFieldsState() )
    .toEqual( { [testFieldName]: testStateUpdate } )
  })

  it('reset', function () {
    formLink.resetForm()
    expect( testStateUpdate.reset ).toHaveBeenCalled()
  })
})

describe('FormProvider (alternative cases)', function () {

  const wrapper = mount(
    <FormProvider
      onChange={ (x) => lastFormProviderOnChange = x }
    >
      <TestProbe />
    </FormProvider>
  );

  const formLink = ref.props.formLink
  const instance = wrapper.instance();

  it('getFieldInitialValue (no one)', function () {
    expect( formLink.getFieldInitialValue(testFieldName) )
    .toEqual(undefined)
  })

  it('handling onChange of FormProvider', function () {
    formLink.setFieldState(testFieldName, testStateUpdate)
    expect( lastFormProviderOnChange )
    .toEqual({ [testFieldName]: testStateUpdate })
  })

})
