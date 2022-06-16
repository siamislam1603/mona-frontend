import React from 'react';

class DataComponent extends React.Component {
  render() {
    {
      console.log('this.props---->', this.props);
    }
    return (
      <div 
        className='print'
        dangerouslySetInnerHTML={{
          __html: `<div class="module_detail">
                <div class="image_banner">
                  <img src=${
                    this.props.cover_image
                      ? this.props.cover_image
                      : '../img/demo_image.png'
                  } alt="" />
                </div>
                <div class="module_title">
                  <h3>
                   ${this.props.category}
                  </h3>
                  <span>
                    <span class="module_dot"> • </span>
                    ${this.props.question}
                  </span>
                </div>
              </div>${this.props.answer}`,
        }}
      ></div>
    );
  }
}

export default DataComponent;
