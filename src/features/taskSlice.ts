// this slice will be used to:
// 1. fetch all the tasks from the task api
// 2. hand the response - pending, fullfilled, rejected
// 3. maintain the states tied to tasks

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../application/store";

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
    tasks: Task[];
    loading: boolean;
    message: string
}

export const fetchAllTasks = createAsyncThunk("task/fetchAllTasks", async () => {
    const response = await axios.get("/tasks")
    return response.data
})

const initialState: InitialState = {
    tasks: [],
    loading: false,
    message: ""
}

const taskSlice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {},
    extraReducers: (builders) => {
        builders.addCase(fetchAllTasks.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchAllTasks.fulfilled, (state, action) => {
            state.loading = false
            state.tasks = action.payload.data
        })
        builders.addCase(fetchAllTasks.rejected, (state, action) => {
            state.loading = false
        })
    }
})

export default taskSlice.reducer;
export const getAllTasks = (state: RootState) => state.task.tasks
