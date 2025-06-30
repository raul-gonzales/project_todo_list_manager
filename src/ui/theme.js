const root = document.documentElement;

function getRandomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
}

const variables = [
  "--first", "--second", "--third", "--fourth", "--fifth",
  "--sixth", "--seventh", "--eighth", "--ninth", "--tenth"
];

variables.forEach(name => {
  root.style.setProperty(name, getRandomColor());
});
