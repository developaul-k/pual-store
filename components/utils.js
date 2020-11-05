const Button = ({
  type = 'button',
  text,
  className = '',
  size = '',
  isDisabled = '',
  attrs = '',
}) =>
  `<button type="${type}" class="button ${className} ${size}" ${isDisabled} ${attrs}>${text}</button>`;

module.exports = {
  Button,
};
