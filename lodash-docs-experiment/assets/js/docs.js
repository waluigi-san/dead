var filterElem = document.getElementById('name-filter'),
    tocElems = document.querySelectorAll('.toc-container .func'),
    toggleNavElem = document.getElementById('open-nav');

function filterToc() {
  var nameFilter = filterElem.value.toLowerCase();
  _.each(tocElems, function(elem) {
    var name = elem.getAttribute('data-name').toLowerCase(),
        category = elem.getAttribute('data-category').toLowerCase(),
        matches = strIn(nameFilter, name) || nameFilter == category;

    elem.style.display = matches ? '' : 'none';
  });
}

function gotoFirst() {
  if (_.trim(filterElem.value) == '') {
    return;
  }

  var func = _.find(tocElems, 'offsetParent');
  if (func) {
    // Hash change blurs input, put focus back to input
    window.onhashchange = function() {
      filterElem.focus();
      window.onhashchange = null;
    };
    location.hash = func.getAttribute('data-name');
  }
}

function strIn(a, b) {
  return b.indexOf(a) >= 0;
}

function closeNav() {
  toggleNavElem.checked = false;
}

function onClick(event) {
  var target = event.target;

  if (
    target.tagName.toLowerCase() == 'a' &&
    target.getAttribute('href').charAt(0) == '#'
  ) {
    closeNav();
  }
}

function keypress(e) {
  // ENTER
  if (e.which == 13) {
    gotoFirst();
  }
}

document.body.onclick = onClick;
filterElem.oninput = filterToc;
filterElem.onkeypress = keypress;
