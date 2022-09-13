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
                <div class="module_title">
                  
               
                  <span class="title"> 
                  ${this.props.category}
                  </span> 
                    <span class="module_dot"> • </span>
                   <span>
                   ${this.props.title}
                   
                   </span>

                </div>
              </div><div className="description_wrp">${this.props.description}</div>`,
        }}
      ></div>
    );
  }
}

export default DataComponent;
