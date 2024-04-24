interface IStep {
  label: string
  key: string
  nextCondition?: boolean
}

export default IStep