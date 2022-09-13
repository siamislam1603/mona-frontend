import React from 'react';

class DataComponent extends React.Component {
  render() {
    {
      console.log('this.props---->', this.props.description,this.props);
    }
    return (
      <div
        className="print"
        dangerouslySetInnerHTML={{
          __html: `<div className="module_detail">
                <div className="image_banner">
                  ${this.props.cover_image && `<img src=${
                    this.props.cover_image
                    
                } alt="" />`} 
                </div>
                ${this.props.cover_image && `<br />`}
                <div className="module_title">
                  
               
                  <span className="title"> 
                  ${this.props.category}
                  </span> 
                    <span className="module_dot"> • </span>
                   
                    ${this.props.title}

                </div>
              </div><div className="description_wrp">${this.props.description}</div>`,
        }}
      ></div>
    );
  }
}

export default DataComponent;
