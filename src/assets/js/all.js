/* global document */
import * as personHeader from './person-header'

export function initAll(scope = document) {
  personHeader.init(scope)
}
