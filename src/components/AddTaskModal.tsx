import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { createNewTask, isLoading } from '../features/taskSlice';
import { useAppDispatch, useAppSelector } from '../application/store';
import { unwrapResult } from '@reduxjs/toolkit'
import Spinner from 'react-bootstrap/Spinner';

interface Prop {
    show: boolean;
    onHide: () => void
}

function AddTaskModal(props: Prop) {

    const loading = useAppSelector(isLoading)

    const dispatch = useAppDispatch()

    const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        dispatch(createNewTask(formData))
        .then(unwrapResult)
        .then(() => {
            props.onHide()
        })
    }

  return (
    <Modal
      {...props}
      size="lg"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <strong>Add Task</strong>
        </Modal.Title>
      </Modal.Header>
        <Form onSubmit={handleAddTask}>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicSubject">
                    <Form.Label><strong>Subject:</strong></Form.Label>
                    <Form.Control autoFocus type="text" name="subject" placeholder="Enter subject ..." required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPriority">
                    <Form.Label><strong>Task Priority:</strong></Form.Label>
                    <Form.Select name='task_priority' required>
                        <option></option>
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label><strong>Description:</strong></Form.Label>
                    <Form.Control as="textarea" name='description' rows={3} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSubject">
                    <Form.Label><strong>Due Date:</strong></Form.Label>
                    <Form.Control type="date" name='due_date' placeholder="Enter subject ..." />
                </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit">{loading?<Spinner animation="border" size="sm" />:"Submit"}</Button>
            </Modal.Footer>
        </Form>
    </Modal>
  )
}

export default AddTaskModal