/* global document */
import * as personHeader from './person-header.js'

export function initAll(scope = document) {
  personHeader.init(scope)
}
