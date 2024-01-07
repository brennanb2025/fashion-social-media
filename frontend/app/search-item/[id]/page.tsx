"use client";
import React, { useState, useEffect } from 'react';
import globalStyles from '@/app/styles/myGlobals.module.css'
import axios from 'axios';
//import { SearchItemProps } from '@/app/types/Item';
import { Item, UserPost } from '@/app/types/UserPost';
import { Navbar } from '@/app/components/Navbar';
import PostImageCarousel from '@/app/components/PostImageCarousel';
import PostBar from '@/app/components/PostBar';
import styles from '@/app/styles/userPostGrid.module.css'
import Post from '@/app/components/Post';
import Link from 'next/link';
import { User } from '@/app/types/User';

export default function SearchItem({ params }: { params: { id: number } }) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [item, setItem] = useState<Item>({} as Item);

  //TODO: fix user
  const user = {
    id:1,
    profile_picture:'https://fsm-app-bucket.s3.amazonaws.com/post_media/1/07f48359-c5ac-4824-a18e-1f5b8cf12818',
  } as User

  const fetchPosts = () => {
    axios.get<UserPost[]>(`http://localhost:8000/api/items/${params.id}/posts/`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  };
  const fetchItem = () => {
    axios.get<Item>(`http://localhost:8000/api/items/${params.id}/`)
      .then((res) => setItem(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchItem()
    fetchPosts();
  }, []);

  const renderPosts = () => {
    return posts.map((post) => (
      <Post user={ user } post={ post } />
    ));
  };

  const renderItem = () => {
    return (
      <div>
        <h1 className='m-4'>Item: {item.title} from 
        <Link href={`/search-brand/${item.brand}`} className=' ms-3 me-2'>
          {item.brand}
        </Link> ({item.item_type}) </h1>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className={globalStyles.text1}>
          {renderItem()}
          {renderPosts()}
        </div>
      </main>
    </div>
  );
};