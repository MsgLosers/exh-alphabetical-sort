// ==UserScript==
// @name exh-alphabetical-sort
// @version 1.0.0
// @author Michael Serajnik
// @description Userscript to sort ExH results alphabetically
// @website https://github.com/mserajnik/exh-alphabetical-sort
// @updateURL https://github.com/mserajnik/exh-alphabetical-sort/raw/master/exh-alphabetical-sort.user.js
// @downloadURL https://github.com/mserajnik/exh-alphabetical-sort/raw/master/exh-alphabetical-sort.user.js
// @supportURL https://github.com/mserajnik/exh-alphabetical-sort/issues/new
// @match *://exhentai.org/*
// ==/UserScript==

/*!
 * exh-alphabetical-sort
 * Copyright (C) 2019  Michael Serajnik  https://mserajnik.dev
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const elementFromHtml = html => {
  const template = document.createElement('template')
  html = html.trim()
  template.innerHTML = html

  return template.content.firstChild
}

const start = () => {
  if (!document.querySelector('.ip')) {
    return
  }

  const originalResults = document.querySelector('.itg.gld')
  const dropdowns = document.getElementById('dms')

  if (!(originalResults && dropdowns)) {
    return
  }

  const copiedResults = originalResults.cloneNode(true)

  let originalResultNodes = originalResults.querySelectorAll('.gl1t')
  originalResultNodes = Array.prototype.slice.call(
    originalResultNodes
  )

  for (const result of originalResultNodes) {
    result.classList.add('result--original')
  }

  let copiedResultNodes = copiedResults.querySelectorAll('.gl1t')
  copiedResultNodes = Array.prototype.slice.call(
    copiedResultNodes
  )

  copiedResultNodes = copiedResultNodes.sort((a, b) => {
    const nameA = a.querySelector('.glname').textContent.toUpperCase()
    const nameB = b.querySelector('.glname').textContent.toUpperCase()

    if (nameA < nameB) {
      return -1
    }

    if (nameA > nameB) {
      return 1
    }

    return 0
  })

  for (const result of copiedResultNodes) {
    result.classList.add('result--alphabetical')
    result.style.cssText = 'display: none;'

    originalResults.insertAdjacentElement('beforeend', result)
  }

  const sortDropdownContainer = elementFromHtml(
    `<div class="sort-dropdown">
      <style>
        .sort-dropdown {
          float: left !important;
          margin-left: 6px;
        }
      </style>
      <select>
        <option value="default">Default sort</option>
        <option value="alphabetical">Alphabetical sort</option>
      </select>
    </div>`
  )

  dropdowns.insertAdjacentElement('afterbegin', sortDropdownContainer)

  const sortDropdown = document.querySelector('.sort-dropdown select')

  sortDropdown.addEventListener('change', event => {
    switch (event.target.value) {
      case 'default':
        for (const result of copiedResultNodes) {
          result.style.cssText = 'display: none;'
        }

        for (const result of originalResultNodes) {
          result.style.cssText = ''
        }

        break
      case 'alphabetical':
        for (const result of originalResultNodes) {
          result.style.cssText = 'display: none;'
        }

        for (const result of copiedResultNodes) {
          result.style.cssText = ''
        }

        break
    }
  })
}

(() => {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'loaded' ||
    document.readyState === 'interactive'
  ) {
    start()

    return
  }

  window.addEventListener('DOMContentLoaded', () => {
    start()
  })
})()
