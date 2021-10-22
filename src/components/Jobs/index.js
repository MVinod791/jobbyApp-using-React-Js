import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import JobCard from '../JobCard'
import FilterGroup from '../FilterGroup'
import Header from '../Header'
import Profile from '../Profile'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstantStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiConstantStatus.initial,
    jobsList: [],
    searchInput: '',
    activeEmploymentId: '',
    activeSalaryId: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiConstantStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmploymentId, activeSalaryId, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentId}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        pkgPerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiConstantStatus.success,
      })
    } else {
      this.setState({apiStatus: apiConstantStatus.failure})
    }
  }

  onChangeSearchInput = event => {
    const {value} = event.target
    this.setState({searchInput: value}, this.getJobs)
  }

  enterSearchInput = searchInput => {
    if (searchInput.key === 'enter') {
      this.getJobs()
    }
  }

  renderSearchInputFiled = () => {
    const {searchInput} = this.state
    return (
      <div className="desktop-search-container ">
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          className="search-input"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          testid="searchButton"
          className="search-icon-btn"
          onKeyDown={this.enterSearchInput}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderSearchInputMobile = () => {
    const {searchInput} = this.state
    return (
      <div className="mobile-search-container ">
        <input
          value={searchInput}
          type="search"
          placeholder="Search"
          className="search-input"
        />
        <button type="button" testid="searchButton" className="search-icon-btn">
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const showJobsList = jobsList.length > 0

    return (
      <div className="all-jobs-container">
        {this.renderSearchInputFiled()}
        {showJobsList ? (
          <ul className="jobs-list">
            {jobsList.map(eachJob => (
              <JobCard jobData={eachJob} key={eachJob.id} />
            ))}
          </ul>
        ) : (
          <div className="no-jobs-found-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="job-failure-img"
            />
            <h1 className="job-failure-heading-text">
              Oops! Something Went Wrong
            </h1>
            <p className="job-failure-description-text">
              We cannot seem to find the page you are looking for
            </p>
            <button type="button" className="retry-button">
              Retry
            </button>
          </div>
        )}
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1 className="job-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="job-failure-description-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.renderLoaderView()}
      >
        Retry
      </button>
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantStatus.success:
        return this.renderJobsList()
      case apiConstantStatus.failure:
        return this.renderFailureView()
      case apiConstantStatus.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  onChangeEmployTypes = id => {
    this.setState({activeEmploymentId: id}, this.getJobs)
  }

  renderEmploymentTypesList = () => {
    const {activeEmploymentId} = this.state
    return employmentTypesList.map(empType => (
      <li key={empType.employmentTypeId} className="items">
        <input type="checkbox" className="input" id="emp" />
        <label htmlFor="emp" className="label-name" value="label">
          {empType.label}
        </label>
      </li>
    ))
  }

  conCLickSalaryRangeList = event => {
    const {jobsList, activeSalaryId} = this.state
    const {value} = event.target
  }

  renderSalaryRangesList = () => {
    const {activeSalaryId} = this.state
    return salaryRangesList.map(salary => (
      <li className="items" key={salary.salaryRangeId}>
        <input
          type="radio"
          className="input"
          name="salary"
          id="input-radio"
          value={activeSalaryId}
          onClick={this.onCLickSalaryRangeList}
          onChange={this.onChangeSalary}
        />
        <label value="label" htmlFor="input-radio" className="label-name">
          {salary.label}
        </label>
      </li>
    ))
  }

  render() {
    const {activeEmploymentId, activeSalaryId, jobsList} = this.state
    const filteredSalary = jobsList.filter(
      eachEmp => eachEmp.pkgPerAnnum === activeSalaryId,
    )
    console.log(filteredSalary)
    const showJobsList = jobsList.length > 0
    return (
      <>
        <Header />
        <div className="jobs-section">
          <div className="all-jobs-section">
            <div>
              {this.renderSearchInputMobile()}
              <Profile />
              <h1 className="heading">Type of Employment</h1>
              <ul className="emp-types-list">
                {this.renderEmploymentTypesList()}
              </ul>
              <hr className="line" />
              <h1 className="heading">Salary Range</h1>
              <ul className="salary-range-list">
                {this.renderSalaryRangesList()}
              </ul>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
