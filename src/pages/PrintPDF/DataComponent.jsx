import React from 'react';


  
class DataComponent extends React.Component {
    render() {
      return (
        <div
            dangerouslySetInnerHTML={{
                __html: `${this.props.answer}`,
            }}
        ></div>       
      );
    }
  }

  export default DataComponent;