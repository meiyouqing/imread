// var AppDispatcher = require('../dispatcher/AppDispatcher');

// var ButtonActions = {

//   addNewItem: function (text) {
//     AppDispatcher.dispatch({
//       actionType: 'ADD_NEW_ITEM',
//       text: text
//     });
//   },

// };

// module.exports = ButtonActions;

/**
 * BlocklistActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var BlocklistActions = {

  /**
   * @param  {object | array} data
   */
 getDataBlocklist: function() {
    AppDispatcher.dispatch({
      actionType: Constants.UPDATE_BLOCKLIST,
    });
  }


}

module.exports = BlocklistActions;