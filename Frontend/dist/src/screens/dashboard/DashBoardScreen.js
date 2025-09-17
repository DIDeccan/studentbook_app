import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Feather";
import ContainerComponent from "../../components/commonComponents/Container";
import { useSelector } from "react-redux";
import { darkColors, lightColors } from "../../utils/Colors";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  return (
    <ContainerComponent>
         <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.welcome}>Welcome, Vasu 👋</Text>
      <Text style={styles.subHeader}>
        Keep up the great work on your learning journey!
      </Text>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Icon name="clock" size={20} color="#6C63FF" />
          <Text style={styles.statTitle}>Total Hours Spent</Text>
          <Text style={[styles.statValue, { color: "#6C63FF" }]}>34h</Text>
        </View>
        <View style={styles.card}>
          <Icon name="check-circle" size={20} color="#00C49F" />
          <Text style={styles.statTitle}>Test Results</Text>
          <Text style={[styles.statValue, { color: "#00C49F" }]}>82%</Text>
        </View>
        <View style={styles.card}>
          <Icon name="video" size={20} color="#FF8042" />
          <Text style={styles.statTitle}>Videos Completed</Text>
          <Text style={[styles.statValue, { color: "#FF8042" }]}>14</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Icon name="calendar" size={20} color="#00C49F" />
          <Text style={styles.statTitle}>Weekly Hours</Text>
          <Text style={[styles.statValue, { color: "#00C49F" }]}>12h</Text>
        </View>
        <View style={styles.card}>
          <Icon name="book-open" size={20} color="#0088FE" />
          <Text style={styles.statTitle}>Attend Assignments</Text>
          <Text style={[styles.statValue, { color: "#0088FE" }]}>18h</Text>
        </View>
        <View style={styles.card}>
          <Icon name="alert-circle" size={20} color="#FF0000" />
          <Text style={styles.statTitle}>Pending Assignments</Text>
          <Text style={[styles.statValue, { color: "#FF0000" }]}>18h</Text>
        </View>
      </View>

      {/* Bar Chart */}
      <Text style={styles.chartTitle}>Topic you are interested in</Text>
      <BarChart
        data={{
          labels: ["English", "Maths", "Science", "Social", "Telugu", "Yoga", "Sport", "Health"],
          datasets: [
            {
              data: [35, 20, 15, 12, 10, 9, 9, 9],
            },
          ],
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
          labelColor: () => "#333",
        }}
        style={styles.chart}
      />

      {/* Line Chart */}
      <Text style={styles.chartTitle}>Weekly Learning Trends</Text>
      <LineChart
        data={{
          labels: ["Telugu", "English", "Maths", "Science", "Social", "Hindi"],
          datasets: [
            {
              data: [50, 200, 150, 300, 180, 250],
              color: () => "#6C63FF", // Saturday
            },
            {
              data: [40, 100, 90, 120, 110, 140],
              color: () => "#0088FE", // Friday
            },
            {
              data: [20, 80, 60, 100, 90, 120],
              color: () => "#00C49F", // Monday
            },
            {
              data: [10, 60, 40, 80, 70, 100],
              color: () => "#FF8042", // Wednesday
            },
          ],
          legend: ["Saturday", "Friday", "Monday", "Wednesday"],
        }}
        width={screenWidth - 20}
        height={250}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          labelColor: () => "#333",
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
    </ContainerComponent>
 
  );
};

const themedStyles =(colors)=> StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: "",
    padding: 10,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color:colors.text
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    color:colors.text
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
  },
  statTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
      //color:colors.text
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
     // color:colors.text
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
      color:colors.text
  },
  chart: {
    borderRadius: 12,
    marginVertical: 10,
  },
});

export default Dashboard;
