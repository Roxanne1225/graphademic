import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'

import GraphVisualization from '../components/explore/GraphVisualization'

import { fetchGraphByArticleSubject } from '../api/ArticleClient'


const ExploreContainer = () => {
  const [subject, setSubject] = useState("")
  const [data, setData] = useState(undefined)

  const handleSubmit = () => {
    fetchGraphByArticleSubject(subject).then(data => {
      const articles = new Set(data.nodes.map(e => e.id))

      const nodes = data.nodes.map(node => ({
        ...node,
        name: node.title,
        radius: node.size / 1.5 > 5 ? node.size / 1.5 : 5
      }))
      const links = data.links
        .filter(({ source, target }) => articles.has(source) && articles.has(target))

      console.log({
        nodes,
        links
      })
      setData({
        nodes,
        links
      })
    })
  }

  return (
    <Container className='pt-5'>
      <Row>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>Keyword:</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl value={subject} onChange={e => setSubject(e.target.value)} />
          <InputGroup.Append>
            <Button onClick={handleSubmit}>Search</Button>
          </InputGroup.Append>
        </InputGroup>
      </Row>
      <Row>
        {
          data ? (
            <div style={{
              border: '1px solid #A0A0A0',
              borderRadius: '.5em',
              height: '50vh',
              width: '100%'
            }}>
              <GraphVisualization data={data} />
            </div>
          ) : <h5 className='text-center pt-2w'>No results.</h5>
        }
      </Row>
    </Container>
  )
}

export default ExploreContainer