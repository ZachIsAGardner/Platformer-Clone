const createFile = (value) => {
  var textFile = null;
  const makeTextFile = () => {
    var data = new Blob([value], {type: 'text/javascript'});

    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };

  var create = document.getElementById('create');
  var textbox = document.getElementById('textbox');

  create.addEventListener('click', () => {
    var link = document.getElementById('downloadlink');
    link.href = makeTextFile();
    link.style.display = 'block';
  }, false);
};

module.exports = createFile;
