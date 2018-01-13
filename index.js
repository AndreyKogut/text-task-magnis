const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const cellOnClick = (date) => {
  console.log(date);
};

const generateRows = (year, month) => {
  const date = new Date(year, month, 1);
  const rows = [];
  let row = [];

  while (date.getMonth() === month) {
    const iterationDate = new Date(date);

    row.push({ value: iterationDate, onClick: cellOnClick.bind(null, iterationDate) });

    date.setDate(date.getDate() + 1);
    if (date.getDay() === 0 || date.getMonth() !== month) {
      rows.push(row);
      row = [];
    }
  }

  return rows;
};

const transformRowItems = (row) => {
  const firstDay = row[0].value.getDay();
  const emptyItemsCount = 7 - row.length;

  let transformedRows = row;

  for (let i = 0; i < emptyItemsCount; i++) {
    transformedRows[firstDay === 0 ? 'push': 'unshift']({ text: `${firstDay === 0 ? 'Next' : 'Previous'} month`});
  }

  return transformedRows;
};

const setAttributes = (element, attributes = {}) =>
  Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

const createElement = (name, innerText, onclick, attributes = {}) => {
  const element = document.createElement(name);

  element.innerText = innerText;
  setAttributes(element, attributes);
  if (onclick) {
    element.addEventListener('click', onclick);
  }
  return element;
};

// Create item with inner html
const createContainerElement = (parentElement, elementName, rowItems, attributes = {}) => {
  const rowElement = createElement(elementName, null, null, attributes);
  rowElement.innerHTML = null;

  rowItems.forEach(item => rowElement.appendChild(item));
  setAttributes(rowElement, attributes);
  parentElement.appendChild(rowElement);

  return rowElement;
};

// Initialize calendar
const initCalendar = (event, year, month) => {
  event.preventDefault();

  const calendarElement = document.getElementById('calendar');

  createContainerElement(
    calendarElement,
    'div',
    daysOfTheWeek.map(elem => createElement('div', elem, null, {
      class: 'table-cell',
    })),
    { class: 'table-row' },
  );

  generateRows(year, +month - 1).forEach((row) => {
    createContainerElement(
      calendarElement,
      'div',
      transformRowItems(row).map(({ text, value, onClick}) =>
        createElement('div', text ? text: value.toDateString(), onClick, { class: 'table-cell' })),
      { class: 'table-row' },
    );
  })
};
