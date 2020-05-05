import axios from 'axios'

export function fetchResearcherByResearcherName(researcherName) {
  return axios
    .get(`/api/researchers/${researcherName}`)
    .then(res => res.data)
}

export function deleteResearcherByResearcherId(researcherId) {
  return axios({
    method: 'DELETE',
    url: `/api/researchers/${researcherId}`
  }).then(res => res.data)
}

export function updateResearcherByResearcherId(researcherId, updateObject) {
  return axios({
    method: 'PUT',
    url: `/api/researchers/${researcherId}`,
    data: updateObject
  }).then(res => res.data);
}

export function createResearcher(researcher) {
  return axios({
    method: 'POST',
    url: `/api/researchers/`,
    data: researcher
  }).then(res => res.data)
}