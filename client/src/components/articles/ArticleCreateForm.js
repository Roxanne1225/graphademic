import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const ArticleCreateForm = ({ onCreate }) => {
  const [article, setArticle] = useState({});

  const makeHandleChange = (field, type) => (e) => {
    let value = e.target.value;
    if (type === "integer") {
      value = parseInt(value);
    }

    setArticle({
      ...article,
      [field]: value,
    });
  };

  const handleAuthorsChange = (e) => {
    setArticle({
      ...article,
      authors: e.target.value.split(","),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(article);
  };

  return (
    <Card className='mt-5'>
      <Card.Body>
        <Card.Title>Create an Article</Card.Title>
        <Form>
          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              onChange={makeHandleChange("title", "string")}
              type='text'
              placeholder='enter a title'
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Authors</Form.Label>
            <Form.Control
              onChange={handleAuthorsChange}
              type='text'
              placeholder="enter authors as a list of comma-separated names eg. 'Bob, Joe, Sam'"
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Year Published</Form.Label>
            <Form.Control
              onChange={makeHandleChange("publishYear", "integer")}
              type='text'
              placeholder='enter the year published'
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>URL</Form.Label>
            <Form.Control
              type='text'
              onChange={makeHandleChange("url", "string")}
              placeholder='enter the URL'
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Number of Citations</Form.Label>
            <Form.Control
              onChange={makeHandleChange("citations", "integer")}
              type='text'
              placeholder='enter the number of citations this article has'
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Field ID</Form.Label>
            <Form.Control
              onChange={makeHandleChange("fieldID", "integer")}
              type='text'
              placeholder='enter the Field ID'
            />
          </Form.Group>

          <Button onClick={handleSubmit} variant='primary' type='button'>
            Create article
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ArticleCreateForm;
