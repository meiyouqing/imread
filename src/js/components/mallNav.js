import React from 'react';
import MallNavLink from './mallNavLink';

const MallNav = React.createClass({
  render() {
		// console.log('pageNav render');
		// var isYulan = /yulan=1/.test(window.location.search);
		// if(this.props.navList.length<2 && !isYulan) return <div></div>
    if (!this.props.navList || !this.props.navList.length) { return <i />; }
    return (
      <nav className="g-nav">
        <div className="m-nav f-flexbox" >
          {
						this.props.navList.map((v, i) => {
  const href = `page.${v.pgid}`;
  return (
    <MallNavLink to={`/mall/${href}`} key={i} className="f-flex1">{v.name}</MallNavLink>
  );
})
					}
        </div>
      </nav>
    );
  }
});

module.exports = MallNav;
