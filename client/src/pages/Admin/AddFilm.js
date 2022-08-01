import { Form, Button } from 'react-bootstrap'
import '../../styles/style.css'
import file from '../../assets/file.svg'
import { useMutation } from 'react-query';
import { API } from '../../config/api';
import { useNavigate } from 'react-router';
import { useState } from 'react'

export default function AddFilm() {

let navigate = useNavigate();

const [form, setForm] = useState({
    title: '',
    image: '',
    category: '',
    price: '',
    link: '',
    desc: '',
    }); //Store product data

// Handle change data on form
const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    });
}
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      formData.set('title', form.title);
      formData.set('image', form.image[0], form.image[0].name);
      formData.set('category', form.category);
      formData.set('price', form.price);
      formData.set('link', form.link);
      formData.set('desc', form.desc);

      console.log(form);

      // Insert product data
      const response = await API.post('/Film', formData, config);
      console.log(response);

      navigate('/admin');
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="edit-container">
    <p className="table-title">Add Film</p>
    <Form onSubmit={(e) => handleSubmit.mutate(e)}>
    <Form.Group className='header-add-film'>
        <Form.Control type="text"  name="title" placeholder="title" className='mt-3 setting-left' onChange={handleChange}></Form.Control>
        <label for="upload"  className="label-file-add-product">
        Attach Thumbnail <img src={file} alt='' style={{ width: '15px', marginLeft: '5px' }}/>
        </label>
        <input id="upload" type='file' name="image" onChange={handleChange} hidden/>
    </Form.Group>
    <Form.Group>
        <Form.Control type="text" name="category" placeholder="Category" className='mt-3 input-setting' onChange={handleChange}></Form.Control>
    </Form.Group>
    <Form.Group>
        <Form.Control type="number" name="price" placeholder="Price" className='mt-3 input-setting' onChange={handleChange}></Form.Control>
    </Form.Group>
    <Form.Group>
        <Form.Control type="text" name="link" placeholder="Link Film" className='mt-3 input-setting' onChange={handleChange}></Form.Control>
    </Form.Group>
    <Form.Group>
        <Form.Control as="textarea" name="desc" rows={3} placeholder="Description" className='mt-3 input-setting' onChange={handleChange}></Form.Control>
    </Form.Group>
    <Button variant="success" type="submit" className="button-login-login mt-3">Save</Button>
    </Form>
</div>
  )
}
