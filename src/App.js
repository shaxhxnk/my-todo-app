import { useState } from "react";
import { Layout, Form, Input, Select, Table, Pagination,DatePicker } from "antd";
import moment from 'moment';
const { Header, Content } = Layout;
const { Option } = Select;

const ToDoList = () => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: tasks.length,
  });
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({});
  const [searchText, setSearchText] = useState("");
  const handleAddTask = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  
  const handleAdd = () => {
    const newTask = form.getFieldsValue();
    setTasks([...tasks, newTask]);
    form.resetFields();
    setShowForm(false);
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  const handleModify = (index, modifiedTask) => {
    setTasks(tasks.map((task, i) => (i === index ? modifiedTask : task)));
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorting(sorter);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const filteredTasks = tasks.filter(
    (task) =>
      Object.keys(task).some((key) =>
        task[key]?.toString().toLowerCase().includes(searchText.toLowerCase())
      ) &&
      Object.entries(filters).every(([key, value]) =>
        value?.includes(task[key])
      )
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const key = sorting.columnKey;
    const isAscending = sorting.order === "ascend";
    if (a[key] === b[key]) return 0;
    return isAscending ? (a[key] > b[key] ? 1 : -1) : a[key] < b[key] ? 1 : -1;
  });

  const displayedTasks = sortedTasks.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const columns = [
    {
      title: "Timestamp created",
      dataIndex: "created",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
      render: (created) => new Date(created).toLocaleString(),
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title, task) => (
        <Input
          defaultValue={title}
          maxLength={100}
          onChange={(e) =>
            handleModify(task.index, { ...task, title: e.target.value })
          }
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (description, task) => (
        <Input.TextArea
          defaultValue={description}
          maxLength={1000}
          onChange={(e) =>
            handleModify(task.index, { ...task, description: e.target.value })
          }
        />
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (dueDate, task) => (
        <DatePicker
          defaultValue={dueDate ? moment(dueDate, "YYYY-MM-DD") : null}
          onChange={(date) =>
            handleModify(task.index, {
              ...task,
              dueDate: date ? date.format("YYYY-MM-DD") : null,
            })
          }
        />
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      filters: [
        { text: "High", value: "high" },
        { text: "Medium", value: "medium" },
        { text: "Low", value: "low" },
      ],
      onFilter: (value, task) => task.priority === value,
      render: (priority, task) => (
        <Select
          defaultValue={priority}
          onChange={(value) =>
            handleModify(task.index, { ...task, priority: value })
          }
        >
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      filters: [
        { text: "Open", value: "Open" },
        { text: "Working", value: "Working" },
        { text: "Done", value: "Done" },
        { text: "OverDue", value: "OverDue" },
       
      ],
      onFilter: (value, task) => task.Status === value,
      render: (Status, task) => (
        <Select
          defaultValue={Status}
          onChange={(value) =>
            handleModify(task.index, { ...task, Status: value })
          }
        >
          <Option value="Open">Open</Option>
          <Option value="Working">Working</Option>
          <Option value="Done">Done</Option>
          <Option value="OverDue">OverDue</Option>
        </Select>
      ),
    },
    
    {
      title: "Action",
      render: (_, task) => (
        <button 
        style={{ 
          backgroundColor: 'red', 
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this task?")) {
            handleDelete(task.index)
          }
        }}
      >
        <span style={{ marginRight: '5px' }}>🗑️</span>
        Delete Task
      </button>
      
      ),
    },
  ];

  return (
    <Layout>
   <Header style={{ backgroundColor: "#000000", padding: "16px 32px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", textAlign: "center", paddingBottom: "16px" }}>
  <h1 style={{ margin: 0 , color:"#fff" }}>Todo List</h1>
</Header>


      <Content>
      <button
  onClick={handleAddTask}
  style={{
    margin: "16px",
    backgroundColor: "#00008b",
    border: "none",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease-in-out",
  }}
>
  Add Task
</button>


      {showForm && (
        <Form form={form} onFinish={handleAdd} layout="vertical"
          style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter a title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter a description" />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker placeholder="Select a due date" />
          </Form.Item>
          <Form.Item name="priority" label="Priority" initialValue="medium">
            <Select>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item name="Status" label="Status" initialValue="Working">
            <Select>
              <Option value="Open">Open</Option>
              <Option value="Working">Working</Option>
              <Option value="Done">Done</Option>
              <Option value="OverDue">OverDue</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                color: "white",
                padding: "10px 20px",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                margin: "0 0 16px 0",
                cursor: "pointer",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
              }}
              htmlType="submit"
            >
              Add Task
            </button>
            <button
  onClick={handleCancel}
  style={{
    backgroundColor: "#F44336",
    border: "none",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "0 10px",
    cursor: "pointer",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease-in-out",
  }}
>
  Cancel
</button>

          </Form.Item>
        </Form>
      )}

<div style={{ display: "flex", justifyContent: "flex-end" }}>
  <Input.Search
    style={{ width: "100%", maxWidth: "400px", marginBottom: "16px" }}
    placeholder="Search"
    allowClear
    onChange={(e) => handleSearch(e.target.value)}
  />
</div>




<Table
  columns={columns}
  dataSource={displayedTasks.map((task, index) => ({ ...task, index }))}
  pagination={pagination}
  onChange={handleTableChange}
  style={{ marginTop: "16px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
  rowKey={(record) => record.id}
  bordered
/>

      </Content>
    </Layout>
  );
};

export default ToDoList;
