export function createElement(tag, classes = [], attributes = {}) {
  const element = document.createElement(tag)

  // Додаємо класи
  if (classes.length > 0) {
    element.classList.add(...classes)
  }

  // Додаємо атрибути
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}


export function setText(element, text) {
  element.textContent = text
}

export function appendChildren(parent, ...children) {
  children.forEach(child => {
    if (child) {
      parent.appendChild(child)
    }
  })
}

export function clearElement(element) {
  element.innerHTML = ''
}

export function toggleElement(element, show) {
  element.style.display = show ? 'block' : 'none'
}

export function $(selector) {
  return document.querySelector(selector)
}

export function $$(selector) {
  return document.querySelectorAll(selector)
}
