import Header from '../components/header'
import Footer from '../components/footer'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
      <Header />
      <div className="mt-35"> {/*thêm margin-top để header không bị che*/}
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default MainLayout
