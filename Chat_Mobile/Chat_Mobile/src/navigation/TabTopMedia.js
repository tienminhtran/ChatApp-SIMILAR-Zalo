import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ImagePage from "../components/media.storage/ImagePage";
import FilePage from "../components/media.storage/FilePage";
const Tab = createMaterialTopTabNavigator();

const TabTopMedia = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Ảnh" component={ImagePage} />
      <Tab.Screen name="File" component={FilePage} />
    </Tab.Navigator>
  );
};

export default TabTopMedia;
