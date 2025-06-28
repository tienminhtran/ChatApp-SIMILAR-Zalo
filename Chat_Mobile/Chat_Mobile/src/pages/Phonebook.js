import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import Header from "../components/Header";
import TabTopCategoryPhoneBook from "../navigation/TabTopCategoryPhoneBook";

const Phonebook = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header iconRight="user" />
      <TabTopCategoryPhoneBook />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 0,
  },
});

export default Phonebook;
