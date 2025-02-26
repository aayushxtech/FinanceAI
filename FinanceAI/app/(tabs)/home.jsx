import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([
    { id: 1, category: "Food", amount: -25, date: "2024-01-20" },
    { id: 2, category: "Salary", amount: 3000, date: "2024-01-19" },
    { id: 3, category: "Shopping", amount: -150, date: "2024-01-18" },
  ]);
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const totalBalance = 2500;
  const budgetRemaining = 800;

  // Enhanced quick actions
  const quickActions = [
    {
      name: "Add Transaction",
      icon: "add-circle",
      route: "transaction",
      color: "#10B981",
      description: "Record new expense",
      gradient: ["#10B981", "#059669"],
    },
    {
      name: "Budget",
      icon: "pie-chart",
      route: "budget",
      color: "#8B5CF6",
      description: "Manage your budget",
      gradient: ["#8B5CF6", "#7C3AED"],
    },
    {
      name: "AI Assistant",
      icon: "chat",
      route: "chatbot",
      color: "#F59E0B",
      description: "Get financial advice",
      gradient: ["#F59E0B", "#D97706"],
    },
    {
      name: "Analytics",
      icon: "insights",
      route: "transaction",
      color: "#4F46E5",
      description: "Track your finances",
      gradient: ["#4F46E5", "#4338CA"],
    },
  ];

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("Fetched user data:", data);
        setUserData({
          username: data.username,
        });
      } else {
        console.log("No user document found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    StatusBar.setBarStyle("dark-content");

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        router.replace("../auth/login");
      }
      setIsLoading(false);

      // Start animations when data is loaded
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#F0F4FF", "#EEF2FF", "#F8FAFC"]}
          style={styles.loadingGradient}
        />
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading your finances...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Correctly route to the login screen
      router.replace("../auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#EEF2FF", "#F5F7FF", "#F8FAFC"]}
        style={styles.gradientBackground}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Welcome and Logout */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.nameText}>{userData?.username || "User"}</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="logout" type="material" color="#4F46E5" size={24} />
          </TouchableOpacity>
        </Animated.View>

        {/* Financial Overview */}
        <Animated.View
          style={[
            styles.overviewContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Card containerStyle={styles.mainCard}>
            <LinearGradient
              colors={["#4F46E5", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardGradient}
            >
              <Text style={styles.mainCardTitle}>Total Balance</Text>
              <Text style={styles.mainCardValue}>
                ${totalBalance.toLocaleString()}
              </Text>
              <View style={styles.cardIndicator} />
            </LinearGradient>
          </Card>

          <Card containerStyle={styles.secondaryCard}>
            <Text style={styles.secondaryCardTitle}>Budget Remaining</Text>
            <Text style={styles.secondaryCardValue}>
              ${budgetRemaining.toLocaleString()}
            </Text>
            <View style={styles.budgetIndicatorContainer}>
              <View style={styles.budgetIndicator}>
                <View
                  style={[
                    styles.budgetProgress,
                    { width: `${(budgetRemaining / totalBalance) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.budgetPercentage}>
                {Math.round((budgetRemaining / totalBalance) * 100)}%
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((item, index) => (
              <TouchableOpacity
                key={item.name}
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => router.replace(item.route)}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <MaterialIcons name={item.icon} size={28} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.actionText}>{item.name}</Text>
                <Text style={styles.actionDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View
          style={[
            styles.sectionHeader,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity
            onPress={() => router.push("transaction")}
            activeOpacity={0.7}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <MaterialIcons name="chevron-right" size={18} color="#4F46E5" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.transactionsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {transactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.categoryIcon,
                  {
                    backgroundColor:
                      transaction.amount > 0 ? "#dcfce7" : "#fee2e2",
                  },
                ]}
              >
                <Icon
                  name={getCategoryIcon(transaction.category)}
                  type="material"
                  color={transaction.amount > 0 ? "#16a34a" : "#dc2626"}
                  size={22}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionCategory}>
                  {transaction.category}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.amount > 0 ? "#16a34a" : "#dc2626" },
                ]}
              >
                {transaction.amount > 0 ? "+" : "-"}$
                {Math.abs(transaction.amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* AI Assistant Preview */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <TouchableOpacity
            style={styles.aiPreview}
            activeOpacity={0.8}
            onPress={() => router.replace("chatbot")}
          >
            <LinearGradient
              colors={["#4F46E5", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.aiIconContainer}
            >
              <MaterialIcons name="chat" size={24} color="#ffffff" />
            </LinearGradient>
            <View style={styles.aiTextContainer}>
              <Text style={styles.aiTitle}>Financial Assistant</Text>
              <Text style={styles.aiText}>
                Get personalized advice about your finances
              </Text>
            </View>
            <View style={styles.aiArrowContainer}>
              <MaterialIcons name="chevron-right" size={24} color="#4F46E5" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom padding for scroll */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "500",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mainCard: {
    borderRadius: 16,
    padding: 0, // Remove padding as it's handled by gradient
    borderWidth: 0,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 16,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  mainCardTitle: {
    fontSize: 16,
    color: "#EEF2FF",
    marginBottom: 8,
    fontWeight: "500",
  },
  mainCardValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  cardIndicator: {
    width: 60,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  secondaryCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 0,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  secondaryCardTitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },
  secondaryCardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  budgetIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  budgetIndicator: {
    width: "85%",
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
  },
  budgetProgress: {
    height: 8,
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  budgetPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 24,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: (width - 56) / 2,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start",
  },
  actionGradient: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: "#64748b",
  },
  transactionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  transactionCategory: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
  transactionDate: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "400",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  aiPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  aiIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  aiTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  aiText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "400",
  },
  aiArrowContainer: {
    backgroundColor: "#EEF2FF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomPadding: {
    height: 80,
  },
});

function getIconName(item) {
  switch (item) {
    case "Budget":
      return "account-balance-wallet";
    case "Transactions":
      return "receipt";
    case "Chat":
      return "chat";
    default:
      return "help";
  }
}

function getCategoryIcon(category) {
  switch (category) {
    case "Food":
      return "restaurant";
    case "Salary":
      return "payments";
    case "Shopping":
      return "shopping-bag";
    case "Transport":
      return "directions-car";
    case "Entertainment":
      return "movie";
    case "Healthcare":
      return "medical-services";
    case "Education":
      return "school";
    case "Bills":
      return "receipt";
    default:
      return "attach-money";
  }
}
