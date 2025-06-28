import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";

const oaList = [
  {
    id: "1",
    name: "Fiza",
    avatar: "https://picsum.photos/50/50",
  },
  {
    id: "2",
    name: "Hồng Trà Ngô Gia",
    avatar: "https://picsum.photos/50/50",
  },
  {
    id: "3",
    name: "LifeZ - Phong cách sống",
    avatar: "https://picsum.photos/50/50",
  },
];

const PhoneBookOA = () => {
  return (
    <View style={styles.container}>
      {/* Nút tìm thêm OA */}
      <TouchableOpacity style={styles.findOffAccountButton}>
        <Image source={{ uri: "https://picsum.photos/40/40" }} style={styles.offAccountIcon} />
        <Text style={styles.findOffAccountText}>Tìm thêm Official Account</Text>
      </TouchableOpacity>

      {/* Thanh phân cách */}
      <View style={styles.separator} />
      <Text style={styles.title}>Official Account đã quan tâm</Text>

      {/* Danh sách OA */}
      <FlatList
        data={oaList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  findOffAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  offAccountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  findOffAccountText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  separator: {
    height: 3,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
  },
});

export default PhoneBookOA;
