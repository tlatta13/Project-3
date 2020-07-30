import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import Modal from "react-modal";
import MonthlyBar from "../../components/Charts/monthlybar";
import PieChart from "../../components/Charts/piechart";
import Income from "../../components/Income";
import Expense from "../../components/Expense";
import Savings from "../../components/Savings";
import IncomeTable from "../../components/Tables/income";
import ExpenseTable from "../../components/Tables/expense";
import SavingsTable from "../../components/Tables/savings";
import API from "../../lib/API"


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  main: {
    'fontFamily': 'Arial, Helvetica, sans-serif'

  }
};

const Dashboard = () => {
  const auth = useContext(AuthContext)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [expensesTable, setExpensesTable] = useState([])
  const [filteredExpensesTable, setFilteredExpensesTable] = useState([])
  const [savingsTable, setSavingsTable] = useState([])
  const [filteredSavingsTable, setFilteredSavingsTable] = useState([])
  const [incomeTable, setIncomeTable] = useState([])
  const [filteredIncomeTable, setFilteredIncomeTable] = useState([])
  const [userid, setUserId] = useState([])
  const openModal = (contents) => {
    setModalContent(contents);
    setIsOpen(true);
  };

  useEffect(() => {
    Modal.setAppElement("body")
    getLatestExpenses()
    getLatestSavings()
    getLatestIncome();
  },[]);

  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // get all expenses
  const getLatestExpenses = () => {
    API.Expense.getAll(auth.authToken)
      .then(res => {
        setExpensesTable(res.data)
        setFilteredExpensesTable(res.data)
      })
  }

  // get all savings
  const getLatestSavings = () => {
    API.Savings.getAll(auth.authToken)
      .then(res => {
        setSavingsTable(res.data)
        setFilteredSavingsTable(res.data)
      })
  }


  // get all income
  const getLatestIncome = () => {
    API.Income.getAll(auth.authToken)
      .then(res => {
        setIncomeTable(res.data)
        setFilteredIncomeTable(res.data)
      })
  }

  // Delete Expense
  const onDelete = (expensesid) => API.Expense.delete(auth.authToken, expensesid).then(results => {
      getLatestExpenses()
  })

  // Delete Income
  const onIncDelete = (incomesid) => API.Income.delete(auth.authToken, incomesid).then(results => {
    getLatestIncome()
  })


  // Delete Savings
  const onSavDelete = (savingsid) => API.Savings.delete(auth.authToken, savingsid).then(results => {
    getLatestSavings()
  })

  const userInfo = useContext(AuthContext);

  // Button style for adding income, expense, savings
  const style = {
    buttonsDiv: {
      display: "flex",
      justifyContent: "center",
    },
    incomeButton: {
      backgroundColor: "green",
    },
    expenseButton: {
      backgroundColor: "red",
    },
  };

  return (
    <div className="class" style={customStyles.main}>
      <div className="container bg-light border-0 rounded my-4">
        <h3 className="text-center text-light mb-3 pt-4">
          <div style={{ color: "black" }}>
            Welcome {userInfo.user ? userInfo.user.email : null}!{" "}
          </div>
        </h3>
        <div style={style.buttonsDiv}>
          <button
            style={style.incomeButton}
            className="income btn btn-secondary mr-1 mb-4"
            onClick={() => openModal("income")}>
            Add Income
          </button>
          <button
            style={style.incomeButton}
            className="expense btn btn-secondary mx-2 mb-4"
            onClick={() => openModal('savings')}>
            Add Savings
          </button>
          <button
            style={style.expenseButton}
            className="expense btn btn-secondary ml-1 mb-4"
            onClick={() => openModal('expense')}>
            Add Expense
          </button>
        </div>
      </div>

      {/* Graphs Container */}
      <div className="container bg-light border-0 rounded my-4">
        <div className="row">
          <div
            className="col-sm d-flex flex-column justify-content-center my-3"
            style={{ height: 500 }}
          >
            <MonthlyBar />
          </div>
          <div
            className="col-sm d-flex flex-column justify-content-center my-3"
            style={{ height: 500 }}
          >
            <PieChart />
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        Income
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Income Modal"
      >
        {modalContent === "income" ? <Income close={closeModal} getLatestIncome={getLatestIncome} /> :
          modalContent === "expense" ? <Expense close={closeModal} getLatestExpenses={getLatestExpenses} /> :
            <Savings close={closeModal} getLatestSavings={getLatestSavings} />}
      </Modal>

      {/* Income Table */}
      <div className="container bg-light border-0 rounded my-4">
        <h3 className="text-center py-4">Income</h3>
        <IncomeTable
          setIncomeTable={setIncomeTable}
          incomeTable={incomeTable}
          setFilteredIncomeTable={setFilteredIncomeTable}
          filteredIncomeTable={filteredIncomeTable}
          onIncDelete={onIncDelete}
        />
      </div>

      {/* Savings Table */}
      <div className="container bg-light border-0 rounded my-4">
        <h3 className="text-center mb-3 py-4">
          Savings
        </h3>
        <SavingsTable
          setSavingsTable={setSavingsTable}
          savingsTable={savingsTable}
          setFilteredSavingsTable={setFilteredSavingsTable}
          filteredSavingsTable={filteredSavingsTable}
          onSavDelete={onSavDelete}
        />
      </div>

      {/* Expense Table */}
      <div className="container bg-light border-0 rounded my-4">
        <h3 className="text-center mb-3 py-4">
          Expenses
        </h3>
        <ExpenseTable
          setExpensesTable={setExpensesTable}
          expensesTable={expensesTable}
          setFilteredExpensesTable={setFilteredExpensesTable}
          filteredExpensesTable={filteredExpensesTable}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default Dashboard;
