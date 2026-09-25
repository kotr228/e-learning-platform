/**
 * Система нотифікацій (Bootstrap Toast)
 */

import { createElement, setText, appendChildren } from './dom.js'

export function showNotification(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3'
    toastContainer.style.zIndex = '9999'
    document.body.appendChild(toastContainer)
  }

  const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info'

  const toastEl = createElement('div', ['toast', 'align-items-center', 'text-white', bgColor, 'border-0'])
  toastEl.setAttribute('role', 'alert')
  toastEl.setAttribute('aria-live', 'assertive')
  toastEl.setAttribute('aria-atomic', 'true')

  const toastBody = createElement('div', ['d-flex'])
  const messageDiv = createElement('div', ['toast-body'])
  setText(messageDiv, message)

  const closeBtn = createElement('button', ['btn-close', 'btn-close-white', 'me-2', 'm-auto'])
  closeBtn.type = 'button'
  closeBtn.setAttribute('data-bs-dismiss', 'toast')
  closeBtn.setAttribute('aria-label', 'Close')

  appendChildren(toastBody, messageDiv, closeBtn)
  toastEl.appendChild(toastBody)
  toastContainer.appendChild(toastEl)

  const toast = new window.bootstrap.Toast(toastEl, {
    autohide: true,
    delay: 3000
  })

  toast.show()

  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove()
  })
}
