import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import MyTable from './components/MyTable';
import { useAppDispatch } from './application/store';
import { useEffect } from 'react';
import { fetchAllTasks } from './features/taskSlice';

function App() {

  const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllTasks())
    }, [dispatch])

  return (
      <>
        <NavBar />
        <MyTable />
      </>
  )
}

export default App