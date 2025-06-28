import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

const Loading = ({ isLoading }) => {
  return (
    isLoading && (
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(248, 247, 247, 0.75)",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: "#007AFF" }}>
          Loading...
        </Text>
      </View>
    )
  );
};

export default Loading;
