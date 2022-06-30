exports.verifyPermission = (controller, action) => {

  let menuList = JSON.parse(localStorage.getItem('menu_list'));
  let permissions = JSON.parse(localStorage.getItem('user_permission'));

  let allow = false;

  for(let [key, value] of Object.entries(permissions)) {
    if(menuList[key]?.controller_name === controller) {
      console.log(`ID: ${menuList[key]?.id}\tCONTROLLER: ${menuList[key]?.controller_name}`);
      // eslint-disable-next-line no-loop-func
      value.forEach(v => {
        if(menuList[key]?.controller_actions[v-1]?.action_name === action) {
          console.log(`ID: ${menuList[key]?.controller_actions[v-1]?.id}\tACTION: ${menuList[key]?.controller_actions[v-1]?.action_name}`);
          console.log('THIS ACTION IS PRESENT');
          allow = true;
        }
      });
    }
  }

  return allow;
};