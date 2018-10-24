import { configure } from 'enzyme'
import Adapter from './fixed/ReactSixteenAdapter'

configure({ adapter: new Adapter() })
