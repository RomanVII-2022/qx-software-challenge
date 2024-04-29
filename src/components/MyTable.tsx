import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function MyTable() {

  return (
    <div className="container mt-5">
        <div className="row">
            <div className="col-md-12 mx-auto">
                <Card>
                    <Card.Header><strong>My Tasks</strong></Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Description</th>
                                    <th>Task Priority</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th className='text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <a href='#'>
                                            <strong>
                                                Coaching Social Marketing Strategy
                                            </strong>
                                        </a>
                                    </td>
                                    <td>
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={
                                                <Tooltip id="tooltip-bottom">
                                                    Develop a plan to coach on utilizing social media for marketing..
                                                </Tooltip>
                                            }
                                            >
                                            <a href='#' style={{textDecoration: "none"}} className='text-black'>Develop a plan to coach on utilizing so...</a>
                                        </OverlayTrigger>
                                    </td>
                                    <td className='text-center'>
                                        <h5><Badge bg="warning" text="dark">
                                            Warning
                                        </Badge></h5>
                                    </td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic" size='sm'>
                                                In Progress
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    <td>April 29th 2024</td>
                                    <td className='text-center'>
                                        <Button variant="primary" size='sm'><FaEdit /></Button> {" | "}
                                        <Button variant="danger" size='sm'><MdDelete /></Button>   
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </div>
  )
}

export default MyTable