const Button = ({
  type = 'type="button"',
  text,
  className = '',
  size = '',
  isDisabled = '',
  attrs = '',
}) =>
  `<button ${type} class="button ${className} ${size}" ${isDisabled} ${attrs}>${text}</button>`;

module.exports = {
  Button,
};
