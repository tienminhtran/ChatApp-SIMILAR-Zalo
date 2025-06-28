import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RequestReceived from "../components/requestFriend/RequestReceived";
import RequestSent from "../components/requestFriend/RequestSent";
const Tab = createMaterialTopTabNavigator();

const TabTopFriendRequest = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Đã nhận" component={RequestReceived} />
      <Tab.Screen name="Đã gửi" component={RequestSent} />
    </Tab.Navigator>
  );
};

export default TabTopFriendRequest;
