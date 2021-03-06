import {Link, withRouter} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const onClickFindJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs,salary,information,company
            reviews. Find the job that fits your abilities.
          </p>
          <button
            type="button"
            className="find-jobs-button"
            onClick={onClickFindJobs}
          >
            <Link to="/jobs" className="nav-link">
              Find Jobs
            </Link>
          </button>
        </div>
      </div>
    </>
  )
}

export default withRouter(Home)
