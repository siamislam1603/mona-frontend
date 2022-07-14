import React from 'react';

class DataComponent extends React.Component {
  render() {
    {
      console.log('this.props---->', this.props);
    }
    return (
      <div
        className="print"
        dangerouslySetInnerHTML={{
          __html: `<div class="module_detail">
                <div class="image_banner">
                  ${this.props.cover_image && `<img src=${
                    this.props.cover_image
                    
                } alt="" />`} 
                </div>
                <div class="module_title">
                  <h3>
                   ${this.props.category}
                  </h3>
                  <span>
                    <span class="module_dot"> • </span>
                    ${this.props.title}
                  </span>
                </div>
              </div>${this.props.description}`,
        }}
      ></div>
    );
  }
}

export default DataComponent;
