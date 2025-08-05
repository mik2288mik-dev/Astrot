/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Page, Navbar, List, ListInput, Button } from 'konsta/react';
import Koteus from '../components/Koteus';

export default function NatalFormPage({ f7router }) {
  const [formData, setFormData] = useState({ name: '', date: '', time: '', city: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.time || !formData.city) {
      setError('Мяу! Заполни все поля.');
      return;
    }
    setError('');
    f7router.navigate('/natal-result/', { props: { data: formData } });
  };

  return (
    <Page className="p-4">
      <Navbar title="Форма" />
      <Koteus error={error} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <List className="neon-input">
          <ListInput
            label="Имя"
            name="name"
            type="text"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <ListInput
            label="Дата рождения"
            name="date"
            type="date"
            placeholder="Дата"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <ListInput
            label="Время рождения"
            name="time"
            type="time"
            placeholder="Время"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <ListInput
            label="Город рождения"
            name="city"
            type="text"
            placeholder="Город"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </List>
        <Button type="submit" className="neon-btn w-full">Построить натальную карту</Button>
      </form>
    </Page>
  );
}
