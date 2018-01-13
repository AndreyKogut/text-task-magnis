const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Sell on click event
const cellOnClick = (date) => alert(`${months[+date.getMonth()]}, ${date.getDate()}`);

// Generate rows to work with
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

// Add items full week wasn't filled with dates
const transformRowItems = (row) => {
  const firstDay = row[0].value.getDay();
  const emptyItemsCount = 7 - row.length;

  let transformedRows = row;

  for (let i = 0; i < emptyItemsCount; i++) {
    transformedRows[firstDay === 0 ? 'push': 'unshift']({
      text: `${firstDay === 0 ? 'Next' : 'Previous'} month`,
    });
  }

  return transformedRows;
};

// Set elem attributes
const setAttributes = (element, attributes = {}) =>
  Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

// Create element with text
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

const transformDate = (date, modify) => {
  const transformDate = new Date(date);

  transformDate.setMonth(+transformDate.getMonth() + modify);

  return transformDate;
};

// Initialize controls
const addHeaderControls = (parentElement, date, updateCalendar) => {
  const calendarTitle = createElement(
    'span',
    `${date.getFullYear()}, ${months[+date.getMonth()]}`,
    null,
    { class: 'table-title' },
  );

  const previousMonthDate = transformDate(date, -1);

  const backButton = createElement(
    'button',
    '< Previous',
    updateCalendar.bind(null, previousMonthDate.getFullYear(), +previousMonthDate.getMonth() + 1),
    { class: 'reset-default table-button' }
  );

  const nextMonthDate = transformDate(date, 1);

  const nextButton = createElement(
    'button',
    'Next >',
    updateCalendar.bind(null, nextMonthDate.getFullYear(), +nextMonthDate.getMonth() + 1),
    { class: 'reset-default table-button' }
  );

  createContainerElement(
    parentElement,
    'div',
    [backButton, calendarTitle, nextButton],
    { class: 'table-controls' },
  );
};

// Initialize calendar
const initCalendar = (event, year, month) => {
  event.preventDefault();

  const calendarElement = document.getElementById('calendar');
  calendarElement.innerHTML = null;

  const calendarInnerContainer = createContainerElement(calendarElement, 'div', [], {
    class: 'calendar-inner',
  });

  addHeaderControls(calendarInnerContainer, new Date(year, +month - 1), (selectedYear, selectedMonth) => {
    initCalendar(event, selectedYear, selectedMonth);
  });

  createContainerElement(
    calendarInnerContainer,
    'div',
    daysOfTheWeek.map(elem => createElement('div', elem, null, {
      class: 'table-cell table-cell--header',
    })),
    { class: 'table-row table-row--header' },
  );

  generateRows(year, +month - 1).forEach((row) => {
    createContainerElement(
      calendarInnerContainer,
      'div',
      transformRowItems(row).map(({ text, value, onClick }) =>
        createElement('div', text ? text: value.getDate(), onClick, {
          class: `table-cell ${!onClick && 'table-cell--disabled'}`,
        })),
      { class: 'table-row' },
    );
  });

  calendarElement.scrollIntoView({block: "end", behavior: "smooth"});
};
