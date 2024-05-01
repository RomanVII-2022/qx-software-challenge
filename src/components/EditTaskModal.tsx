import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { editTask, isLoading } from '../features/taskSlice';
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
    editTaskDetails: Task
}

function EditTaskModal(props: Prop) {

    const loading = useAppSelector(isLoading)

    const dispatch = useAppDispatch()

    const handleEditTask = (event: React.FormEvent<HTMLFormElement>, id: string) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.set('id', id)
        dispatch(editTask(formData))
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
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <strong>Edit Task</strong>
        </Modal.Title>
      </Modal.Header>
        <Form onSubmit={(e) => handleEditTask(e, props.editTaskDetails.id)}>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicSubject">
                    <Form.Label><strong>Subject:</strong></Form.Label>
                    <Form.Control type="text" name="subject" defaultValue={props.editTaskDetails.subject} placeholder="Enter subject ..." required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPriority">
                    <Form.Label><strong>Task Priority:</strong></Form.Label>
                    <Form.Select name='task_priority' defaultValue={props.editTaskDetails.task_priority} required>
                        <option></option>
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label><strong>Description:</strong></Form.Label>
                    <Form.Control as="textarea" name='description' rows={3} defaultValue={props.editTaskDetails.description} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSubject">
                    <Form.Label><strong>Due Date:</strong></Form.Label>
                    <Form.Control type="date" 
                    name='due_date' 
                    defaultValue={props.editTaskDetails.due_date && new Date(props.editTaskDetails.due_date).toISOString().split('T')[0]} 
                    placeholder="Enter subject ..." />
                </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit">{loading?<Spinner animation="border" size="sm" />:"Update"}</Button>
            </Modal.Footer>
        </Form>
    </Modal>
  )
}

export default EditTaskModal