import React, { useCallback, useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import {
  Card,
  Avatar,
  Text,
  Button,
  Modal,
  Portal,
  Provider,
  IconButton,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import useAxios from "../../helper/useAxios";
import Header from "../../components/Header";
import { useData } from "../../context/useData";

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [visible, setVisible] = useState(false);
  const { selectedAuction } = useData();

  const { fetchData } = useAxios();

  const getTeam = async () => {
    const res = await fetchData({
      url: `/api/users?auctionId=${selectedAuction}`,
      method: "GET",
    });
    if (res.status) {
      setTeams(res.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getTeam(); // Fetch data when the screen is focused
    }, [selectedAuction])
  );

  // Helper function for dynamic status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      case "pending":
        return "orange";
      default:
        return "black";
    }
  };

  // Show modal with selected team details
  const showModal = (team) => {
    setSelectedTeam(team);
    setVisible(true);
  };

  const hideModal = () => {
    setSelectedTeam(null);
    setVisible(false);
  };

  const updateStatus = (id, newStatus) => {
    const updatedTeams = teams.map((team) =>
      team._id === id ? { ...team, status: newStatus } : team
    );
    setTeams(updatedTeams);

    fetchData({
      url: `/api/users/${id}`,
      method: "PATCH",
      data: { status: newStatus },
    });
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Header title={"Registered Team"} />

        <FlatList
          data={teams}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.name}
                subtitle={
                  <Text style={{ color: getStatusColor(item.status) }}>
                    {`${item.role.toUpperCase()} | Status: ${item.status}`}
                  </Text>
                }
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{
                      uri: item.imageUrl.startsWith("http")
                        ? item.imageUrl
                        : "https://via.placeholder.com/100",
                    }}
                  />
                )}
              />
              <Card.Actions style={styles.actions}>
                {item.status !== "accepted" && (
                  <IconButton
                    icon="check"
                    color="green"
                    size={24}
                    onPress={() => updateStatus(item._id, "accepted")}
                    style={styles.acceptedButton}
                  />
                )}
                {item.status !== "rejected" && (
                  <IconButton
                    icon="close"
                    color="red"
                    size={24}
                    onPress={() => updateStatus(item._id, "rejected")}
                    style={styles.rejectedButton}
                  />
                )}
                {item.status === "pending" && (
                  <IconButton
                    icon="clock-outline"
                    color="orange"
                    size={24}
                    style={styles.pendingButton}
                  />
                )}
                <Button onPress={() => showModal(item)}>Details</Button>
              </Card.Actions>
            </Card>
          )}
        />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            {selectedTeam && (
              <>
                <Avatar.Image
                  size={100}
                  source={{
                    uri: selectedTeam.imageUrl.startsWith("http")
                      ? selectedTeam.imageUrl
                      : "https://via.placeholder.com/100",
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.modalName}>{selectedTeam.name}</Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Email: </Text>
                  {selectedTeam.email}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Phone: </Text>
                  {selectedTeam.phone}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Role: </Text>
                  {selectedTeam.role}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Status: </Text>
                  {selectedTeam.status}
                </Text>
                <Button mode="contained" onPress={hideModal}>
                  Close
                </Button>
              </>
            )}
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 12,
    backgroundColor: "#ffffff",
    elevation: 3,
  },
  actions: {
    justifyContent: "space-between",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  avatar: {
    alignSelf: "center",
    marginBottom: 16,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
  },
  acceptedButton: {
    backgroundColor: "#e6f7e6",
    borderRadius: 20,
  },
  rejectedButton: {
    backgroundColor: "#fbeaea",
    borderRadius: 20,
  },
  pendingButton: {
    backgroundColor: "#fff4e6",
    borderRadius: 20,
  },
});
