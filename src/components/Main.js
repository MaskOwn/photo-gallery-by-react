require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 引入图片数据
let imageDatas = require('../data/imageDatas.json');

// 获取真实图片路径，根据图片名转成真实绝对路径
imageDatas = (function geneImageURL(imgArr) {
  for (let i = 0, j = imgArr; i < j; i++) {
    let img = imgArr[i];
    img.imageURL = require('../images/' + img.fileName);
    imgArr[i] = img;
  }
  return imgArr;
})(imageDatas);

// 组件化
class AppComponent extends React.Component {
  render() {
    return (
      <section className='stage'>
        <section className='img-sec'>112</section>
        <nav className='controller-nav'>111</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
