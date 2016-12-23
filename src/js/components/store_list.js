import React from 'react';
import Ajax from '../modules/ajax';
import mixins from '../modules/mixins';
import Book10 from './book10';
import Loading from './loading';

const StoreList = React.createClass({
  mixins: [mixins()],
  scrollPagesNo: 1,
  getInitialState() {
    return {
      noMore: false,
      scrollUpdate: false,
      onerror: false,
      list: []
    };
  },
  getList() {
    const pid = this.props.data.id;
    const AJAX = new Ajax(`block.${pid}.9.${this.scrollPagesNo}`);
    AJAX.get((data) => {
      if (data.content.length < 1)	{
        this.setState({ noMore: true });
        return;
      }
      this.setState({
        list: this.state.scrollUpdate ? this.state.list.concat(data.content) : data.content,
        scrollUpdate: false
      });
    }, this.onerror);
  },
  componentDidMount() {
    this.setState({ list: this.props.data.contentlist });
  },
  componentDidUpdate(nextProp) {
    this.lazyloadImage(this.refs.contain, true);
  },
  render() {
    let sLoading = <Loading cls="u-sLoading transparent" />;

    if (this.state.noMore) {
      sLoading = null;
    }

    return (
      <section className="m-block  g-scroll" onScroll={this.scrollHandle} ref="contain">
        <div className="content">
          <ul className="f-clearfix subCat-14">
            {
                this.state.list.map((v, i) => <Book10 key={i} data={v} />)
            }
          </ul>
          {sLoading}
        </div>
      </section>
    );
  }

});

module.exports = StoreList;
