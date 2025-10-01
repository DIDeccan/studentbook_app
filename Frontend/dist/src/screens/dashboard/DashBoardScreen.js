import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Feather";
import ContainerComponent from "../../components/commonComponents/Container";
import { useDispatch, useSelector } from "react-redux";
import { darkColors, lightColors } from "../../utils/Colors";
import {
  getDashBoardData,
  getDBInterestTopic,
  getDBWeeklyTrends,
} from "../../redux/reducer/dashboard";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = themeMode === "dark" ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const dispatch = useDispatch();

  const DashBoarduserData = useSelector((state) => state.dashboard.dashboardGetdata);
  const DashBoardInterestTopicData = useSelector(
    (state) => state.dashboard.dashboardInterestTopic
  );
  const DashBoardWeeklyData = useSelector(
    (state) => state.dashboard.dashboardWeekilyTopics
  );
  const { loding } = useSelector((state) => state.dashboard);
  const isFocused = useIsFocused();

  // Data safe handling
  const labelsForInterestTopic =
    DashBoardInterestTopicData?.subjects?.map((subject) =>
      subject?.name?.substring(0, 3)
    ) || [];

  const dataValuesForInterestTopic =
    DashBoardInterestTopicData?.subjects?.map(
      (subject) => subject?.percentage
    ) || [];

  const subjects =
    Object.keys(DashBoardWeeklyData?.days?.Sunday || {}).map((subj) =>
      subj.substring(0, 3)
    ) || [];

  const weekDays = Object.keys(DashBoardWeeklyData?.days || {});
  const weekLabels = weekDays.map((day) => day.substring(0, 3));

  const chartColors = [
    "#6C63FF",
    "#0088FE",
    "#00C49F",
    "#FF8042",
    "#FF0000",
    "#AA00FF",
    "#FFAA00",
  ];

  const datasets =
    weekDays?.map((day, idx) => ({
      data: Object?.values(DashBoardWeeklyData?.days?.[day] || {}),
      color: () => chartColors[idx % chartColors.length],
    })) || [];

  const weeklyChartData = {
    labels: subjects?.length > 0 ? subjects : ["No Data"],
    datasets: datasets?.length > 0 ? datasets : [{ data: [0] }],
    legend: weekLabels?.length > 0 ? weekLabels : ["No Data"],
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      let studentId = await AsyncStorage.getItem("studentId");
      let classId = await AsyncStorage.getItem("classId");

      if (studentId && classId) {
        await Promise.allSettled([
          dispatch(getDashBoardData({ student_id: studentId, class_id: classId })),
          dispatch(getDBInterestTopic({ student_id: studentId, class_id: classId })),
          dispatch(getDBWeeklyTrends({ student_id: studentId, class_id: classId })),
        ]);
      } else {
        console.warn("Missing studentId or classId in AsyncStorage");
      }
    };

    if (isFocused) {
      fetchDashboard();
    }
  }, [isFocused, dispatch]);

  // Show loader while fetching
  if (loding) {
    return (
      <ContainerComponent>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent>
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>
          Welcome, {DashBoarduserData?.user?.name || "Student"} 👋
        </Text>
        <Text style={styles.subHeader}>
          Keep up the great work on your learning journey!
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Icon name="clock" size={20} color="#6C63FF" />
            <Text style={styles.statTitle}>Total Hours Spent</Text>
            <Text style={[styles.statValue, { color: "#6C63FF" }]}>
              {DashBoarduserData?.stats?.totalHours || 0} hr
            </Text>
          </View>
          <View style={styles.card}>
            <Icon name="check-circle" size={20} color="#00C49F" />
            <Text style={styles.statTitle}>Test Results</Text>
            <Text style={[styles.statValue, { color: "#00C49F" }]}>
              {DashBoarduserData?.stats?.averageScore || 0}%
            </Text>
          </View>
          <View style={styles.card}>
            <Icon name="video" size={20} color="#FF8042" />
            <Text style={styles.statTitle}>Videos Completed</Text>
            <Text style={[styles.statValue, { color: "#FF8042" }]}>
              {DashBoarduserData?.stats?.videosCompleted || 0}
            </Text>
          </View>
        </View>

        {/* Second row */}
        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Icon name="calendar" size={20} color="#00C49F" />
            <Text style={styles.statTitle}>Weekly Hours</Text>
            <Text style={[styles.statValue, { color: "#00C49F" }]}>
              {DashBoarduserData?.stats?.weeklyHours || 0}
            </Text>
          </View>
          <View style={styles.card}>
            <Icon name="book-open" size={20} color="#0088FE" />
            <Text style={styles.statTitle}>Attend Assignments</Text>
            <Text style={[styles.statValue, { color: "#0088FE" }]}>
              {DashBoarduserData?.stats?.attendedAssignments || 0}
            </Text>
          </View>
          <View style={styles.card}>
            <Icon name="alert-circle" size={20} color="#FF0000" />
            <Text style={styles.statTitle}>Pending Assignments</Text>
            <Text style={[styles.statValue, { color: "#FF0000" }]}>
              {DashBoarduserData?.stats?.pendingAssignments || 0}
            </Text>
          </View>
        </View>

        {/* Bar Chart */}
        <Text style={styles.chartTitle}>Topic you are interested in</Text>
        {labelsForInterestTopic.length > 0 ? (
          <BarChart
            data={{
              labels: labelsForInterestTopic,
              datasets: [
                {
                  data: dataValuesForInterestTopic,
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
        ) : (
          <Text style={styles.noDataText}>No topic interest data available</Text>
        )}

        {/* Line Chart */}
        <Text style={styles.chartTitle}>Weekly Learning Trends</Text>
        {subjects.length > 0 ? (
          <LineChart
            data={weeklyChartData}
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
        ) : (
          <Text style={styles.noDataText}>No weekly trend data available</Text>
        )}
      </ScrollView>
    </ContainerComponent>
  );
};

const themedStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    welcome: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 4,
      color: colors.text,
    },
    subHeader: {
      fontSize: 14,
      marginBottom: 20,
      color: colors.text,
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
    },
    statValue: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 4,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginVertical: 10,
      color: colors.text,
    },
    chart: {
      borderRadius: 12,
      marginVertical: 10,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 14,
      color: colors.text,
    },
    noDataText: {
      textAlign: "center",
      marginVertical: 20,
      fontSize: 14,
      color: "#999",
    },
  });

export default Dashboard;
