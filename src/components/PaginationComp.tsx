import Pagination from 'react-bootstrap/Pagination';
import { useAppSelector, useAppDispatch } from '../application/store';
import { currentPage, totalTasks, tasksPerPage } from '../features/taskSlice';
import { useEffect, useState } from 'react';
import { fetchAllTasks } from '../features/taskSlice';


function PaginationComp() {

    const dispatch = useAppDispatch()

    const handleGoTonextPage = (page: number, perPage: number) => {
      const pageData = {
        page: page,
        perPage: perPage
      }
      dispatch(fetchAllTasks(pageData))
    }

    const [count, setCount] = useState(0)

    const page = useAppSelector(currentPage)
    const total = useAppSelector(totalTasks)
    const perPage = useAppSelector(tasksPerPage)

    const getPages = (allTasks: number, tasksPerPage: number) => {
      if (allTasks > 0) {
        const pages = allTasks / tasksPerPage;
        setCount(Math.ceil(pages))
      }
    }

    useEffect(() => {
      getPages(total, perPage)
    }, [total, perPage])


  return (
    <Pagination>
      <Pagination.First onClick={() => handleGoTonextPage(1, 10)} />
        {Array.from({ length: count }, (_, index) => (
          <Pagination.Item key={index} active={page === index + 1?true:false} onClick={() => handleGoTonextPage(index + 1, 10)}>{index + 1}</Pagination.Item>
        ))}
      <Pagination.Last onClick={() => handleGoTonextPage(count, 10)} />
    </Pagination>
  )
}

export default PaginationComp