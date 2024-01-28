import { React , useState, useEffect} from "react";
import { Typography, Space, Table, Card, Button, Modal, Input, message, Popconfirm, Select} from "antd";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Wrapper from "../components/Wrapper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { addSavings, updateSavings, deleteSavings } from "../firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { addSavingsToDB, deleteSaving, getSavings, updateSaving } from "../store/savingsSlice";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function Saving() {
  return (
    <Wrapper>
      <Space direction="vertical">
        <Typography.Title>Savings</Typography.Title>

        <Space>
          <SavingsTable />
          <SavingsChart />
        </Space>
      </Space>
    </Wrapper>
  );
}

function SavingsTable() {

  const auth = getAuth();
  const user = auth.currentUser;

  const [count, setCount] = useState(2);
  const [savings, setSavings] = useState([]);
  const [isSavingsLoaded, setIsSavingsLoaded] = useState(true);
  
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [documentKey, setDocumentKey] = useState("");

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  
  const [savingsPerPage, setSavingsPerPage] = useState(3)
  const [currentPage, setCurrentPage] = useState(1)

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);
  const savingsData = useSelector((state) => state.savings.savings);

  useEffect(() => {
    dispatch(getSavings(user.uid));
    setSavings(savingsData);
    setIsSavingsLoaded(false);
  }, [savingsData]);

  // useEffect(() => {
  //    getSavings(user.uid.toString(), setSavings, setIsSavingsLoaded);
  //  }, []);

   useEffect(() => {
     const collectionRef = collection(db, "savings ");
     const savingsQuery = query(collectionRef);

     const unsub = onSnapshot(savingsQuery, (snapshot) => {
       const newData = snapshot.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id,
       }));

       setSavings(newData);
       setIsSavingsLoaded(false);
     });

     return unsub;
   }, []);

  const handleEdit = (key, obj) => {
    setModalTitle("Editing Savings");
    setOpen(true);
    setIsEditing(true);
    setDocumentKey(key);

    setSource(obj.source);
    setAmount(obj.amount);
    setDeadline(obj.deadline);
    setDescription(obj.description);
  };

  const confirm = (key) => {
    dispatch(deleteSaving(key))
    // deleteSavings(key);
    message.success("Record Deleted Successfully");
  };
  const cancel = (e) => {
    message.error("Operation Cancelled");
  };

  const columns = [
    {
      title: "Source",
      dataIndex: "source",
      filters: [
        {
          text: "Freelancing",
          value: "Freelancing",
        },
        {
          text: "Side Hustle",
          value: "Side Hustle",
        },
      ],
      onFilter: (value, record) => record.source.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      width: "40%",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      sorter: (a, b) => a.deadline > b.deadline,
      width: "40%",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "60%",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() =>
              handleEdit(record.id, {
                source: record.source,
                amount: record.amount,
                deadline: record.deadline,
                description: record.description,
              })
            }
          >
            Edit
          </a>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this income?"
            onConfirm={() => confirm(record.id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

   const handleAdd = () => {
     setModalTitle("Adding Savings");
     setOpen(true);
   };

   const handleUpdatedSavings = () => {
     console.log("Savings Updated");

     console.log("Editing Form");
     console.log(user.uid);
     console.log(source);
     console.log(amount);
     console.log(deadline);
     console.log(description);

     let saving = {
       id: documentKey,
       source: source,
       amount: amount,
       deadline: deadline,
       description: description,
     };
     dispatch(updateSaving(saving))
     //updateSavings(documentKey, source, amount, deadline, description);

     setOpen(false);
   };

   const showModal = () => {
     setOpen(true);
   };

   const handleSubmit = () => {
     if (user) {
       console.log(user.uid);
       console.log(source);
       console.log(amount);
       console.log(deadline);
       console.log(description);

       let saving = { uid: user.uid, source: source, amount: amount, deadline: deadline.toString(), description: description }
       dispatch(addSavingsToDB(saving))
       //addSavings(user.uid, source, amount, deadline.toString(), description);
     } else {
       console.log("User ID is null");
     }

     setOpen(false);
   };

   const handleCancel = () => {
     console.log("Clicked cancel button");
     setSource("");
     setAmount(0);
     setDeadline("");
     setDescription("");

     setOpen(false);
     setIsEditing(false);
   };

   const [searchText, setSearchText] = useState("");
   const [filteredData, setFilteredData] = useState([]);

   const handleSearchChange = (e) => {
     setSearchText(e.target.value);
     console.log(searchText);
   };

   const searchData = () => {
     console.log("Savings", savings);
     let data = savingsData.filter((saving) => {
       return (
         saving.description.toLowerCase().includes(searchText.toLowerCase()) ||
         saving.source.toLowerCase().includes(searchText.toLowerCase()) 
       );
     });
     console.log("Filtered Data", data);
     setFilteredData(data);
   };

   const resetData = () => {
     setFilteredData([]);
     setSearchText("");
   };

  return (
    <Space direction="vertical">
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add Saving
      </Button>

      <Modal
        title={modalTitle}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={isEditing ? handleUpdatedSavings : handleSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          value={source}
          placeholder="Source"
          style={{ marginBottom: 20 }}
          onChange={(e) => setSource(e.target.value)}
        />
        <br />
        <Input
          value={amount}
          placeholder="Amount"
          style={{ marginBottom: 20 }}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <Input
          value={deadline}
          placeholder="Deadline"
          style={{ marginBottom: 20 }}
          onChange={(e) => setDeadline(e.target.value)}
          type="date"
        />
        <br />
        <Input
          value={description}
          placeholder="Description"
          style={{ marginBottom: 20 }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
      </Modal>

      <Space align="center">
        <Input
          placeholder="input search text"
          size="medium"
          onChange={handleSearchChange}
          type="text"
          value={searchText}
        />

        <Button type="primary" onClick={searchData}>
          Search
        </Button>
        <Button type="primary" onClick={resetData}>
          Reset
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={
          filteredData && filteredData.length > 0 ? filteredData : savingsData
        }
        onChange={onChange}
        pagination={{
          pageSize: savingsPerPage,
          current: currentPage,
          onChange: (currentPage, savingsPerPage) => {
            setSavingsPerPage(savingsPerPage);
            setCurrentPage(currentPage);
          },
        }}
      />
    </Space>
  );
}

function SavingsChart() {
  
  const dispatch = useDispatch();
  const savings = useSelector((state) => state.savings.savings);
  const user = useSelector((state) => state.auth.user);
  const [filteredData, setFilteredData] = useState(filterData(savings, 7));

  useEffect(() => {
    dispatch(getSavings(user.uid));
    console.log("Savings Data ", savings);
  }, [dispatch]);

  function filterData(data, days) {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - days);

    console.log("Current Date", currentDate.getDate());
    return data.filter((item) => {
      const itemDate = new Date(item.deadline);
      return itemDate >= startDate && itemDate <= currentDate;
    });
  }

  function filterDataToday(data) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

    return data.filter((item) => {
      const itemDate = new Date(item.deadline);
      return itemDate >= currentDate && itemDate <= endDate;
    });
  }

  const currentDate = new Date();
  // const today = filterData(incomes , 0)
  // const last7Days = filterData(incomes, 10);
  // const thisMonth = filterData(incomes, currentDate.getDate() - 1);

  // console.log("Today" , today)
  // console.log("7 Days", last7Days);
  // console.log("This Month", thisMonth);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Savings Chart",
      },
    },
  };

  const monthlyLabels = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  const labels = filteredData.map((data) => data.deadline);

  console.log("Labels", labels);

  const data = {
    labels,
    datasets: [
      {
        label: "Savings Data",
        data: filteredData.map((data) => data.amount),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const handleFiltering = (value) => {
    if (value === "0") {
      setFilteredData(filterDataToday(savings));
    } else {
      console.log(`selected ${value}`);
      console.log("Selected Data ", filteredData);
      setFilteredData(filterData(savings, value));
    }
  };

  return (
    <>
      <Space wrap>
        <Select
          defaultValue="Last 7 Days"
          onChange={handleFiltering}
          style={{
            width: 120,
          }}
          options={[
            {
              value: "0",
              label: "Today",
            },
            {
              value: "6",
              label: "Last 7 days",
            },
            {
              value: currentDate.getDate() - 1,
              label: "This Month",
            },
            {
              value: "90",
              label: "Last 3 Months",
            },
          ]}
        />
      </Space>
      <Card>
        <Line options={options} data={data} />
      </Card>
    </>
  );
}
