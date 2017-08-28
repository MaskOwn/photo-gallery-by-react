require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 引入图片数据
let imageDatas = require('../data/imageDatas.json');

// 获取真实图片路径，根据图片名转成真实绝对路径
imageDatas = (function geneImageURL(imgArr) {
  for (let i = 0, j = imgArr.length; i < j; i++) {
    let img = imgArr[i];
    img.imageURL = require('../images/' + img.fileName);
    imgArr[i] = img;
  }
  return imgArr;
}(imageDatas));

// console.log(imageDatas);

/*
* 获取随机数
* */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

// 图片组件
class ImgFigure extends React.Component {
  render() {
    let styleObj = this.props.arrange;

    return (
      <figure className="img-figure"  style={styleObj} >
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

// 组件化
class AppComponent extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      imgsArrangeArr: [
          /*{
        pos: {
          left: '0',
          top: '0'
        }
      }*/
      ]
    };

    // 声明一个常量用来保存图片的位置信息
    this.Constant = {
      centerPos: { // 中心点
        left: 0,
        top: 0
      },
      hPosRange: { // 水平范围，包括左分区和右分区
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { // 上分区的取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    }
  }

  /*
  * 重新布局所有图片
  * @param centerIndex 指定居中排布哪个图片
  * */
  reArrange(centerIndex) {
    // 获取所有状态图片
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        // 声明一个数组来接收上方元素
        imgsArrangeTopArr = [],
        // 随机取上方的元素0或1个
        topImgNum = Math.ceil(Math.random() * 2),
        // 随机元素的位置
        topImgSpliceIndex = 0,

        // 声明一个数组来接收中心元素
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 中心图片首先居中
    imgsArrangeCenterArr[0].pos = centerPos;

    // 获取一个顶部或者0个图片
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上方的图片
    imgsArrangeTopArr.forEach((item, idx) => {
      imgsArrangeTopArr[idx].pos = {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      };
    });

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORR = null;

      // 前半部分为左分区，右半部分为有分区
      if (i < k) {
        hPosRangeLORR = hPosRangeLeftSecX;
      } else {
        hPosRangeLORR = hPosRangeRightSecX;
      }
      imgsArrangeArr[i].pos = {
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORR[0], hPosRangeLORR[1])
      };
    }


    // 把两个数组拼凑回来
    if (topImgNum) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    // 重新改变状态
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  /*
  * 组件加载以后，初始化位置信息的范围
  * */
  componentDidMount() {

    // 拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
       // 不包括滚动条，大小随内容变化，与clientWidth、offsetWidth区分
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 拿到imgFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左分区和右分区
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上分区
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH ;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    // 排序
    this.reArrange(0);
  }

  render() {
    // 传参给子组件
    let controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach( (imgData, idx) => {

      let _this = this;
      // 初始化不存在的图片对象
      if (!_this.state.imgsArrangeArr[idx]) {
        _this.state.imgsArrangeArr[idx] = {
          pos: {
            left: '0',
            top: '0'
          }
        };
      }

      imgFigures.push(<ImgFigure data={imgData} ref={'imgFigure' + idx} arrange={_this.state.imgsArrangeArr[idx].pos} />);
    }); // bind(this)绑定到当前对象，而不是imageDatas

    return (
      <section className='stage' ref="stage">
        <section className='img-sec'>
          {imgFigures}
        </section>
        <nav className='controller-nav'>导航按钮</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
