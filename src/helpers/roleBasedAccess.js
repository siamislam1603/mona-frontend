exports.verifyPermission = (given_controller, given_action) => {
  console.log('CONTROLLER:', given_controller);
  console.log('ACTION:', given_action);

  let menuList = JSON.parse(localStorage.getItem('menu_list'));
  // console.log('menuList:', menuList);
  let flag = false;

  menuList.forEach(menu => {
    console.log('MENU:', menu.controller.controller_name);
    console.log('MENU MATCHED:', menu.controller.controller_name === given_controller);
    if(menu.controller.controller_name === given_controller) {
      // console.log('REQUIRED CONTROLLER:', menu.controller.controller_name)
      menu.controller.actions.forEach(action => {
        // console.log('PRINTING ACTION:', action)
        if(action.action_name === given_action) {
          flag = true;
        }
      })
    }
  });

  return flag;
};