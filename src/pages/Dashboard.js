import {
  Typography,
  Space,
  Statistic,
  Card,
  Table
} from "antd";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import {React , useEffect, useState} from 'react'
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getExpenses } from "../store/expensesSlice";
import Wrapper from '../components/Wrapper';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { getIncomes} from "../firebase/firestore";
import { getTotalIncome, getTotalExpenses, getTotalSavings } from "../store/statisticsSlice";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import DistributionChart from "../components/DistributionChart";
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  
  const auth = getAuth();
  const user = auth.currentUser;
  const dispatch = useDispatch()
  
  const [name , setName] = useState("")
  const [email, setEmail] = useState("");
  const [totalIncome , setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const userData = useSelector((state) => state.auth.user)
  console.log("Centralized User Data: " , userData)
  const totalIncomeData = useSelector((state) => state.statistics.totalIncome)
  const totalExpensesData = useSelector((state) => state.statistics.totalExpenses);
  const totalSavingsData = useSelector((state) => state.statistics.totalSavings);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const displayName = user.displayName;
  //       const email = user.email;
  //       const uid = user.uid;

  //       setName(displayName)
  //       setEmail(email)

  //       console.log("Name: " + displayName + " Email: " + email + " uid: " + uid);
        
  //     } else {
  //       console.log("user is logged out");
  //     }
  //   });
  // }, []);

  useEffect(() => {
    dispatch(getTotalIncome(userData.uid))
    dispatch(getTotalExpenses(userData.uid));
    dispatch(getTotalSavings(userData.uid));
  } , [dispatch])

  
  return (
    <Wrapper title={"Dashboard"}>
      <Space size={20} direction="vertical">
        <Space>
          <h2>Hye {userData.name}, </h2>
        </Space>

        <Space>
          <DasboardCard
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0, 255, 0, 0.5)",
                  borderRadius: 16,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Total Balance"}
            value={totalIncomeData-totalExpensesData}
          />
          <DasboardCard
            icon={
              <ShoppingOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0, 255, 255, 0.5)",
                  borderRadius: 16,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Total Income"}
            value={totalIncomeData}
          />
          <DasboardCard
            icon={
              <UserOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255, 0, 0, 0.25)",
                  borderRadius: 16,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Expenses"}
            value={totalExpensesData}
          />
          <DasboardCard
            icon={
              <DollarCircleOutlined
                style={{
                  color: "blue",
                  backgroundColor: "rgba(0, 0, 255, 0.25)",
                  borderRadius: 16,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Savings"}
            value={totalSavingsData}
          />
        </Space>

        <Space>
          <RecentExpenses/>
          <DistributionChart/>
          {/* <ExpensesOverIncomeChart/> */}
        </Space>
      </Space>
    </Wrapper>
  );
}

function DasboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

function RecentExpenses() {

  const auth = getAuth();
  const user = auth.currentUser;

  const [expenses, setExpenses] = useState([]);
  const [isExpensesLoaded, setIsExpensesLoaded] = useState(true);

  const [expensesPerPage, setExpensesPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);
  const expensesData = useSelector((state) => state.expenses.expenseList);

  useEffect(() => {
    dispatch(getExpenses(userData.uid));
    setExpenses(expensesData);
    setIsExpensesLoaded(false);
    console.log("Expenses Data ", expensesData);
  }, [dispatch]);

  useEffect(() => {
    const collectionRef = collection(db, "expenses");
    const expensesQuery = query(collectionRef, where("uid", "==", userData.uid));

    const unsub = onSnapshot(expensesQuery, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setExpenses(newData);
      setIsExpensesLoaded(false);
    });

    return unsub;
  }, []);

  
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: [
        {
          text: "Operating",
          value: "Operating",
        },
        {
          text: "Salaries",
          value: "Salaries",
        },
      ],
      onFilter: (value, record) => record.type.startsWith(value),
      filterSearch: true,
      width: "40%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      width: "40%",
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date > b.date,
      width: "40%",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "40%",
    },
  ];

  return (
    <>
      <Typography.Text>Recent Expenses</Typography.Text>
      <Table
        columns={columns}
        dataSource={expenses}
        pagination={{
          position: ["bottomCenter"],
          pageSize: expensesPerPage,
          current: currentPage,
          onChange: (currentPage, expensesPerPage) => {
            setExpensesPerPage(expensesPerPage);
            setCurrentPage(currentPage);
          },
        }}
      />
    </>
  );
}

export default Dashboard
