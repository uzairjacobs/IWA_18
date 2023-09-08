import { TABLES, COLUMNS, state } from './data.js';


export const createOrderHtml = (order) => {
    const { id, title, table, created } = order

    const element = document.createElement('div')
    element.className = 'order'
    element.draggable = true
    element.dataset.id = id

    const hours = created.getHours().toString().padStart(2, '0')
    const minutes = created.getMinutes().toString().padStart(2, '0')

    element.innerHTML = /* html */ `
        <div class="order__title" data-order-title>${title}</div>
        
        <dl class="order__details">
            <div class="order__row">
                <dt>Table:</dt>
                <dd class="order__value" data-order-table>${table}</dd>
            </div>

            <div class="order__row">
                <dt>Ordered:</dt>
                <dd class="order__value">${hours}:${minutes}</dd>
            </div>
        </dl>
    `

    return element
}

const createTableOptionsHtml = () => {
    const fragment = document.createDocumentFragment()

    for (const singleTable of TABLES) {
        const option = document.createElement('option')
        option.value = singleTable
        option.innerText = singleTable
        fragment.appendChild(option)
    }

    return fragment
}

export const html = {
    columns: {},
    area: {},
    add: {
        overlay: document.querySelector('[data-add-overlay]'),
        form: document.querySelector('[data-add-form]'),
        cancel: document.querySelector('[data-add-cancel]'),
        title: document.querySelector('[data-add-title]'),
        table: document.querySelector('[data-add-table]'),
    },
    edit: {
        overlay: document.querySelector('[data-edit-overlay]'),
        form: document.querySelector('[data-edit-form]'),
        cancel: document.querySelector('[data-edit-cancel]'),
        title: document.querySelector('[data-edit-title]'),
        table: document.querySelector('[data-edit-table]'),
        id: document.querySelector('[data-edit-id]'),
        column: document.querySelector('[data-edit-column]'),
        delete: document.querySelector('[data-edit-delete]')
    },
    help: {
        overlay: document.querySelector('[data-help-overlay]'),
        cancel: document.querySelector('[data-help-cancel]'),
    },
    other: {
        grid: document.querySelector('[data-grid]'),
        help: document.querySelector('[data-help]'),
        add: document.querySelector('[data-add]'),
        order: document.querySelector('[data-order]'),
    }
}

for (const columnName of COLUMNS) {
    html.columns[columnName] = document.querySelector(`[data-column="${columnName}"]`)
    html.area[columnName] = document.querySelector(`[data-area="${columnName}"]`)
}


export const updateDraggingHtml = (newDragging) => {
    const { over = state.dragging.over } = newDragging

    for (const columnName of COLUMNS) {
        const value = columnName === over ? 'rgba(0, 160, 70, 0.2)' : ''
        html.area[columnName].style.backgroundColor = value
    }
}

export const moveToColumn = (id, newColumn) => {
    const htmlSource = document.querySelector(`[data-id="${id}"]`) 
    const duplicate = htmlSource.cloneNode(true)
    html.columns[newColumn].appendChild(duplicate)
    htmlSource.remove()
}

html.other.add.focus()


html.add.table.appendChild(createTableOptionsHtml())
html.edit.table.appendChild(createTableOptionsHtml())
