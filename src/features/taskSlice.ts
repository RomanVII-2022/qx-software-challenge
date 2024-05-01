// this slice will be used to:
// 1. fetch, create, update, and delete tasks from the task api
// 2. handle the response - pending, fullfilled, rejected
// 3. maintain the states tied to tasks

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../application/store";
import Swal from 'sweetalert2';

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

interface InitialState {
    data: Task[];
    loading: boolean;
    statusLoad: boolean;
    message: string;
    page: number;
    per_page: number;
    total: number
}

interface PageData {
    page: number;
    perPage: number
}

interface TaskMan {
    id: string;
    status: string
}

// get all tasks
export const fetchAllTasks = createAsyncThunk("task/fetchAllTasks", async (pageData: PageData) => {
    if (!pageData) {
        const response = await axios.get<InitialState>("/tasks?page=1&per_page=10")
        return response.data
    } else {
        const response = await axios.get<InitialState>(`/tasks?page=${pageData.page}&per_page=${pageData.perPage}`)
        return response.data
    }
})

// create a new task
export const createNewTask = createAsyncThunk("task/createNewTask", async (formData: FormData) => {
    if (!formData.get('due_date')) {
        formData.set('due_date', new Date().toISOString())
    }else {
        const dateString = formData.get('due_date');
        if (typeof dateString === 'string') {
            const dateObject = new Date(dateString);
            const formattedDate = dateObject.toISOString();
            formData.set('due_date', formattedDate)
        }
    }
    const response = await axios.post('/tasks', {
        task_priority: formData.get('task_priority'),
        subject: formData.get('subject'),
        description: formData.get('description'),
        due_date: formData.get('due_date')
    })
    return response.data
})

// change status of a task
export const startTask = createAsyncThunk('task/startTask', async (taskMan: TaskMan) => {
    const response = await axios.post<Task>(`/tasks/${taskMan.id}/${taskMan.status}`)
    return response.data
})

// edit a task
export const editTask = createAsyncThunk('task/editTask', async (formData: FormData) => {
    const task_id = formData.get('id')
    if (!formData.get('due_date')) {
        formData.set('due_date', new Date().toISOString())
    }else {
        const dateString = formData.get('due_date');
        if (typeof dateString === 'string') {
            const dateObject = new Date(dateString);
            const formattedDate = dateObject.toISOString();
            formData.set('due_date', formattedDate)
        }
    }
    const response = await axios.patch(`/tasks/${task_id}`, {
        task_priority: formData.get('task_priority'),
        subject: formData.get('subject'),
        description: formData.get('description'),
        due_date: formData.get('due_date')
    })
    return response.data
})

// delete a given task
export const deleteTask = createAsyncThunk('task/deleteTask', async (id: string) => {
    const response = await axios.delete(`/tasks/${id}`)
    return response.data
})

const initialState: InitialState = {
    data: [],
    loading: false,
    statusLoad: false,
    message: "",
    page: 1,
    per_page: 10,
    total: 0
}

const taskSlice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {},
    extraReducers: (builders) => {
        builders.addCase(fetchAllTasks.pending, (state) => {
            state.loading = true
        })
        builders.addCase(fetchAllTasks.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload.data
            state.page = action.payload.page
            state.per_page = action.payload.per_page
            state.total = action.payload.total
        })
        builders.addCase(fetchAllTasks.rejected, (state) => {
            state.loading = false
        })
        builders.addCase(createNewTask.pending, (state) => {
            state.loading = true
        })
        builders.addCase(createNewTask.fulfilled, (state, action) => {
            state.loading = false
            state.data.push(action.payload)
            state.total = state.total + 1
            Swal.fire({
                icon: 'success',
                text: 'Task added successfully',
                footer: 'Thank You.',
                showConfirmButton: false,
                timer: 5000
            })
        })
        builders.addCase(createNewTask.rejected, (state) => {
            state.loading = false
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Try again!',
                showConfirmButton: false,
                timer: 5000
            })
        })
        builders.addCase(startTask.pending, (state) => {
            state.statusLoad = true
        })
        builders.addCase(startTask.fulfilled, (state, action) => {
            state.statusLoad = false
            const {id, status_id} = action.payload
            const findTask = state.data.find((task) => task.id === id)
            if(findTask) {
                findTask.status_id = status_id
                Swal.fire({
                    icon: 'success',
                    text: 'Status updated successfully',
                    footer: 'Thank You.',
                    showConfirmButton: false,
                    timer: 5000
                })
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Task not found. Try again!',
                    showConfirmButton: false,
                    timer: 5000
                })
            }
        })
        builders.addCase(startTask.rejected, (state) => {
            state.statusLoad = false
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Try again!',
                showConfirmButton: false,
                timer: 5000
            })
        })
        builders.addCase(editTask.pending, (state) => {
            state.loading = true
        })
        builders.addCase(editTask.fulfilled, (state, action) => {
            state.loading = false
            const {id, subject, description, task_priority, due_date, status_id} = action.payload
            const findTask = state.data.find((task) => task.id === id)
            if(findTask) {
                findTask.subject = subject
                findTask.description = description
                findTask.task_priority = task_priority
                findTask.due_date = due_date
                findTask.status_id = status_id
                Swal.fire({
                    icon: 'success',
                    text: 'Task updated successfully',
                    footer: 'Thank You.',
                    showConfirmButton: false,
                    timer: 5000
                })
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Task not found. Try again!',
                    showConfirmButton: false,
                    timer: 5000
                })
            }
        })
        builders.addCase(editTask.rejected, (state) => {
            state.loading = false
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Try again!',
                showConfirmButton: false,
                timer: 5000
            })
        })
        builders.addCase(deleteTask.pending, (state) => {
            state.loading = true
        })
        builders.addCase(deleteTask.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.deleted) {
                state.data = state.data.filter(task => task.id !== action.payload.id)
                state.total = state.total - 1
                Swal.fire({
                    icon: 'success',
                    text: 'Task deleted successfully.',
                    footer: 'Thank You.',
                    showConfirmButton: false,
                    timer: 3000
                })
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Task not found. Try again!',
                    showConfirmButton: false,
                    timer: 5000
                })
            }
        })
        builders.addCase(deleteTask.rejected, (state) => {
            state.loading = false
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Try again!',
                showConfirmButton: false,
                timer: 5000
            })
        })
    }
})

export default taskSlice.reducer;
export const getAllTasks = (state: RootState) => state.task.data
export const isLoading = (state: RootState) => state.task.loading
export const statusLoading = (state: RootState) => state.task.statusLoad
export const currentPage = (state: RootState) => state.task.page
export const totalTasks = (state: RootState) => state.task.total
export const tasksPerPage = (state: RootState) => state.task.per_page
