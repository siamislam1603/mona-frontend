exports.verifyPermission = (controller, given_action) => {

  let menuList = JSON.parse(localStorage.getItem('menu_list'));
  let flag = false;

  menuList.forEach(menu => {
    if(menu.controller.controller_name === controller) {
      menu.controller.actions.forEach(action => {
        if(action.action_name === given_action) {
          flag = true;
        }
      })
    }
  });

  return flag;
};