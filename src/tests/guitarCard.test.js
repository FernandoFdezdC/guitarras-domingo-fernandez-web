import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import GuitarCard from '../components/guitarCard';
import { SiExpertsexchange } from 'react-icons/si';
import { FaNotEqual } from 'react-icons/fa';

test('', () => {
  const image = `/images/MODELO-A-FOTO-02.jpg`
  const title='guitar1'
  const description='description'

  const component = render(<GuitarCard image={image} title={title} description={description}/>)

  component.getByText(title)
  component.getByText(description)

  // To view component elements:
  // component.debug()

  // Alternative to getByText():
  // expect(component.container).toHaveTextContent(title)
})