import axios from 'axios';

const appInitilize = '.app';
const API_CATEGORY_LINK = 'https://www.lionsbet.com/rest/market/categories';

function buildTemplate(element, parent) {
  $(element).each(function () {
    let element = this;
    let name = this.categoryName + ' - ' + this.level;
    let attachedElement = this.level >= 3 ? '' : `<div class="count">${this.eventsCount}</div>`;
    let listItem = $(`<li class="mainNavigation scope-${this.level}" data-category="${this.categoryId}" data-level="${this.level}">
                        <div class="name"><b>${this.categoryName}</b> ${attachedElement}</div>
                      </li>`);
    if (this.hasOwnProperty("children") && this.children.length) {
      let tree = $("<ul />", {class: 'child'});
      buildTemplate(this.children, tree);
      listItem.append(tree)
    }

    parent.append(listItem);
  });
}

const easeWayCollect = (el, data) => {
  let tree = [];
  let childCategory = {};
  let item, id, parrentCategory, navigation;
  let ulElement = $("<ul />", {class: 'navigation'});

  $(el).append(ulElement);
  navigation = $(el).find('.navigation');

  data.sort(function (obj1, obj2) {
    return obj1.sortOrder - obj2.sortOrder;
  });
  for (let i = 0, length = data.length; i < length; i++) {
    item = data[i];
    id = item['categoryId'];
    parrentCategory = item['parentCategory'] || 0;
    childCategory[id] = childCategory[id] || [];
    item['children'] = childCategory[id];

    if (parrentCategory !== 0) {
      childCategory[parrentCategory] = childCategory[parrentCategory] || [];
      childCategory[parrentCategory].push(item);
    } else {
      tree.push(item);
    }
  }

  buildTemplate(tree, $(navigation));
  return tree;
};

$(appInitilize).on('click', function (e) {
  e.preventDefault();
});
$(appInitilize).on('click', '.navigation li.mainNavigation', (e) => {
  let item = $(e.target);
  let parent = item.parent().closest('li');
  let childUl = $(parent).children('ul');
  e.stopPropagation();

  parent.toggleClass('active');
  childUl.stop().slideToggle('normal');
});

const loaderInit = (data) => {
  let frameLoader = $("<div />", {class: 'frame-loader navLoader'});
  let frameLoaderCount = 12;

  if (data === true) {
    $(appInitilize).append(frameLoader);

    for (let i = 0; i < frameLoaderCount; i++) {
      let frame = frameLoaderCount[i];
      frameLoader.append(`<div class="line">
        <div class="animate-frame name"></div>
        <div class="animate-frame count"></div>
      </div>`);
    }
  } else if (data === false) {
    $('.frame-loader').remove();
  }
};

loaderInit(true);

const getCategory = axios.get(API_CATEGORY_LINK)
  .then(resp => {
    setTimeout(() => {
      loaderInit(false);
      easeWayCollect(appInitilize, resp['data'].data);
    }, 250);
  });
