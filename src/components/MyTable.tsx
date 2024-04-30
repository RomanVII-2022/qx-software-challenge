import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAppSelector } from '../application/store';
import { getAllTasks } from '../features/taskSlice';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, createColumnHelper, flexRender, getFilteredRowModel } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

interface Task {
    id: string;
    object: string;
    task_priority: string;
    status_id: string;
    subject: string;
    description: string;
    due_date: string;
    created_at: string;
    updated_at: string
}

function MyTable() {


    // show task details
    const [taskDetail, setTaskDetail] = useState({} as Task)

    const [modalShow, setModalShow] = useState(false);

    const handleShowTaskDetails = (task:Task) => {
        setTaskDetail(task)
        setModalShow(true)
    };
    // end of show task details

    // setting initial state for global search
    const [filtering, setFiltering] = useState('')

    // getting all tasks in the redux store
    const tasks = useAppSelector(getAllTasks);


    // ---- setting up columns to be used by the task table
    const columnHelper = createColumnHelper<Task>()

    const COLUMNS = [
        columnHelper.accessor('subject', {
          header: "Subject",
          footer: "Subject",
          cell: (prop) => (
            <Button variant='link' onClick={() => handleShowTaskDetails(prop.row.original)}><strong>{prop.getValue()}</strong></Button>
          )
        }),
        columnHelper.accessor('description', {
          header: "Description",
          footer: "Description",
          cell: (prop) => (
            <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="tooltip-bottom">
                    {prop.getValue()}
                </Tooltip>
            }
            >
            <a href='#' style={{textDecoration: "none"}} className='text-black'>{prop.getValue().substring(0, 44)+ " ..."}</a>
        </OverlayTrigger>
          )
        }),
        columnHelper.accessor('task_priority', {
          header: "Task Priority",
          footer: "Task Priority",
          cell: (props) => (
            <h5>
                <Badge bg={props.getValue() === "high"?"danger": props.getValue() === "normal"?"warning":"info"} text="dark">{props.getValue()}</Badge>
            </h5>
          )
        }),
        columnHelper.accessor('status_id', {
          header: "Status",
          footer: "Status",
          cell: (props) => (
            <Dropdown>
                <Dropdown.Toggle variant="outline-info" id="dropdown-basic" size='sm'>
                    {props.getValue()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Open</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">In Progress</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Closed</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          )
        }),
        columnHelper.accessor('due_date', {
            header: "Due Date",
            footer: "Due Date",
            cell: (prop) => {
                const date = new Date(prop.getValue()).toLocaleDateString()
                return date
            }
          }),
        columnHelper.display({
          header: 'Action',
          footer: 'Action',
          cell: () => (
            <>
                <Button variant="primary" size='sm'><FaEdit /></Button> {" | "}
                <Button variant="danger" size='sm'><MdDelete /></Button>
            </>
          )
        }),
      ]
    //  ---- end of setting up columns to be used by the task table


    // task table configuration
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => tasks, [tasks])

    const tableInstance = useReactTable({ columns, data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setFiltering,
        state: {
            globalFilter: filtering
        },
    });
    // end of task table configuration


  return (
    <div className="container mt-5">
        <div className="row">
            <div className="col-md-12 mx-auto">
                <Card>
                    <Card.Header>
                        <strong>My Tasks</strong>
                        <InputGroup className="mt-3">
                            <InputGroup.Text id="basic-addon1"><FaSearch /></InputGroup.Text>
                            <Form.Control
                            onChange={(e) => setFiltering(e.target.value)}
                            value={filtering}
                            placeholder="Search here ..."
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                {tableInstance.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        </th>
                                    ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {tableInstance.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                        </td>
                                    ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/* ---- modal for showing task details ---- */}
                <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <strong>Task Details</strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th># Item</th>
                                <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Subject</th>
                                    <td>{taskDetail.subject}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{taskDetail.description}</td>
                                </tr>
                                <tr>
                                    <th>Task Priority</th>
                                    <td>{taskDetail.task_priority}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{taskDetail.status_id}</td>
                                </tr>
                                <tr>
                                    <th>Due Date</th>
                                    <td>{taskDetail.due_date && new Date(taskDetail.due_date).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th>Created On</th>
                                    <td>{taskDetail.created_at && new Date(taskDetail.created_at).toDateString()}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setModalShow(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
                {/* end of modal for showing task details */}

            </div>
        </div>
    </div>
  )
}

export default MyTable