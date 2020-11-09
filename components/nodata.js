const noData = (text) => `<div class="no-data">${text}</div>`;

const noDataTable = ({ colspan, text }) =>
  `<tr><td class="no-data-table" colspan="${colspan}">${text}</td></tr>`;

module.exports = { noData, noDataTable };
