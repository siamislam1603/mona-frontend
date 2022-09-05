import React from 'react'
export class FullLoader extends React.Component {
  render() {
    return (
      <div className="fullloader-sec" style={ { display: this.props.loading?'flex':'none'} } >
        <img src="/img/loader.svg" alt="Loader"></img>
      </div>
		);
  }
}


