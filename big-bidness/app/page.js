'use client'
import { Hero } from './components/Hero';
import { Search } from './components/Search';
import { Listings } from './components/Listings';
import { useState, React } from 'react';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  return (
    <div>
      <Hero/>
      <Search searchInput={searchInput} setSearchInput={setSearchInput}/>
      <Listings searchInput={searchInput} />
    </div>
  );
}
