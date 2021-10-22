import './index.css'

const Skills = props => {
  const {skillDetails} = props

  const {imageUrl, name} = skillDetails
  return (
    <li className="skill-item">
      <img src={imageUrl} alt={name} className="skill-image" />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default Skills
