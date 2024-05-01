import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaEdit, FaSearch, FaCaretSquareUp, FaCaretSquareDown } from "react-icons/fa";
import { MdDelete, MdAdd } from "react-icons/md";
import { useAppSelector, useAppDispatch } from '../application/store';
import { getAllTasks, isLoading, statusLoading } from '../features/taskSlice';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, createColumnHelper, flexRender, getFilteredRowModel } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from './PaginationComp';
import AddTaskModal from './AddTaskModal';
import { startTask } from '../features/taskSlice';
import EditTaskModal from './EditTaskModal';
import DeleteModal from './DeleteModal';

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

interface ColumnSort {
    id: string;
    desc: boolean;
};

function MyTable() {

    const dispatch = useAppDispatch()

    // delete task details
    const [deleteTaskDetails, setDeleteTaskDetails] = useState({} as Task)
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleDeleteTaskDetails = (task: Task) => {
        setDeleteTaskDetails(task)
        setDeleteModalShow(true)
    }

    // edit task details
    const [editTaskDetails, setEditTaskDetails] = useState({} as Task)
    const [editModalShow, setEditModalShow] = useState(false);

    const handleEditTaskDetails = (task: Task) => {
        setEditTaskDetails(task)
        setEditModalShow(true)
    }
 
    // task status management
    const handleStartProgress = (id: string, status: string) => {
        const taskMan = {
            id: id,
            status: status
        }
        dispatch(startTask(taskMan))
    }

    // handle open and close of add task modal
    const [addModalShow, setAddModalShow] = useState(false);


    // show task details
    const [taskDetail, setTaskDetail] = useState({} as Task)

    const [modalShow, setModalShow] = useState(false);

    const handleShowTaskDetails = (task:Task) => {
        setTaskDetail(task)
        setModalShow(true)
    };
    // end of show task details

    // setting initial state for global search and sort
    const [filtering, setFiltering] = useState('')
    const [sorting, setSorting] = useState<ColumnSort[]>([]);

    // getting all tasks in the redux store
    const tasks = useAppSelector(getAllTasks);
    const isloading = useAppSelector(isLoading)
    const statusloading = useAppSelector(statusLoading)


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
          cell: (props) => {
            if(statusloading) {
                return (
                    <>
                        <Spinner animation="grow" variant="success" size='sm' />
                        <Spinner animation="grow" variant="info" size='sm' />
                    </>
                )
            }else {
                return (
                    <Dropdown>
                        <Dropdown.Toggle variant={props.getValue() === "open"?"outline-info":props.getValue() === "in_progress"?"outline-warning":"outline-success"} id="dropdown-basic" size='sm'>
                            {props.getValue()}
                        </Dropdown.Toggle>

                        {props.getValue() === "closed"?
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleStartProgress(props.row.original.id, "reopen")}>Re-open</Dropdown.Item>
                            </Dropdown.Menu>:
                            props.getValue() === "open"?
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleStartProgress(props.row.original.id, "start_progress")}>In Progress</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStartProgress(props.row.original.id, "close")}>Closed</Dropdown.Item>
                            </Dropdown.Menu>:
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleStartProgress(props.row.original.id, "stop_progress")}>Open</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStartProgress(props.row.original.id, "close")}>Closed</Dropdown.Item>
                            </Dropdown.Menu>
                        }      
                    </Dropdown>
                )
            }
            
          }
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
          cell: (prop) => (
            <>
                <Button variant="primary" size='sm' onClick={() => handleEditTaskDetails(prop.row.original)}><FaEdit /></Button> {" | "}
                <Button variant="danger" size='sm' onClick={() => handleDeleteTaskDetails(prop.row.original)}><MdDelete /></Button>
            </>
          )
        }),
      ]
    //  ---- end of setting up columns to be used by the task table


    // task table configuration
    const columns = useMemo(() => COLUMNS, [statusloading])
    const data = useMemo(() => tasks, [tasks])

    const tableInstance = useReactTable({ columns, data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting,
        state: {
            globalFilter: filtering,
            sorting: sorting
        },
    });
    // end of task table configuration


  return (
    <div className="container mt-5">
        <div className="row">
            <div className="col-md-12 mx-auto">
                <Card>
                    <Card.Header>
                        <div className="d-flex">
                            <div className="px-2 flex-grow-1"><strong>My Tasks</strong></div>
                            <div className="px-2"><Button variant="secondary" onClick={() => setAddModalShow(true)}><MdAdd /> Add Task</Button></div>
                        </div>
                        <InputGroup className="mt-2">
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
                                        <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}

                                            {
                                                header.column.getIsSorted() === 'asc'
                                                    ? <FaCaretSquareUp className='mx-3' />
                                                    : header.column.getIsSorted() === 'desc'
                                                        ? <FaCaretSquareDown className='mx-3' />
                                                        : null
                                            }
                                        </th>
                                    ))}
                                    </tr>
                                ))}
                            </thead>
                            {isloading?
                                <tbody>
                                    <tr>
                                        <td className='text-center' colSpan={6}>
                                            <Spinner animation="grow" variant="secondary" size="sm" />
                                            <Spinner animation="grow" variant="secondary" size="sm" />
                                            <Spinner animation="grow" variant="secondary" size="sm" />
                                            <Spinner animation="grow" variant="secondary" size="sm" />
                                            <Spinner animation="grow" variant="secondary" size="sm" />
                                            <Spinner animation="grow" variant="secondary" size="sm" />
                                        </td>
                                    </tr>
                                </tbody>:

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
                            }
                            
                        </Table>

                        {/* pagination component */}
                        <div className="d-flex justify-content-end">
                            <Pagination />
                        </div>
                        
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

                {/* modal for adding tasks */}
                <AddTaskModal show={addModalShow} onHide={() => setAddModalShow(false)} />
                {/* end of modal for adding tasks */}

                {/* modal for adding tasks */}
                <EditTaskModal show={editModalShow} onHide={() => setEditModalShow(false)} editTaskDetails={editTaskDetails} />
                {/* end of modal for adding tasks */}

                {/* modal for adding tasks */}
                <DeleteModal show={deleteModalShow} onHide={() => setDeleteModalShow(false)} deleteTaskDetails={deleteTaskDetails} />
                {/* end of modal for adding tasks */}

            </div>
        </div>
    </div>
  )
}

export default MyTable