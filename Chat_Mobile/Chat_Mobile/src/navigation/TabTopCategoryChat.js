import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import ConservationList from "../components/ConservationList";

const Tab = createMaterialTopTabNavigator();

const PriorityMessages = () => <ConservationList category="priority" />;
const OtherMessages = () => <ConservationList category="other" />;

const TabTopCategoryChat = () => {

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Ưu tiên" component={PriorityMessages} />
        <Tab.Screen name="Khác" component={OtherMessages} />

      </Tab.Navigator>
    </View>
  );
}

export default TabTopCategoryChat;
