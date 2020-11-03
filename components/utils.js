const Button = ({text, className = '', size = ''}) =>
  `<button type="button" class="button ${className} ${size}">${text}</button>`;

module.exports = {
  Button,
};
