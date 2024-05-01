import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteTask, isLoading } from '../features/taskSlice';
import { useAppDispatch, useAppSelector } from '../application/store';
import { unwrapResult } from '@reduxjs/toolkit'
import Spinner from 'react-bootstrap/Spinner';

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

interface Prop {
    show: boolean;
    onHide: () => void;
    deleteTaskDetails: Task
}

function DeleteModal(props: Prop) {

    const loading = useAppSelector(isLoading)

    const dispatch = useAppDispatch();

    const handleDeleteTask = (id: string) => {
        dispatch(deleteTask(id))
        .then(unwrapResult)
        .then(() => {
            props.onHide()
        })
    }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <strong>Delete Task</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className='text-center'><strong>Task Subject</strong></h5>
        <h5 className='text-center'>{props.deleteTaskDetails.subject}</h5>
        <h4 className='text-danger text-center'>Are you sure you want to delete this task?</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onHide}>Close</Button>
        <Button variant='danger' onClick={() => handleDeleteTask(props.deleteTaskDetails.id)}>{loading?<Spinner animation="border" size="sm" />:"Delete"}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteModal