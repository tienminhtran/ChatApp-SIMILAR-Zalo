import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PhoneBookFriend from "../components/PhoneBookFriend";
import PhoneBookGroup from "../components/PhoneBookGroup";
import PhoneBookOA from "../components/PhoneBookOA";
const Tab = createMaterialTopTabNavigator();

const TabTopCategoryPhoneBook = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Bạn bè" component={PhoneBookFriend} />
      <Tab.Screen name="Nhóm" component={PhoneBookGroup} />
      <Tab.Screen name="OA" component={PhoneBookOA} />
    </Tab.Navigator>
  );
};

export default TabTopCategoryPhoneBook;
