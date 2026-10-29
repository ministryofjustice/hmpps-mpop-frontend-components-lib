/* global document */
const MODULE_NAME = 'mpop-risk-flags-toggle'

/*
 * Show/hide toggle for the person header's NDelius risk flags (transactional variant).
 * The toggle is rendered hidden so that without JS the risk flags are always shown.
 * State is not persisted - the flags are hidden again on every page load.
 */

function setExpanded($toggle, $flags, expanded) {
  $toggle.setAttribute('aria-expanded', String(expanded))
  $toggle.replaceChildren($toggle.getAttribute(expanded ? 'data-hide-text' : 'data-show-text'))
  $flags.toggleAttribute('hidden', !expanded)
}

function initToggle($toggle) {
  const $flags = $toggle.parentElement.querySelector(`[id="${$toggle.getAttribute('aria-controls')}"]`)

  if (!$flags || $toggle.hasAttribute(`data-${MODULE_NAME}-init`)) {
    return
  }

  $toggle.setAttribute(`data-${MODULE_NAME}-init`, '')
  $toggle.addEventListener('click', () =>
    setExpanded($toggle, $flags, $toggle.getAttribute('aria-expanded') !== 'true'),
  )
  setExpanded($toggle, $flags, false)
  $toggle.removeAttribute('hidden')
}

export function init(scope = document) {
  scope.querySelectorAll(`[data-module="${MODULE_NAME}"]`).forEach(initToggle)
}
