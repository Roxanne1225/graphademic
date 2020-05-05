import axios from 'axios'

export function fetchResearcherByResearcherName(researcherName) {
  return axios
    .get(`/api/researchers?researcherName=${researcherName}`)
    .then(res => res.data)
}